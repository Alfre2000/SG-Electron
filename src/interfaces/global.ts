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

type Unpacked<T> = T extends (infer U)[] ? U : T;

export type Clienti = {
  id: string;
  nome: string;
  piva?: string;
  indirizzo?: string;
  cap?: string;
  città?: string;
  attivo: boolean;
  dal: string;
  campi_aggiuntivi?: Record;
  note?: string;
  prezzo_oro?: number;
  prezzo_argento?: number;
  scadenza_prezzo_oro?: string;
  scadenza_prezzo_argento?: string;
}[];

export type Cliente = Unpacked<Clienti>;

export type Operatore = {
  id: string;
  nome: string;
  attivo: boolean;
  codice: string;
  impianti: number[];
};

export type RecordCertificato = {
  id: string;
  articolo: string;
  cliente: string;
  n_lotto_super: string;
  certificato: string;
  data: string;
  n_bolla: string;
};


export type WithID = {
  id: string | number;
};


export type PaginationData<TData> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TData[];
};