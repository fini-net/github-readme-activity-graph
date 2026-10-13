export class Query {
    query: string;
    variables: {
        LOGIN: string;
        // One FROMn/TOn pair per contribution window (current + ghosts).
        [variable: string]: string;
    };
}

export class Colors {
    areaColor: string;
    bgColor: string;
    borderColor: string;
    color: string;
    titleColor: string;
    lineColor: string;
    pointColor: string;
}

export class QueryOption {
    username: string;
    hide_title?: boolean;
    custom_title?: string;
    from?: string;
    to?: string;
    grid: boolean;
    colors: Colors;
    area: boolean;
    radius: number;
    height: number;
    days: number;
    ghosts: number;
}

export class ParsedQs {
    username?: string;
    hide_title?: boolean;
    custom_title?: string;
    bg_color?: string;
    border_color?: string;
    hide_border?: boolean;
    area_color?: string;
    color?: string;
    line?: string;
    point?: string;
    theme?: string;
    area?: boolean;
    radius?: number;
    title_color?: string;
    height?: number;
    days?: string;
    from?: string;
    to?: string;
    grid?: string;
    ghosts?: string;
}

export class GraphArgs {
    height: number;
    width: number;
    colors: Colors;
    title: string;
    radius: number;
    line: Promise<string>;
}

export class UserDetails {
    contributions: Array<ContributionDay>;
    // Prior contribution windows returned by fetchContributions when ghost
    // lines were requested; each entry aligns index-for-index with
    // `contributions`. Absent when no ghosts were requested.
    ghosts?: Array<Array<ContributionDay>>;
    name: string;
}

export class ContributionDay {
    contributionCount: number;
    date: string;
}

export class Week {
    contributionDays: Array<ContributionDay>;
}

export class ContributionsCollection {
    contributionCalendar: {
        totalContributions: number;
        weeks: Array<Week>;
    };
}

export class ResponseOfApi {
    // Each requested window comes back under its own alias (c0 = current
    // window, c1.. = ghosts) on the user object.
    data?: {
        user: { name: string } & { [alias: string]: ContributionsCollection };
    };
    errors?: Array<{ message: string; type: string }>;
}
