export type Record = {
  [key: string]: unknown;
};

export type RecordMancantiType = {
  impianto__nome: string;
  total: number;
  inseriti: number;
}[];

export type RicaviType = {
  impianto__nome: string;
  month: string;
  ricavi: number;
}[];