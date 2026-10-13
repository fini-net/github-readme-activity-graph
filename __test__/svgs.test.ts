import { graphSvg, invalidUserSvg } from '../src/svgs';
import { Card } from '../src/GraphCards';
import { fakeGraphArgs, fakeQueryStringRes } from './fakeInputs';

describe('SVG Testing', () => {
    //- Svg testing ✔
    it('Test SVGs', () => {
        let fakeInvalidSvgArg = 'User not found!';
        expect.assertions(4);
        expect(graphSvg(fakeGraphArgs)).toEqual(expect.any(String));
        expect(graphSvg(fakeGraphArgs)).toMatchSnapshot();
        expect(invalidUserSvg(fakeInvalidSvgArg)).toEqual(expect.any(String));
        expect(invalidUserSvg(fakeInvalidSvgArg)).toMatchSnapshot();
    });

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
            date: '1',
        },
        {
            contributionCount: 12,
            date: '1',
        },
        {
            contributionCount: 14,
            date: '1',
        },
    ];

    //- Svg testing Promise<string> (GrapgCards.ts)✔
    it('chart SVGs', async () => {
        expect.assertions(1);
        expect(
            await new Card(
                420,
                1200,
                fakeQueryStringRes[0].radius,
                fakeQueryStringRes[0].colors,
                "xyz's Contribution Graph",
                fakeQueryStringRes[0].area,
            ).buildGraph(days),
        ).toMatchSnapshot();
    });

    //- Svg testing with ghost lines (GraphCards.ts) ✔
    it('chart SVGs with ghosts', async () => {
        expect.assertions(3);
        const svg = await new Card(
            420,
            1200,
            fakeQueryStringRes[0].radius,
            fakeQueryStringRes[0].colors,
            "xyz's Contribution Graph",
            fakeQueryStringRes[0].area,
        ).buildGraph(days, [
            // Ghost window further in the past.
            days.map((day) => ({ contributionCount: day.contributionCount - 1, date: day.date })),
            // Ghost window immediately before the current one.
            days.map((day) => ({ contributionCount: day.contributionCount + 1, date: day.date })),
        ]);

        // SVG paints in document order: the ghost series must come first
        // so they sit behind the current line, and the ghost styling must
        // be present.
        expect(svg.indexOf('ct-series-ghost')).toBeLessThan(svg.indexOf('ct-series-current'));
        expect(svg).toContain('.ct-series-ghost .ct-line');
        expect(svg).toMatchSnapshot();
    });
});
