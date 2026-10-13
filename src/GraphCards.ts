import { createGraph } from './createChart';
import { graphSvg } from './svgs';
import { Colors, ContributionDay } from './interfaces/interface';

/**
 * Chartist plugin that emphasizes gridlines whose tick value is a multiple of
 * 20 (chicks-net/chicks-projects#129), so it's easier to eyeball where
 * contribution counts cross the 20/40/60 thresholds.
 *
 * The plugin runs before Chartist creates the chart, so listening for `draw`
 * events catches every gridline. X-axis day ticks are strings, so the numeric
 * check skips them; the tick-0 baseline darkens too, which reads as an
 * intentional solid floor. The class is added on the element rather than via
 * inline SVG attributes because the `.ct-grid` CSS rule would win against
 * presentation attributes — the doubled-class CSS selector out-specifies it.
 */
export const majorGridPlugin = (chart: any) => {
    chart.on('draw', (data: any) => {
        const value = data.type === 'grid' ? data.axis?.ticks?.[data.index] : undefined;
        if (typeof value === 'number' && value % 20 === 0) {
            data.element.addClass('ct-grid-major');
        }
    });
};

export class Card {
    constructor(
        private readonly height: number,
        private readonly width: number,
        private readonly radius: number,
        private readonly colors: Colors,
        private readonly title = '',
        private readonly area = false,
        private readonly showGrid = true,
    ) {}

    private getOptions() {
        return {
            width: this.width,
            height: this.height,
            axisY: {
                title: 'Contributions',
                onlyInteger: true,
                offset: 70,
                labelOffset: {
                    y: 4.5,
                },
                low: 0,
                showGrid: this.showGrid,
            },
            axisX: {
                title: 'Days',
                offset: 50,
                labelOffset: {
                    x: -4.5,
                },
                showGrid: this.showGrid,
            },
            chartPadding: {
                top: 80,
                right: 50,
                bottom: 20,
                left: 20,
            },
            showArea: this.area,
            fullWidth: true,
            plugins: [majorGridPlugin],
        };
    }

    /** Unused Code ref #85 */
    // private getContrubutionDates() {
    //     const days = [];
    //     for (const date = new Date(); days.length < 31; date.setDate(date.getUTCDate() - 1)) {
    //         const current = new Date(date);
    //         days.push(
    //             current.toLocaleString('default', { month: 'short' }) +
    //                 ' ' +
    //                 current.getUTCDate().toString()
    //         );
    //     }

    //     return days.reverse();
    // }

    async buildGraph(days: ContributionDay[]): Promise<string> {
        //Options to pass in createGraph function
        const options = this.getOptions();

        //Construction of graph from node-chartist
        const line: Promise<string> = await createGraph('line', options, {
            labels: days.map((day) => day.date),
            series: [{ value: days.map((day) => day.contributionCount) }],
        });

        //Arguments to construct graphs with rect and other options
        const args = {
            height: this.height,
            width: this.width,
            colors: this.colors,
            title: this.title,
            radius: this.radius,
            line,
        };

        return graphSvg(args);
    }
}
