export type CustomRecord = {
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
  campi_aggiuntivi?: CustomRecord;
  note?: string;
}[];

export type Cliente = Unpacked<Clienti>;

export type Operatore = {
  id: number;
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
  certificato: boolean;
  status: string;
  data: string;
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
  galvanico: boolean;
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
  info_aggiuntive: CustomRecord;
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
  data_arrivo: string;
  data_consegna: string;
  data_consegna_prevista: string;
  ultima_modifica: string;
  record_controlli: RecordControllo[];
};

export type RecordControllo = {
  controllo: string;
  eseguito: boolean;
  id: string;
  misurazioni: Misurazione[];
  pezzi_da_testare: number;
};

export type Misurazione = {
  id: string;
  manuale: boolean;
  valore: number;
  richiesta: string;
};

export type RecordLavorazioneStatus = {
  id: string;
  status: string;
  completata: boolean;
  data: string;
  data_arrivo: string;
  data_consegna: string;
  data_consegna_prevista: string;
  ritardo: number;
  articolo: string;
  consegne: Consegna[];
  n_lotto_super: string;
  cliente: string;
  impianto: string;
  lavorazione: string;
};

export type Consegna = {
  id: string;
  record_lavorazione: string;
  n_bolla: string;
  riga_bolla: string;
  data_consegna: string;
  data_fattura?: string;
  quantità: number;
  prezzo: number;
  prezzo_unitario: number;
  descrizione: string;
  certificato: string;
};

export type PrezziMetalli = {
  Argento: number;
  Oro: number;
  Nichel: number;
  Rame: number;
  Stagno: number;
  Zinco: number;
};

export type Documento = {
  id: string;
  nome: string;
  path: string;
  file: string;
  data_creazione: string;
  ultima_modifica: string;
};

export type RichiestaProdotto = {
  id: string;
  vasca: string;
  prodotto?: string;
  quantità?: string;

  prodotto_magazzino?: Prodotto;
  quantità_magazzino?: number;
  um?: string;

  quantità_testo: string;
};

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
};

export type Versione = {
  id: string;
  username: string;
  versione: string;
};

export type Barra = {
  codice: string;
  impianto: number;
  record_lavorazione?: string;
  record_ids?: string;
  articolo: string;
  ciclo: string;
  inizio: string;
  fine: string;
  n_steps: number;
  steps: Step[];
  mg_metallo: number;
  costo_metallo: number;
  valida: boolean;
  quantità?: number;
  um: string;
};

export type Step = {
  ingresso: string;
  uscita: string;
  posizione: string;
  costo_metallo: number;
};

export type Prodotto = {
  id: number;
  nome: string;
  nickname: string;
  descrizione: string | null;
  impianti: Impianto[];
  dpi: string[] | null;
  rischio: string | null;
  luogo: string;
  aspetto: string | null;
  colore: string | null;
  densità_minima: number | null;
  densità_massima: number | null;
  ph_minimo: number | null;
  ph_massimo: number | null;
  note: string | null;
  scorta_minima: number;
  scorta_magazzino: number;
  scorta_ordinata: number;
  dimensioni_unitarie: number;
  nome_unità: string;
  unità_misura: string;
  ums: [string, string][];
  prodotti_fornitori: FornitoreProdotto[];
};

export type FornitoreProdotto = {
  prodotto: string;
  fornitore: Fornitore;
  prezzo_unitario: number;
};

export type Fornitore = {
  id: number;
  nome: string;
  nome_semplice: string;
};

export type Movimento = {
  id: string;
  prodotto: Prodotto;
  tipo: string;
  quantità: number;
  destinazione: string | null;
  operatore: string | null;
  data: string;
  note: string | null;
};

export type UtilizzoProdotto = {
  id: number;
  nome: string;
  descrizione: string | null;
  impianti: number[];
  dpi: string[] | null;
  rischio: string | null;
  luogo: string;
  aspetto: string | null;
  colore: string | null;
  densità_minima: number | null;
  densità_massima: number | null;
  ph_minimo: number | null;
  ph_massimo: number | null;
  note: string | null;
  scorta_minima: number;
  scorta_magazzino: number;
  scorta_ordinata: number;
  dimensioni_unitarie: number;
  nome_unità: string;
  unità_misura: string;
  utilizzo_ultimo_mese: number;
  utilizzo_ultimo_trimestre: number;
  utilizzo_ultimo_anno: number;
};

export type Ordine = {
  id: number;
  prodotto: Prodotto;
  quantità: number;
  quantità_consegnata: number;
  prezzo_unitario: number | null;
  fornitore: Fornitore;
  operatore: Operatore | null;
  data_ordine: string;
  data_consegna: string | null;
  data_consegna_prevista: string;
  quantità_testo: string;
  note: string | null;
  attestato: boolean;
  controllo_qualità: boolean;
  n_ordine: string;
};

export type RecordConsumo = {
  id: string;
  data: string;
  quantità: number;
  barre: Barra[];
  articolo: string;
  cliente: string;
  consumo_metalli: number;
  n_lotto_super: string;
  um: string;
  prezzo?: number;
  trattamenti: string;
  superficie: number;
  spessore_misurato?: number;
  richieste: Record<
    string,
    {
      spessore_minimo?: number;
      spessore_massimo?: number;
    }
  >;
};

export type RecordLavorazioneDetail = {
  id: string;
  articolo: string;
  cliente: string;
  quantità: number;
  um: string;
  n_lotto_super: string;
  data: string;
  status: string;
  trattamenti: string;
  prezzo: number;
  impianto: string;
  data_arrivo: string;
  n_lotto_cliente?: string;
  ddt_cliente?: string;
  descrizione: string;
  barre: Barra[];
  consegne: Consegna[];
}

export type Vasca = string;

export type RecordInserimentoLotti = {
  id: string;
  n_lotto_super: string;
  data_arrivo: string;
  data: string;
  status: string;
  n_barre: number;
  commento: {
    message: string;
    ok: boolean;
  }
}