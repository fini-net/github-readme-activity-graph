import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import moment from 'moment';
import {
    Query,
    UserDetails,
    Week,
    ContributionDay,
    ResponseOfApi,
    ContributionsCollection,
} from 'src/interfaces/interface';

dotenv.config();

// One [from, to] window to fetch; index 0 is the current window, the rest
// are the ghost windows trailing it.
interface ContributionWindow {
    from: string;
    to: string;
}

export class Fetcher {
    private readonly username: string;
    constructor(username: string) {
        this.username = username;
    }

    private getGraphQLQuery(windows: ContributionWindow[]) {
        // Every window is aliased into a single request (c0 = current, then
        // one per ghost), so ghost lines cost no extra HTTP requests.
        const variableDefinitions = windows
            .map((_, i) => `$FROM${i}: DateTime!, $TO${i}: DateTime!`)
            .join(', ');
        const contributions = windows
            .map(
                (_, i) => `
                c${i}: contributionsCollection(from: $FROM${i}, to: $TO${i}) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }`,
            )
            .join('');

        const variables: Query['variables'] = {
            LOGIN: this.username,
        };
        windows.forEach((window, i) => {
            variables[`FROM${i}`] = window.from;
            variables[`TO${i}`] = window.to;
        });

        return {
            query: `
              query userInfo($LOGIN: String!, ${variableDefinitions}) {
                user(login: $LOGIN) {
                  name
                  ${contributions}
                }
              }
            `,
            variables,
        };
    }

    private async fetch(graphQLQuery: Query): Promise<AxiosResponse<ResponseOfApi>> {
        return axios({
            url: 'https://api.github.com/graphql',
            method: 'POST',
            headers: {
                Authorization: `bearer ${process.env.TOKEN}`,
            },
            data: graphQLQuery,
        });
    }

    // Flatten one window's calendar weeks into a day list, converting each
    // date to the day-of-month string used for the graph's X labels.
    private flattenWeeks(collection: ContributionsCollection): ContributionDay[] {
        const days: ContributionDay[] = [];
        collection.contributionCalendar.weeks.forEach((week: Week) =>
            week.contributionDays.forEach((contributionDay: ContributionDay) => {
                days.push({
                    contributionCount: contributionDay.contributionCount,
                    date: moment(contributionDay.date, moment.ISO_8601).date().toString(),
                });
            }),
        );
        return days;
    }

    public async fetchContributions(
        days: number,
        customFromDate?: string,
        customToDate?: string,
        ghosts = 0,
    ): Promise<UserDetails | string> {
        let from = '',
            to = '';
        if (customFromDate && customToDate) {
            from = moment(customFromDate).utc().toISOString(true);
            to = moment(customToDate).utc().toISOString(true);
        } else {
            const now = moment();
            from = moment(now).subtract(days, 'days').utc().toISOString();
            // also include the next day in case our server is behind in time with respect to GitHub
            to = moment(now).add(1, 'days').utc().toISOString();
        }

        // Ghost windows trail the current one: each is the current range
        // shifted back by its own length, so a 31-day graph with ghosts=2
        // shows this window plus the two 31-day windows before it,
        // index-aligned on the X-axis.
        const windowLength = moment(to).diff(moment(from), 'days');
        const windows: ContributionWindow[] = [{ from, to }];
        for (let i = 1; i <= ghosts; i++) {
            const ghostFrom = moment(from).subtract(i * windowLength, 'days');
            // GitHub only serves contributions for about the last year;
            // windows reaching further back are skipped, so fewer ghost
            // lines than requested may appear for long windows.
            if (ghostFrom.isBefore(moment().subtract(1, 'year'))) break;
            windows.push({
                from: ghostFrom.utc().toISOString(),
                to: moment(to)
                    .subtract(i * windowLength, 'days')
                    .utc()
                    .toISOString(),
            });
        }

        try {
            const apiResponse = await this.fetch(this.getGraphQLQuery(windows));

            if (apiResponse.data.errors) {
                console.error('API Error: ', apiResponse.data.errors);
                if (apiResponse.data.errors[0].type === 'RATE_LIMITED') {
                    console.log('GraphQL Error: API rate limit exceeded');
                    return '💥 API rate limit exceeded. Please deploy your own instance.';
                } else {
                    return `Can't fetch any contribution. Please check your username 😬`;
                }
            } else if (apiResponse.data.data) {
                if (apiResponse.data.data.user === null)
                    return `Can't fetch any contribution. Please check your username 😬`;
                else {
                    const user = apiResponse.data.data.user;
                    const userData: UserDetails = {
                        contributions: [],
                        name: user.name,
                    };

                    // Current window: if the last entry is 0, the day hasn't
                    // really started (or the user hasn't contributed today),
                    // so drop it and trim to the requested day count.
                    // Custom ranges are used exactly as returned.
                    const currentDays = this.flattenWeeks(user['c0']);
                    if (!(customFromDate && customToDate)) {
                        if (currentDays[currentDays.length - 1].contributionCount === 0) {
                            currentDays.pop();
                        }
                        const extra = currentDays.length - days;
                        currentDays.splice(0, extra);
                    }
                    userData.contributions = currentDays;

                    // Ghost windows are fully in the past, so there is no
                    // partial trailing day to drop: each is trimmed to the
                    // same day count as the current window by keeping the
                    // trailing days, which aligns index-for-index with the
                    // current series. Windows the API didn't return data
                    // for are skipped; a partially returned window (an
                    // account younger than the window) is padded at the
                    // front with zero days.
                    const targetLength = userData.contributions.length;
                    const ghostWindows = windows
                        .slice(1)
                        .map((_, i) => {
                            const collection = user[`c${i + 1}`];
                            if (!collection) return [];
                            const ghostDays = this.flattenWeeks(collection);
                            if (ghostDays.length === 0) return [];
                            if (ghostDays.length > targetLength) {
                                ghostDays.splice(0, ghostDays.length - targetLength);
                            } else if (ghostDays.length < targetLength) {
                                ghostDays.unshift(
                                    ...Array.from(
                                        { length: targetLength - ghostDays.length },
                                        () => ({ contributionCount: 0, date: '0' }),
                                    ),
                                );
                            }
                            return ghostDays;
                        })
                        .filter((ghost) => ghost.length > 0);
                    if (ghostWindows.length > 0) userData.ghosts = ghostWindows;

                    return userData;
                }
            } else {
                console.error('Unexpected API response structure');
                throw new Error('Unexpected API response structure');
            }
        } catch (error) {
            console.log('error: ', error);
            return `Can't fetch any contribution. Please check your username 😬`;
        }
    }
}
