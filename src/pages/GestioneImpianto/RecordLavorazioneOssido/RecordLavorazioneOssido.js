import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../../api/utils";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card, Stack, Alert } from "react-bootstrap";
import Wrapper from "../Wrapper";
import FormWrapper from "../../FormWrapper";
import RecordLavorazioneOssidoForm from "./RecordLavorazioneOssidoForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useGetAPIData from "../../../hooks/useGetAPIData";
import Tabella from "../../Tabella";
import { parseProssimeManutenzioni, parseRecordLavorazioni, parseSchedaLavorazione } from "../parsers";
import PageTitle from "../../../components/PageTitle/PageTitle";
import UserContext from "../../../UserContext";


function RecordLavorazioneOssido() {
  const { user: { user: { impianto } } } = useContext(UserContext)
  const [avvisi, setAvvisi] = useState([]);
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "articoli", url: URLS.ARTICOLI},
    {url: URLS.SCHEDA_CONTROLLO_OSSIDO, parser: parseSchedaLavorazione},
    {nome: "records", url: URLS.RECORD_LAVORAZIONI, parser: parseRecordLavorazioni},
  ])
  const setParsedData = (newData) => {
    setData({...data, records: parseRecordLavorazioni(newData.records)})
  }
  useEffect(() => {
    apiGet(`${URLS.PAGINA_PROSSIME}?${impianto?.id ? `impianto=${impianto.id}` : ""}`).then(res => {
      const parsedData = parseProssimeManutenzioni(res)
      setAvvisi(parsedData.late)
    })
  }, [data.records, impianto])
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Scheda di Controllo</PageTitle>
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
                  <RecordLavorazioneOssidoForm data={data} />
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
                  valori={['n_lotto_cliente', 'n_pezzi_dichiarati', 'operatore__operatori']}
                  data={data}
                  setData={setParsedData}
                  FormComponent={RecordLavorazioneOssidoForm}
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

export default RecordLavorazioneOssido;
