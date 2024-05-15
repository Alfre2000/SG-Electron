// export const BASE_PATH = 
//   process.env.NODE_ENV === 'production' 
//     ? 'https://supergalvanica.herokuapp.com'
//     : 'http://localhost:8000'
export const BASE_PATH = "https://supergalvanica.herokuapp.com"


export const URLS = {
    // USERS
    LOGIN: BASE_PATH + '/auth/login/',
    LOGOUT: BASE_PATH + '/auth/logout/',
    INFO_UTENTE: BASE_PATH + '/auth/info-utente/',

    // ANALISI E MANUTENZIONI
    RECORD_FISSAGGIO: BASE_PATH + '/analisi-manutenzioni/record-fissaggi/',
    RECORD_MANUTENZIONE: BASE_PATH + '/analisi-manutenzioni/record-manutenzioni/',
    RECORD_ANALISI: BASE_PATH + '/analisi-manutenzioni/record-analisi/',
    FISSAGGI: BASE_PATH + '/analisi-manutenzioni/fissaggi/',
    MANUTENZIONI: BASE_PATH + '/analisi-manutenzioni/manutenzioni/',
    ANALISI: BASE_PATH + '/analisi-manutenzioni/analisi/',
    PAGINA_PROSSIME: BASE_PATH + '/analisi-manutenzioni/pagina-prossime/',
    RICHIESTE_CORREZIONE_BAGNO: BASE_PATH + '/analisi-manutenzioni/richieste-correzione-bagno/',
    RICHIESTE_CORREZIONE_BAGNO_PDF: BASE_PATH + '/analisi-manutenzioni/richiesta-correzione-bagno-pdf/',

    // BASE
    OPERATORI: BASE_PATH + '/base/operatori/',
    ARTICOLI: BASE_PATH + '/base/articoli/',
    ARTICOLI_NESTED: BASE_PATH + '/base/articoli-nested/',
    ARTICOLI_NESTED_PAGINATED: BASE_PATH + '/base/articoli-nested-paginated/',
    IMPIANTI: BASE_PATH + '/base/impianti/',
    CLIENTI: BASE_PATH + '/base/clienti/',
    CONTATTI: BASE_PATH + '/base/contatti/',
    INFO_PREZZI: BASE_PATH + '/base/info-prezzi/',
    LAVORAZIONI: BASE_PATH + '/base/lavorazioni/',
    MATERIALI: BASE_PATH + '/base/materiali/',
    TRAVERSINI: BASE_PATH + '/base/traversini/',
    DOCUMENTI: BASE_PATH + '/base/documenti/',
    VERSIONI: BASE_PATH + '/base/versioni/',
    UTILIZZI: BASE_PATH + '/base/utilizzi/',

    CLIENTI_MAPPA: BASE_PATH + '/base/mappa-clienti/',
    PREZZI_METALLI: BASE_PATH + '/base/prezzi-metalli/',
    UPDATE_DOCUMENTO: BASE_PATH + '/base/update-documento/',

    // SCHEDE CONTROLLO
    RECORD_LAVORAZIONI_STATUS: BASE_PATH + '/scheda-controllo/record-lavorazione-status',
    RECORD_LAVORAZIONI: BASE_PATH + '/scheda-controllo/record-lavorazioni?pre_lavorazione=false',
    RECORD_LAVORAZIONI_OSSIDO: BASE_PATH + '/scheda-controllo/record-lavorazioni?valvola=True&pre_lavorazione=false',
    RECORD_LAVORAZIONI_NOT_OSSIDO: BASE_PATH + '/scheda-controllo/record-lavorazioni?valvola=False&pre_lavorazione=false',
    RECORD_LAVORAZIONI_IN_SOSPESO: BASE_PATH + '/scheda-controllo/record-lavorazioni?completata=false&pre_lavorazione=false',
    SCHEDE_CONTROLLO: BASE_PATH + '/scheda-controllo/schede-controllo/',
    SCHEDA_CONTROLLO_OSSIDO: BASE_PATH + '/scheda-controllo/scheda-controllo-ossido/',
    RECORD_LAVORAZIONE_INFO: BASE_PATH + '/scheda-controllo/record-lavorazione-info/',
    LOTTO_INFO: BASE_PATH + '/scheda-controllo/lotto-info/',

    UPDATE_CERTIFICATO: BASE_PATH + '/scheda-controllo/update-certificato/',
    VERIFICA_PREZZI_PDF: BASE_PATH + '/scheda-controllo/verifica-prezzi-pdf/',

    // BARRE
    BARRE: BASE_PATH + '/scheda-controllo/barre/',

    // CERTIFICATI
    CERTIFICATI: BASE_PATH + '/scheda-controllo/certificati/',
    CERTIFICATI_BOLLA: BASE_PATH + '/certificati/builder-async/',
    CERTIFICATI_BOLLA_STATUS: BASE_PATH + '/certificati/builder-async-status/',
    RECORD_CERTIFICATI: BASE_PATH + '/scheda-controllo/record-certificati/',
    
    ETICHETTE_MTA: BASE_PATH + '/certificati/etichette-mta/',

    // SCHEDE IMPIANTO
    SCHEDE_IMPIANTO: BASE_PATH + '/scheda-impianto/schede-impianti/',
    RECORD_SCHEDE_IMPIANTO: BASE_PATH + '/scheda-impianto/record-schede-impianti/',
    ULTIMA_SCHEDA_IMPIANTO: BASE_PATH + '/scheda-impianto/ultima-scheda-impianto/',

    // ANDAMENTO PRODUZIONE
    LAST_SCHEDE_IMPIANTO: BASE_PATH + '/base/dashboards/last-schede-impianto/',
    RECORD_LAVORAZIONI_OVER_TIME: BASE_PATH + '/base/dashboards/record-lavorazione-over-time/',
    RECORD_MANCANTI: BASE_PATH + '/base/dashboards/record-mancanti/',
}