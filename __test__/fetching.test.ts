import { Fetcher } from '../src/fetcher';
import {
    mockQueryCorrect,
    mockQueryIncorrect,
    mockFetchCorrect,
    mockFetchIncorrect,
    mockFetchGhosts,
} from './mockFunctions';
import { expectedQuery } from './fakeInputs';
import { UserDetails } from '../src/interfaces/interface';

describe('Fetching Tests', () => {
    const fetcher = new Fetcher('ashutosh00710');
    it('Query Test', () => {
        const expected = expectedQuery('ashutosh00710', [
            {
                from: '2022-05-01T00:00:00.000+00:00',
                to: '2022-06-01T00:00:00.000+00:00',
            },
        ]);
        expect(
            // @ts-ignore: testing private method
            fetcher.getGraphQLQuery([
                { from: '2022-05-01T00:00:00.000+00:00', to: '2022-06-01T00:00:00.000+00:00' },
            ]),
        ).toEqual(expected);
    });

    it('Query Test with ghosts', () => {
        const current = {
            from: '2022-05-01T00:00:00.000+00:00',
            to: '2022-06-01T00:00:00.000+00:00',
        };
        const ghost = {
            from: '2022-04-01T00:00:00.000+00:00',
            to: '2022-05-01T00:00:00.000+00:00',
        };
        expect(
            // @ts-ignore: testing private method
            fetcher.getGraphQLQuery([current, ghost]),
        ).toEqual(expectedQuery('ashutosh00710', [current, ghost]));
        expect(
            // @ts-ignore: testing private method
            fetcher.getGraphQLQuery([current, ghost]).query,
        ).toContain('$FROM0: DateTime!, $TO0: DateTime!, $FROM1: DateTime!, $TO1: DateTime!');
        expect(
            // @ts-ignore: testing private method
            fetcher.getGraphQLQuery([current, ghost]).query,
        ).toContain('c0: contributionsCollection(from: $FROM0, to: $TO0)');
        expect(
            // @ts-ignore: testing private method
            fetcher.getGraphQLQuery([current, ghost]).query,
        ).toContain('c1: contributionsCollection(from: $FROM1, to: $TO1)');
    });

    it('Fetching Contributions Test', async () => {
        // @ts-ignore: mocking private method
        fetcher.getGraphQLQuery = mockQueryCorrect;
        // @ts-ignore: mocking private method
        fetcher.fetch = mockFetchCorrect;

        const data = await fetcher.fetchContributions(31);
        expect(data).toEqual(expect.any(Object));
        if (typeof data === 'object') {
            expect(data.contributions).toEqual(expect.any(Array));
            expect(data.contributions.length).toEqual(31);
            expect(data.name).toEqual('Ashutosh Dwivedi');
            // No ghosts requested: the field must stay absent.
            expect(data.ghosts).toBeUndefined();
        }

        // @ts-ignore: mocking private method
        fetcher.getGraphQLQuery = mockQueryIncorrect;
        // @ts-ignore: mocking private method
        fetcher.fetch = mockFetchIncorrect;

        // @ts-ignore: this will always return a string
        fetcher.fetchContributions().then((data: string) => {
            expect(data).toEqual(`Can't fetch any contribution. Please check your username 😬`);
        });
    });

    it('Fetching Contributions with ghosts Test', async () => {
        // @ts-ignore: mocking private method
        fetcher.getGraphQLQuery = mockQueryCorrect;
        // @ts-ignore: mocking private method
        fetcher.fetch = mockFetchGhosts;

        // Three ghosts requested: c1 trims, c2 pads, c3 is missing and gets
        // skipped, so two ghost lines come back.
        const data = await fetcher.fetchContributions(31, undefined, undefined, 3);
        expect(data).toEqual(expect.any(Object));
        if (typeof data === 'string') {
            throw new Error('expected UserDetails');
        }
        const ghosts = (data as UserDetails).ghosts ?? [];
        expect((data as UserDetails).contributions.length).toEqual(31);
        expect(ghosts).toHaveLength(2);

        // c1: longer calendar trimmed to the current day count, keeping the
        // trailing days so indices stay aligned.
        expect(ghosts[0]).toHaveLength(31);

        // c2: 14 days returned for a 31-day window, padded at the front
        // with zero days.
        expect(ghosts[1]).toHaveLength(31);
        expect(ghosts[1].slice(0, 17).map((day) => day.contributionCount)).toEqual(
            Array(17).fill(0),
        );
        expect(ghosts[1].slice(17).map((day) => day.contributionCount)).toEqual([
            7, 3, 1, 0, 5, 2, 4, 6, 6, 0, 1, 8, 3, 2,
        ]);
    });
});
