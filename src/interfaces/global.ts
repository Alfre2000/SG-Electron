export type Record = {
  [key: string]: unknown;
};

export type RecordMancantiType = {
  impianto__nome: string;
  total: number;
  inseriti: number;
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

export type Impianto = {
  id: number;
  nome: string;
  volume_vasca: number | null;
};

export type Metallo = {
  id: number;
  nome: string;
  peso_specifico: number | null;
  magazzino: number;
  ordinato: number;
  metallo: boolean;
  unità_misura: string;
};

export type Lavorazione = {
  id: string;
  nome: string;
  norma: string | null;
  metallo: Metallo | null;
  impianti: Impianto[];
};

export type Richiesta = {
  id: string;
  punto: number;
  spessore_minimo: number | null;
  spessore_massimo: number | null;
  lavorazione: Lavorazione;
};

export type Articolo = {
  id: string;
  nome: string;
  codice: string | null;
  descrizione: string | null;
  impianto: Impianto;
  scheda_controllo: any;
  cliente: Cliente;
  superficie: number | null;
  peso: number | null;
  attivo: boolean;
  pezzi_per_telaio: number | null;
  specifica_it: string | null;
  specifica_en: string | null;
  info_aggiuntive: Record;
  data_creazione: string;
  ultima_modifica: string;
  costo_manodopera: number | null;
  fattore_moltiplicativo: number | null;
  prezzo_dmq: number | null;

  richieste: Richiesta[];
};

export type InfoPrezzi = {
  cliente: string;
  prezzo_oro: number | null;
  scadenza_prezzo_oro: string | null;
  densità_oro: number;
  prezzo_argento: number | null;
  scadenza_prezzo_argento: string | null;
  densità_argento: number;
  minimo_per_pezzo: number | null;
  minimo_per_riga: number | null;
};


export type RecordLavorazione = {
  id: string;
  articolo: string;
  cliente: string;
  n_lotto_super: string;
  quantità: number;
  um: string;
  n_pezzi_scartati: number;
  prezzo: string | null;
  prezzo_unitario: string | null;
  impianto: number;
  operatore: number;
  status: string;
  completata: boolean;
  data: string;
  ultima_modifica: string;
};

export type PrezziMetalli = {
  Argento: number;
  Oro: number;
  Nichel: number;
  Rame: number;
  Stagno: number;
  Zinco: number;
}

export type Documento = {
  id: string;
  nome: string;
  path: string;
  file: string;
  data_creazione: string;
  ultima_modifica: string;
}

export type RichiestaProdotto = {
  id: string;
  vasca: string;
  prodotto: string;
  quantità: string;
}

export type RichiestaCorrezioneBagno = {
  id: string;
  impianto: number;
  note: string;
  data: string;
  richiesto_da: string;
  richieste_prodotto: RichiestaProdotto[];

  note_completamento: string;
  operatore: number;
  data_completamento: string;
}
