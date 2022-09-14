import { faCircleCheck, faWarning } from "@fortawesome/free-solid-svg-icons";

export const parseProssimeManutenzioni = (response, full = false) => {
  let parsedData = { ok: [], late: [] }
  if (!response) return parsedData;
  response.operazioni.forEach(operazione => {
    const scadutaGiorni = operazione.giorni_mancanti !== null && operazione.giorni_mancanti <= 0
    const scadutaPezzi = operazione.pezzi_mancanti !== null && operazione.pezzi_mancanti <= 0
    if (operazione.tipologia === "fissaggio") operazione.link = `/manutenzione/fissaggio/`;
    if (operazione.tipologia === "analisi") operazione.link = `/manutenzione/analisi/?analisi=${operazione.id}`;
    if (operazione.tipologia === "manutenzione") operazione.link = `/manutenzione/manutenzioni/?manutenzione=${operazione.id}`
    if (full) {
      operazione.colore_pezzi = scadutaPezzi ? "#960c0c" : "#058020"
      operazione.colore_giorni = scadutaGiorni ? "#960c0c" : "#058020"
      operazione.pezzi_da_utlima = operazione.intervallo_pezzi && operazione.pezzi_mancanti <= 0 ? -operazione.pezzi_mancanti.toLocaleString() + ' pezzi' : "-"
      operazione.giorni_da_utlima = operazione.intervallo_giorni && operazione.giorni_mancanti <= 0 ? -operazione.giorni_mancanti + ' giorni' : "-"
      operazione.pezzi_da_utlima_pop = operazione.intervallo_pezzi ? (operazione.intervallo_pezzi - operazione.pezzi_mancanti).toLocaleString() + ' pezzi' : "-"
      operazione.giorni_da_utlima_pop = operazione.intervallo_giorni ? operazione.intervallo_giorni - operazione.giorni_mancanti + ' giorni' : "-"
      operazione.icona_pezzi = operazione.pezzi_mancanti <= 0 ? faWarning : faCircleCheck;
      operazione.icona_giorni = operazione.giorni_mancanti <= 0 ? faWarning : faCircleCheck;
      operazione.messaggio_pezzi = operazione.pezzi_mancanti <= 0 ? "Ritardo" : "Da fare tra";
      operazione.messaggio_giorni = operazione.giorni_mancanti <= 0 ? "Ritardo" : "Da fare tra";
  
      operazione.pezzi_mancanti = operazione.intervallo_pezzi ? operazione.pezzi_mancanti.toLocaleString() + ' pezzi' : "-"
      operazione.giorni_mancanti = operazione.intervallo_giorni ? operazione.giorni_mancanti + ' giorni' : "-"
      operazione.intervallo_pezzi = operazione.intervallo_pezzi ? operazione.intervallo_pezzi.toLocaleString() + ' pezzi' : "-"
      operazione.intervallo_giorni = operazione.intervallo_giorni ? operazione.intervallo_giorni + ' giorni' : "-"
    }
    operazione.tipologia = operazione.tipologia === "fissaggio" ? "analisi" : operazione.tipologia
    if (scadutaGiorni || scadutaPezzi) parsedData.late.push(operazione)
    else parsedData.ok.push(operazione)
  })
  parsedData.ok = parsedData.ok.sort((a, b) => parseNumber(a.pezzi_mancanti) - parseNumber(b.pezzi_mancanti))
  parsedData.late = parsedData.late.sort((a, b) => parseNumber(a.pezzi_mancanti) - parseNumber(b.pezzi_mancanti))
  return parsedData
}

const parseNumber = (number) => {
  return parseInt(number.split(' ')[0].replaceAll(".", ""))
}

export const parseSchedaLavorazione = (response) => {
  for (const [key, value] of Object.entries(response.scheda_controllo.caratteristiche)) {
    response.scheda_controllo[key] = value
  }
  delete response.scheda_controllo.caratteristiche
  return response
}