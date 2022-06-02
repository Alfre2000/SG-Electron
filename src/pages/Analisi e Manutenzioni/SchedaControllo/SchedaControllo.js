import React, { useCallback, useEffect, useState } from "react";
import { apiGet } from "../../../api/utils";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card, Stack, Alert } from "react-bootstrap";
import Wrapper from "../subcomponents/Wrapper";
import FormWrapper from "../subcomponents/FormWrapper";
import SchedaControlloForm from "./SchedaControlloForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useGetAPIData from "../../../hooks/useGetAPIData";
import Tabella from "../subcomponents/Tabella";


function SchedaControllo() {
  const parserRecords = useCallback((response) => {
    response.results.forEach((record, idx) => {
      if (record.dati_aggiuntivi) {
        for (const [key, value] of Object.entries(response.results[idx].dati_aggiuntivi)) {
          response.results[idx]['dati_aggiuntivi.' + key] =  value
        }
        delete response.results[idx].dati_aggiuntivi
      }
    })
    return response
  }, [])
  const parserScheda = useCallback((response) => {
    for (const [key, value] of Object.entries(response.scheda_controllo.caratteristiche)) {
      response.scheda_controllo[key] = value
    }
    delete response.scheda_controllo.caratteristiche
    return response
  }, [])
  const setParsedData = (newData) => {
    console.log(newData);
    setData({...data, records: parserRecords(newData.records)})
  }
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "articoli", url: URLS.ARTICOLI},
    {url: URLS.SCHEDA_CONTROLLO_OSSIDO, parser: parserScheda},
    {nome: "records", url: URLS.RECORD_LAVORAZIONI, parser: parserRecords},
  ])
  const [avvisi, setAvvisi] = useState([]);
  useEffect(() => {
    apiGet(URLS.PAGINA_PROSSIME).then(res => {
      if (!res) return;
      let parsedData = { ok: [], late: [] }
      res.operazioni.forEach(operazione => {
        const scadutaGiorni = operazione.giorni_mancanti && operazione.giorni_mancanti <= 0
        const scadutaPezzi = operazione.pezzi_mancanti && operazione.pezzi_mancanti <= 0
        if (scadutaGiorni || scadutaPezzi) {
          parsedData.late.push(operazione)
        } else {
          parsedData.ok.push(operazione)
        }
      })
      parsedData.ok = parsedData.ok.sort((a, b) => a.pezzi_mancanti - b.pezzi_mancanti)
      setAvvisi(parsedData.late)
    })
  }, [data])
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <Row className="justify-center">
          <Col xs={8} className="px-6">
            <Card className="h-full min-h-[70px]">
              <Card.Header className="h-full grid items-center border-b-0 titolo-pagina">
                <h3 className="text-2xl text-nav-blue text-bold font-roboto">
                  Scheda di Controllo
                </h3>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Stack className="pt-8" gap={0}>
          {avvisi && avvisi.map(operazione => {
            let link = "/";
            if (operazione.tipologia === "fissaggio") link = `/manutenzione/fissaggio/`;
            if (operazione.tipologia === "analisi") link = `/manutenzione/analisi/?analisi=${operazione.id}`;
            if (operazione.tipologia === "manutenzione") link = `/manutenzione/manutenzioni/?manutenzione=${operazione.id}`;
            return (
            <Alert key={operazione.id} variant="danger" className="py-2 mb-2 text-left pl-[7%] inline-flex items-center">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-10"></FontAwesomeIcon>
              <div className="w-[30%]">{operazione.tipologia === 'analisi' ? "Analisi" : "Manutenzione"} da effettuare:</div>
              <b className="pl-4 w-[55%]">{operazione.nome}</b>
              <Link to={link}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" /></Link>
            </Alert>
          )})}
        </Stack>
        <Row className="mt-6">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Aggiungi lavorazione lotto
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setParsedData} url={URLS.RECORD_LAVORAZIONI}>
                  <SchedaControlloForm data={data} />
                </FormWrapper>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Ultimi lotti lavorati
              </Card.Header>
              <Card.Body>
                <Tabella 
                  headers={["Lotto", "N° Pezzi", "Operatore"]}
                  valori={['lotto', 'n_pezzi_dichiarati', 'operatore__operatori']}
                  data={data}
                  setData={setParsedData}
                  FormComponent={SchedaControlloForm}
                  url={URLS.RECORD_LAVORAZIONI}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default SchedaControllo;
