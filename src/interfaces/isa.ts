export type TimeSeriesProduction = {
    date: string;
    hour: number;
    nTelai: number;
}[];

export type AvgTelai = {
    weekCategory: "LastWeek" | "WeekBeforeLast";
    avgTelai: number;
}[];

export type RecordTelaio = {
    id: string;
    PartNumber: string;
    Pieces: number;
    CycleNumber: number;
    dataInizio: Date;
    dataFine: Date;
    status: "C" | "U" | "N"; // C = Eliminata, U = Modificata, N = Nuova
};