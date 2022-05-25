export const BASE_PATH = 
  process.env.NODE_ENV === 'production' 
    ? 'https://supergalvanica.herokuapp.com'
    : 'http://localhost:8000'


export const URLS = {
    // USERS
    LOGIN: BASE_PATH + '/auth/login/',
    LOGOUT: BASE_PATH + '/auth/logout/',
    INFO_UTENTE: BASE_PATH + '/auth/info-utente/',

    // VIEWSETS
    RECORD_LAVORAZIONE: BASE_PATH + '/scheda-controllo/record-lavorazioni/',
    RECORD_FISSAGGIO: BASE_PATH + '/analisi-manutenzioni/record-fissaggi/',
    RECORD_OSSIDO: BASE_PATH + '/analisi-manutenzioni/record-ossidi/',
    RECORD_MANUTENZIONE: BASE_PATH + '/analisi-manutenzioni/record-manutenzioni/',
    RECORD_ANALISI: BASE_PATH + '/analisi-manutenzioni/record-analisi/',

    // PAGINA
    PAGINA_LAVORAZIONI: BASE_PATH + '/analisi-manutenzioni/pagina-schede-controllo',
    PAGINA_FISSAGGI: BASE_PATH + '/analisi-manutenzioni/pagina-fissaggi/',
    PAGINA_OSSIDI: BASE_PATH + '/analisi-manutenzioni/pagina-ossidi/',
    PAGINA_MANUTENZIONI: BASE_PATH + '/analisi-manutenzioni/pagina-manutenzioni/',
    PAGINA_ANALISI: BASE_PATH + '/analisi-manutenzioni/pagina-analisi/',
    PAGINA_PROSSIME: BASE_PATH + '/analisi-manutenzioni/pagina-prossime/',
    PAGINA_PRODUZIONE: BASE_PATH + '/analisi-manutenzioni/pagina-andamento-produzione/',
}