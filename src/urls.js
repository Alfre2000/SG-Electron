export const BASE_PATH = 
  process.env.NODE_ENV === 'production' 
    ? 'https://supergalvanica.herokuapp.com'
    : 'http://localhost:8000'


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
    IMPIANTI: BASE_PATH + '/base/impianti/',

    // SCHEDE CONTROLLO
    RECORD_LAVORAZIONI: BASE_PATH + '/scheda-controllo/record-lavorazioni/',

    SCHEDA_CONTROLLO_OSSIDO: BASE_PATH + '/scheda-controllo/scheda-controllo-ossido/',
    ANDAMENTO_PRODUZIONE: BASE_PATH + '/scheda-controllo/andamento-produzione/',
    PRODUZIONE_PER_OPERATORE: BASE_PATH + '/scheda-controllo/produzione-per-operatore/',

    // PAGINA
    PAGINA_PROSSIME: BASE_PATH + '/analisi-manutenzioni/pagina-prossime/',
    PAGINA_RICERCA_DATABASE: BASE_PATH + '/analisi-manutenzioni/pagina-ricerca-database/',
}