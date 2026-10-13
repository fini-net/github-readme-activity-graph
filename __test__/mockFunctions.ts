import { dummyWeeksData, dummyGhostWeeksData } from './fakeInputs';

// The fixture is cloned per use so mocked windows never share (and never
// mutate) the same underlying data.
const weeks = () => {
    const data = JSON.parse(JSON.stringify(dummyWeeksData));
    for (let i = 1; i <= new Date().getDay(); i++) {
        data[6].contributionDays.push({
            contributionCount: 0,
        });
    }
    return data;
};

//For valid username
export const mockFetchCorrect = jest.fn().mockReturnValue(
    Promise.resolve({
        data: {
            data: {
                user: {
                    name: 'Ashutosh Dwivedi',
                    c0: {
                        contributionCalendar: {
                            totalContributions: 389,
                            weeks: weeks(),
                        },
                    },
                },
            },
        },
    }),
);

//For ghost windows: c1 trims its longer calendar to the current window's
//day count, c2 pads its short calendar at the front, and c3 is missing
//entirely so it gets skipped.
export const mockFetchGhosts = jest.fn().mockReturnValue(
    Promise.resolve({
        data: {
            data: {
                user: {
                    name: 'Ashutosh Dwivedi',
                    c0: {
                        contributionCalendar: {
                            totalContributions: 389,
                            weeks: weeks(),
                        },
                    },
                    c1: {
                        contributionCalendar: {
                            totalContributions: 210,
                            weeks: weeks(),
                        },
                    },
                    c2: {
                        contributionCalendar: {
                            totalContributions: 97,
                            weeks: JSON.parse(JSON.stringify(dummyGhostWeeksData)),
                        },
                    },
                },
            },
        },
    }),
);

//For invalid username
export const mockFetchIncorrect = jest.fn().mockReturnValue({
    data: {
        data: {
            user: null,
        },
        errors: [
            {
                type: 'NOT_FOUND',
                path: ['user'],
                locations: [
                    {
                        line: 2,
                        column: 3,
                    },
                ],
                message: "Could not resolve to a User with the login of 'xyz'.",
            },
        ],
    },
});

//For valid username
export const mockQueryCorrect = jest.fn().mockReturnValue({
    query: `
      query userInfo($LOGIN: String!) {
       user(login: $LOGIN) {
         name
         contributionsCollection {
           contributionCalendar {
               totalContributions
               weeks {
                 contributionDays {
                   contributionCount
                 }
               }
             }
           }
         }
       },
     `,
    variables: {
        LOGIN: 'ashutosh00710',
    },
});

//For invalid username
export const mockQueryIncorrect = jest.fn().mockReturnValue({
    query: `
      query userInfo($LOGIN: String!) {
       user(login: $LOGIN) {
         name
         contributionsCollection {
           contributionCalendar {
               totalContributions
               weeks {
                 contributionDays {
                   contributionCount
                 }
               }
             }
           }
         }
       },
     `,
    variables: {
        LOGIN: '',
    },
});
