import express from 'express';
import request from 'supertest';
import { Utilities } from '../src/utils';
import { fakeQueryString, fakeQueryStringRes, options, themes } from './fakeInputs';
import { Handlers } from '../src/handlers';
import { createGraph } from '../src/createChart';

describe('Utilities Test', () => {
    const handlers = new Handlers();
    it('Query Options', () => {
        expect(
            fakeQueryString.map((arg) => {
                const utils = new Utilities(arg);
                return utils.queryOptions();
            }),
        ).toEqual(fakeQueryStringRes);
    });

    // Testing express routes
    const fakeServer = () => {
        const app = express();
        app.use(express.urlencoded({ extended: false }));
        return app;
    };

    describe('GET /graph with correct credential', () => {
        test('responding', (done) => {
            const app = fakeServer();
            app.get('/graph', handlers.getGraph);
            request(app)
                .get('/graph?username=ashutosh00710')
                .expect('Content-Type', 'image/svg+xml; charset=utf-8')
                .expect('Cache-Control', 'public, max-age=1800')
                .expect('Content-Security-Policy', "script-src 'none'; sandbox")
                .expect(200, done);
        });
    });

    describe('GET /graph with incorrect credential', () => {
        test('responding', (done) => {
            const app = fakeServer();
            app.get('/graph', handlers.getGraph);
            request(app)
                .get('/graph?username=')
                .expect('Content-Type', 'image/svg+xml; charset=utf-8')
                .expect('Cache-Control', 'no-store, max-age=0')
                .expect('Content-Security-Policy', "script-src 'none'; sandbox")
                .expect(200, done);
        });
    });

    describe('Color sanitization', () => {
        it('falls back to the theme color when a color param is not valid hex', () => {
            const utils = new Utilities({
                username: 'githubusername',
                color: 'red} </style><script>alert(1)</script><style>{',
                bg_color: '"><script>alert(1)</script>',
                border_color: 'red;"/><script>alert(1)</script>',
                area_color: 'javascript:alert(1)',
                line: 'red</style><script>alert(1)</script>',
                point: 'red</style><script>alert(1)</script>',
                title_color: 'red} </style><script>alert(1)</script>',
            } as any);

            expect(utils.queryOptions().colors).toEqual(themes.default);
        });

        it('accepts valid hex color params unchanged', () => {
            const utils = new Utilities({
                username: 'githubusername',
                color: 'abc123',
                bg_color: 'fff',
            } as any);

            const { colors } = utils.queryOptions();
            expect(colors.color).toBe('abc123');
            expect(colors.bgColor).toBe('fff');
        });

        it('rejects hex-only values with a length CSS/SVG does not support', () => {
            const utils = new Utilities({
                username: 'githubusername',
                color: 'a', // 1 digit
                bg_color: 'ab', // 2 digits
                line: 'abcde', // 5 digits
                point: 'abcdefa', // 7 digits
            } as any);

            const { colors } = utils.queryOptions();
            expect(colors.color).toBe(themes.default.color);
            expect(colors.bgColor).toBe(themes.default.bgColor);
            expect(colors.lineColor).toBe(themes.default.lineColor);
            expect(colors.pointColor).toBe(themes.default.pointColor);
        });
    });

    describe('Title escaping', () => {
        it('escapes HTML in custom_title so it cannot break out of the SVG', async () => {
            const utils = new Utilities({
                username: 'githubusername',
                custom_title: '</h1><script>alert(document.domain)</script>',
            } as any);

            const { finalGraph } = await utils.buildGraph({
                name: 'someone',
                contributions: [{ contributionCount: 1, date: '1' }],
            });

            expect(finalGraph).not.toContain('<script>');
            expect(finalGraph).toContain('&lt;script&gt;');
        });
    });

    //- Chart Function ([Promise] Inside Graph Cards Class) ✔
    it('Graph Generation', async () => {
        expect.assertions(1);

        const days = [
            {
                contributionCount: 2,
                date: '1',
            },
            {
                contributionCount: 3,
                date: '2',
            },
            {
                contributionCount: 10,
                date: '3',
            },
            {
                contributionCount: 12,
                date: '4',
            },
            {
                contributionCount: 14,
                date: '5',
            },
        ];
        const graph: Promise<string> = await createGraph('line', options, {
            labels: days.map((day) => day.date),
            series: [{ value: days.map((day) => day.contributionCount) }],
        });
        expect(graph).toMatchSnapshot();
    });
});
