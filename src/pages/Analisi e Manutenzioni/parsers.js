export const parseProssimeManutenzioni = (response) => {
  let parsedData = { ok: [], late: [] }
  if (!response) return parsedData;
  response.operazioni.forEach(operazione => {
    const scadutaGiorni = operazione.giorni_mancanti !== null && operazione.giorni_mancanti <= 0
    const scadutaPezzi = operazione.pezzi_mancanti !== null && operazione.pezzi_mancanti <= 0
    if (scadutaGiorni || scadutaPezzi) parsedData.late.push(operazione)
    else parsedData.ok.push(operazione)
  })
  parsedData.ok = parsedData.ok.sort((a, b) => a.pezzi_mancanti - b.pezzi_mancanti)
  parsedData.late = parsedData.late.sort((a, b) => a.pezzi_mancanti - b.pezzi_mancanti)
  return parsedData
}

export const parseRecordFissaggi = (response) => {
  response.results = response.results.map(record => {
    record.ph = record.record_parametri[0].valore
    return record
  })
  return response
}

export const parseRecordLavorazioni = (response) => {
  response.results.forEach((record, idx) => {
    if (record.dati_aggiuntivi) {
      for (const [key, value] of Object.entries(response.results[idx].dati_aggiuntivi)) {
        response.results[idx]['dati_aggiuntivi.' + key] =  value
      }
      delete response.results[idx].dati_aggiuntivi
    }
  })
  return response
}

export const parseSchedaLavorazione = (response) => {
  for (const [key, value] of Object.entries(response.scheda_controllo.caratteristiche)) {
    response.scheda_controllo[key] = value
  }
  delete response.scheda_controllo.caratteristiche
  return response
}