import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { findElementFromID } from "../../../utils";
import Wrapper from "../Wrapper";
import { URLS } from "../../../urls";
import ManutenzioneForm from "./../Manutenzione/ManutenzioneForm";
import AnalisiForm from "./../Analisi/AnalisiForm";
import FissaggioForm from "./../Fissaggio/FissaggioForm";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import Tabella from "../../Tabella";
import PageTitle from "../../../components/PageTitle/PageTitle";
import RicercaDatabaseForm from "./RicercaDatabaseForm";

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

function RicercaDatabase() {
  const [data, setData] = useGetAPIData([
    { nome: "operatori", url: URLS.OPERATORI },
    { nome: "operazioni", url: URLS.OPERAZIONI_DEEP },
    { nome: "records", url: URLS.PAGINA_RICERCA_DATABASE },
  ]);

  const dataTabella = data.records
    ? {
        ...data,
        records: {
          ...data.records,
          results: data.records.results.map((r) => {
            const tipologia = findElementFromID(
              r.operazione,
              data.operazioni
            ).tipologia;
            return {
              ...r,
              form: tabellaForms[tipologia],
              url: tabellaURLs[tipologia],
            };
          }),
        },
      }
    : {};
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Ricerca nel Database</PageTitle>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Parametri di Ricerca
              </Card.Header>
              <Card.Body className="px-5">
                <RicercaDatabaseForm data={data} setData={setData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Risultati della Ricerca
              </Card.Header>
              <Card.Body className="px-5">
                <Tabella
                  headers={["Operazione", "Operatore"]}
                  valori={["operazione__operazioni", "operatore__operatori"]}
                  data={dataTabella}
                  setData={setData}
                  filtering={false}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default RicercaDatabase;
