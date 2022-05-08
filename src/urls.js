export const BASE_PATH = 
  process.env.NODE_ENV === 'production' 
    ? 'https://supergalvanica.herokuapp.com'
    : 'http://localhost:8000'


export const URLS = {
    LOGIN: BASE_PATH + '/auth/login/',
    LOGOUT: BASE_PATH + '/auth/logout/',
    INFO_UTENTE: BASE_PATH + '/auth/info-utente/',
    // Lavorazione
    SCHEDA_CONTROLLO: BASE_PATH + '/analisi-manutenzioni/',
    CREA_RECORD_LAVORAZIONE: BASE_PATH + '/analisi-manutenzioni/crea-record-lavorazione/',
    RECORD_LAVORAZIONI: BASE_PATH + '/base/record-lavorazioni/',
    // Fissaggio
    CREA_RECORD_FISSAGGIO: BASE_PATH + '/base/record-fissaggi/',
    RECORD_FISSAGGI: BASE_PATH + '/analisi-manutenzioni/fissaggi/',
    // BASE_RECORD_FISSAGGIO: BASE_PATH + '/base/record-fissaggi/',
    FISSAGGI: BASE_PATH + '/base/fissaggi/',
    // Ossido
    OSSIDI: BASE_PATH + '/base/ossidi/',
    RECORD_OSSIDI: BASE_PATH + '/analisi-manutenzioni/ossidi/',
    // BASE_RECORD_OSSIDO: BASE_PATH + '/base/record-ossidi/',
    // Manutenzione
    // BASE_RECORD_MANUTENZIONE: BASE_PATH + '/base/record-manutenzioni/',
    MANUTENZIONE: BASE_PATH + '/analisi-manutenzioni/manutenzioni/',
    // Analisi
    // BASE_RECORD_ANALISI: BASE_PATH + '/base/record-analisi/',
    ANALISI: BASE_PATH + '/analisi-manutenzioni/analisi/',
    // Informazioni
    PROSSIME: BASE_PATH + '/analisi-manutenzioni/prossime/',
    PRODUZIONE: BASE_PATH + '/analisi-manutenzioni/andamento-produzione/',
    // Operazione
    RECORD_OPERAZIONE: BASE_PATH + '/base/record-operazioni/',

    // Delete
    BASE_RECORD_FISSAGGIO: BASE_PATH + '/base/record-fissaggi/',
    BASE_RECORD_OSSIDO: BASE_PATH + '/base/record-ossidi/',
    BASE_RECORD_MANUTENZIONE: BASE_PATH + '/base/record-manutenzioni/',
    BASE_RECORD_ANALISI: BASE_PATH + '/base/record-analisi/',
    BASE_RECORD_LAVORAZIONE: BASE_PATH + '/base/record-lavorazioni/',
}