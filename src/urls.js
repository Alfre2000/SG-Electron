export const BASE_PATH = 
  process.env.NODE_ENV === 'production' 
    ? 'https://supergalvanica.herokuapp.com'
    : 'http://localhost:8000'


export const URLS = {
    LOGIN: BASE_PATH + '/auth/login/',
    LOGOUT: BASE_PATH + '/auth/logout/',
    PEZZI: BASE_PATH + '/robot/',
    CREA_RECORD_LAVORAZIONE: BASE_PATH + '/robot/crea-record-lavorazione/',
}