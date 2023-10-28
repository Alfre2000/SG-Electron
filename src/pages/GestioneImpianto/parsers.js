import { faCircleCheck, faWarning } from "@fortawesome/free-solid-svg-icons";
import { findElementFromID } from "../../utils";
import ManutenzioneForm from "./Manutenzione/ManutenzioneForm";
import AnalisiForm from "./Analisi/AnalisiForm";
import FissaggioForm from "./Fissaggio/FissaggioForm";
import { URLS } from "../../urls";

export const parseProssimeManutenzioni = (response, full = false) => {
  let parsedData = { ok: [], late: [] }
  if (!response) return parsedData;
  response.operazioni.forEach(operazione => {
    const operazioneParsed = {...operazione}
    const scadutaGiorni = operazioneParsed.giorni_mancanti !== null && operazioneParsed.giorni_mancanti <= 0
    const scadutaPezzi = operazioneParsed.pezzi_mancanti !== null && operazioneParsed.pezzi_mancanti <= 0
    if (operazioneParsed.tipologia === "fissaggio") operazioneParsed.link = `/manutenzione/fissaggio/`;
    if (operazioneParsed.tipologia === "analisi") operazioneParsed.link = `/manutenzione/analisi/?analisi=${operazioneParsed.id}`;
    if (operazioneParsed.tipologia === "manutenzione") operazioneParsed.link = `/manutenzione/manutenzioni/?manutenzione=${operazioneParsed.id}`
    if (full) {
      operazioneParsed.colore_pezzi = scadutaPezzi ? "#960c0c" : "#058020"
      operazioneParsed.colore_giorni = scadutaGiorni ? "#960c0c" : "#058020"
      operazioneParsed.pezzi_da_utlima = operazioneParsed.intervallo_pezzi && operazioneParsed.pezzi_mancanti <= 0 ? -operazioneParsed.pezzi_mancanti.toLocaleString() + ' pezzi' : "-"
      operazioneParsed.giorni_da_utlima = operazioneParsed.intervallo_giorni && operazioneParsed.giorni_mancanti <= 0 ? -operazioneParsed.giorni_mancanti + ' giorni' : "-"
      operazioneParsed.pezzi_da_utlima_pop = operazioneParsed.intervallo_pezzi ? (operazioneParsed.intervallo_pezzi - operazioneParsed.pezzi_mancanti).toLocaleString() + ' pezzi' : "-"
      operazioneParsed.giorni_da_utlima_pop = operazioneParsed.intervallo_giorni ? operazioneParsed.intervallo_giorni - operazioneParsed.giorni_mancanti + ' giorni' : "-"
      operazioneParsed.icona_pezzi = operazioneParsed.pezzi_mancanti <= 0 ? faWarning : faCircleCheck;
      operazioneParsed.icona_giorni = operazioneParsed.giorni_mancanti <= 0 ? faWarning : faCircleCheck;
      operazioneParsed.messaggio_pezzi = operazioneParsed.pezzi_mancanti <= 0 ? "Ritardo" : "Da fare tra";
      operazioneParsed.messaggio_giorni = operazioneParsed.giorni_mancanti <= 0 ? "Ritardo" : "Da fare tra";
  
      operazioneParsed.pezzi_mancanti = operazioneParsed.intervallo_pezzi ? operazioneParsed.pezzi_mancanti.toLocaleString() + ' pezzi' : "-"
      operazioneParsed.giorni_mancanti = operazioneParsed.intervallo_giorni ? operazioneParsed.giorni_mancanti + ' giorni' : "-"
      operazioneParsed.intervallo_pezzi = operazioneParsed.intervallo_pezzi ? operazioneParsed.intervallo_pezzi.toLocaleString() + ' pezzi' : "-"
      operazioneParsed.intervallo_giorni = operazioneParsed.intervallo_giorni ? operazioneParsed.intervallo_giorni + ' giorni' : "-"
    }
    operazioneParsed.tipologia = operazioneParsed.tipologia === "fissaggio" ? "analisi" : operazioneParsed.tipologia
    if (scadutaGiorni || scadutaPezzi) parsedData.late.push(operazioneParsed)
    else parsedData.ok.push(operazioneParsed)
  })
  parsedData.ok = parsedData.ok.sort((a, b) => parseNumber(a.pezzi_mancanti) - parseNumber(b.pezzi_mancanti))
  parsedData.late = parsedData.late.sort((a, b) => parseNumber(a.pezzi_mancanti) - parseNumber(b.pezzi_mancanti))
  return parsedData
}

const parseNumber = (number) => {
  return parseInt(number.toString().split(' ')[0].replaceAll(".", ""))
}

export const parseSchedaLavorazione = (response) => {
  const scheda = {...response.scheda_controllo}
  if (scheda?.caratteristiche === undefined) return scheda;
  for (const [key, value] of Object.entries(scheda.caratteristiche)) {
    scheda[key] = value
  }
  delete scheda.caratteristiche
  return scheda
}

const tabellaForms = {
  manutenzione: ManutenzioneForm,
  analisi: AnalisiForm,
  fissaggio: FissaggioForm,
};
const tabellaURLs = {
  manutenzione: URLS.RECORD_MANUTENZIONE,
  analisi: URLS.RECORD_ANALISI,
  fissaggio: URLS.RECORD_FISSAGGIO,
};

export const parseRicercaDatabase = (response, operazioni) => {
  return {
    ...response,
    results: response.results.map((r) => {
      const tipologia = findElementFromID(
        r.operazione,
        operazioni
      ).tipologia;
      return {
        ...r,
        form: tabellaForms[tipologia],
        url: tabellaURLs[tipologia],
      };
    }),
  }
}