export const BASE_PATH = 
  process.env.NODE_ENV === 'production' 
    ? 'https://supergalvanica.herokuapp.com'
    : 'http://localhost:8000'
// export const BASE_PATH = "https://supergalvanica.herokuapp.com"


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
    OPERAZIONI_DEEP: BASE_PATH + '/analisi-manutenzioni/operazioni-deep/',

    // BASE
    OPERATORI: BASE_PATH + '/base/operatori/',
    ARTICOLI: BASE_PATH + '/base/articoli/',
    ARTICOLI_NESTED: BASE_PATH + '/base/articoli-nested/',
    ARTICOLI_NAMES: BASE_PATH + '/base/articoli-names/',
    IMPIANTI: BASE_PATH + '/base/impianti/',
    CLIENTI: BASE_PATH + '/base/clienti/',
    LAVORAZIONI: BASE_PATH + '/base/lavorazioni/',
    MATERIALI: BASE_PATH + '/base/materiali/',
    TRAVERSINI: BASE_PATH + '/base/traversini/',

    // SCHEDE CONTROLLO
    RECORD_LAVORAZIONI: BASE_PATH + '/scheda-controllo/record-lavorazioni/',
    RECORD_LAVORAZIONI_OSSIDO: BASE_PATH + '/scheda-controllo/record-lavorazioni?valvola=True',
    RECORD_LAVORAZIONI_NOT_OSSIDO: BASE_PATH + '/scheda-controllo/record-lavorazioni?valvola=False',
    RECORD_LAVORAZIONI_IN_SOSPESO: BASE_PATH + '/scheda-controllo/record-lavorazioni?completata=false',
    SCHEDE_CONTROLLO: BASE_PATH + '/scheda-controllo/schede-controllo/',

    SCHEDA_CONTROLLO_OSSIDO: BASE_PATH + '/scheda-controllo/scheda-controllo-ossido/',
    ANDAMENTO_PRODUZIONE: BASE_PATH + '/scheda-controllo/andamento-produzione/',
    PRODUZIONE_PER_OPERATORE: BASE_PATH + '/scheda-controllo/produzione-per-operatore/',

    RECORD_LAVORAZIONE_INFO: BASE_PATH + '/scheda-controllo/record-lavorazione-info/',

    // CERTIFICATI
    RECORD_LAVORAZIONI_SEARCH: BASE_PATH + '/scheda-controllo/record-lavorazioni-search/',
    RECORD_LAVORAZIONI_CERTIFICATO: BASE_PATH + '/scheda-controllo/record-lavorazioni-certificato/',
    CERTIFICATI: BASE_PATH + '/scheda-controllo/certificati/',
    CERTIFICATI_BOLLA: BASE_PATH + '/certificati/builder-async/',
    CERTIFICATI_BOLLA_STATUS: BASE_PATH + '/certificati/builder-async-status/',
    RECORD_CERTIFICATI: BASE_PATH + '/scheda-controllo/record-certificati/',
    
    ETICHETTE_MTA: BASE_PATH + '/certificati/etichette-mta/',

    // SCHEDE IMPIANTO
    SCHEDE_IMPIANTO: BASE_PATH + '/scheda-impianto/schede-impianti/',
    RECORD_SCHEDE_IMPIANTO: BASE_PATH + '/scheda-impianto/record-schede-impianti/',
    ULTIMA_SCHEDA_IMPIANTO: BASE_PATH + '/scheda-impianto/ultima-scheda-impianto/',

    // PAGINA
    PAGINA_PROSSIME: BASE_PATH + '/analisi-manutenzioni/pagina-prossime/',
    PAGINA_RICERCA_DATABASE: BASE_PATH + '/analisi-manutenzioni/pagina-ricerca-database/',

    // ANDAMENTO PRODUZIONE
    LAST_SCHEDE_IMPIANTO: BASE_PATH + '/base/dashboards/last-schede-impianto/',
    LATEST_SCHEDE_CONTROLLO: BASE_PATH + '/base/dashboards/latest-schede-controllo/',
    RECORD_LAVORAZIONI_OVER_TIME: BASE_PATH + '/base/dashboards/record-lavorazione-over-time/',
    RECORD_MANCANTI: BASE_PATH + '/base/dashboards/record-mancanti/',
    RICAVI: BASE_PATH + '/base/dashboards/ricavi/',
}