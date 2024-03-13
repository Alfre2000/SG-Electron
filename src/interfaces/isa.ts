export type TimeSeriesProduction = {
    date: string;
    hour: number;
    nTelai: number;
}[];

export type AvgTelai = {
    weekCategory: "LastWeek" | "WeekBeforeLast";
    avgTelai: number;
}[];