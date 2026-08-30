import moment from 'moment';
import { Response } from 'express';
import { Card } from './GraphCards';
import { invalidUserSvg } from './svgs';
import { selectColors } from './styles/themes';
import { QueryOption, ParsedQs, UserDetails } from './interfaces/interface';

// Colors are interpolated raw into SVG attributes and a <style> block (see
// svgs.ts / graphStyle.ts), so anything other than hex digits could break out
// into markup/CSS and inject a <script> or event handler. Restricted to the
// hex lengths CSS/SVG actually accept (3, 4, 6, 8) so invalid lengths fall
// back to the theme default instead of rendering as a broken color.
const HEX_COLOR = /^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function sanitizeColor(value: unknown): string | undefined {
    return typeof value === 'string' && HEX_COLOR.test(value) ? value : undefined;
}

// The title is embedded as raw XHTML inside a <foreignObject>, so it must be
// entity-escaped before use or it can inject a <script> the same way.
function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            default:
                return '&#39;';
        }
    });
}

export class Utilities {
    public username: string;
    constructor(private readonly queryString: ParsedQs) {
        this.username = String(this.queryString.username);
    }

    private getColors() {
        const theme = this.queryString.theme || 'default';
        const themeColors = selectColors(theme);
        const color = sanitizeColor(this.queryString.color);
        return {
            areaColor: sanitizeColor(this.queryString.area_color) ?? themeColors.areaColor,
            bgColor: sanitizeColor(this.queryString.bg_color) ?? themeColors.bgColor,
            borderColor:
                sanitizeColor(this.queryString.border_color) ??
                (String(this.queryString.hide_border) === 'true'
                    ? '0000' // transparent
                    : themeColors.borderColor),
            color: color ?? themeColors.color,
            titleColor: sanitizeColor(this.queryString.title_color) ?? color ?? themeColors.titleColor,
            lineColor: sanitizeColor(this.queryString.line) ?? themeColors.lineColor,
            pointColor: sanitizeColor(this.queryString.point) ?? themeColors.pointColor,
        };
    }

    private validateDays(days?: string): number {
        const d = Number(days);
        if (typeof d !== 'number') {
            return 31;
        } else if (d > 0 && d <= 90) {
            return d;
        } else {
            return 31;
        }
    }

    private validateDate(date?: string): boolean {
        const format = 'YYYY-MM-DD';
        return moment(date, format, true).isValid();
    }

    private stringDateToUTC(date?: string): string {
        const format = 'YYYY-MM-DD';
        return moment(date, format, true).utc().toISOString();
    }

    private validateFromIsLessThanTwo(from: string, to: string): boolean {
        // Parse the ISO string dates into Moment objects
        const fromDate = moment(from);
        const toDate = moment(to);
        const now = moment();
        // Compare the dates using the isBefore method
        return (
            fromDate.isBefore(toDate) &&
            moment(fromDate).isSameOrBefore(now) &&
            moment(toDate).isSameOrBefore(now)
        );
    }

    private calculateNumberOfDaysFromDate(from: string, to: string): number {
        // Parse the ISO string dates into Moment objects
        const fromDate = moment(from);
        const toDate = moment(to);

        // Compare the dates using the isBefore method
        return toDate.diff(fromDate, 'days');
    }

    public queryOptions() {
        let area = false;
        if (String(this.queryString.area) === 'true') {
            area = true;
        }

        // Custom options for user
        const colors = this.getColors();
        let from = '',
            to = '',
            days = 31;
        const isFromValid = this.validateDate(this.queryString.from);
        const isToValid = this.validateDate(this.queryString.to);
        if (isFromValid && isToValid) {
            from = this.stringDateToUTC(this.queryString.from);
            to = this.stringDateToUTC(this.queryString.to);
            if (!this.validateFromIsLessThanTwo(from, to)) {
                from = '';
                to = '';
                days = 31;
            } else {
                days = this.calculateNumberOfDaysFromDate(from, to);
            }
        }

        const options: QueryOption = {
            username: this.username,
            hide_title: String(this.queryString.hide_title) === 'true',
            radius: this.queryString.radius
                ? Math.min(Math.max(this.queryString.radius, 0), 16)
                : 0, // Border radius in range [0, 16]
            colors: colors,
            area: area,
            height: this.queryString.height
                ? Math.min(Math.max(this.queryString.height, 200), 600)
                : 420, // Custom height implementation from range [200, 600], if not specified use default value - 420
            days: isFromValid && isToValid ? days : this.validateDays(this.queryString.days),
            grid: this.queryString.grid === 'false' ? false : true,
            from,
            to,
        };

        if (this.queryString.custom_title)
            options['custom_title'] = String(this.queryString.custom_title);

        return options;
    }

    public async buildGraph(fetchCalendarData: string | UserDetails) {
        if (typeof fetchCalendarData === 'object') {
            const options = this.queryOptions();
            let title = '';

            if (!options.hide_title) {
                if (options.custom_title) {
                    title = options.custom_title;
                } else {
                    title = `${
                        fetchCalendarData.name !== null ? fetchCalendarData.name : options.username
                    }'s Contribution Graph`;
                }
            }
            title = escapeHtml(title);

            const graph = new Card(
                options.height,
                1200,
                options.radius,
                options.colors,
                title,
                options.area,
                options.grid,
            );
            const getChart = await graph.buildGraph(fetchCalendarData.contributions);
            return {
                finalGraph: getChart,
                header: {
                    maxAge: 'public, max-age=1800',
                },
            };
        } else {
            return {
                finalGraph: invalidUserSvg(fetchCalendarData),
                header: { maxAge: 'no-store, max-age=0' },
            };
        }
    }

    public setHttpHeader(res: Response, directivesAndAge: string): void {
        res.setHeader('Cache-Control', `${directivesAndAge}`);
        // Defense in depth: even if a future change reintroduces an
        // injection bug, this stops any injected <script> from running.
        res.setHeader('Content-Security-Policy', "script-src 'none'; sandbox");
        res.set('Content-Type', 'image/svg+xml');
    }
}
