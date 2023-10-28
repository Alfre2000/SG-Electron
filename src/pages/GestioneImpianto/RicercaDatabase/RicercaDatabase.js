import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../Wrapper";
import { URLS } from "../../../urls";
import Tabella from "../../Tabella";
import PageTitle from "../../../components/PageTitle/PageTitle";
import RicercaDatabaseForm from "./RicercaDatabaseForm";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import PageContext from "../../../contexts/PageContext";
import ManutenzioneForm from "../Manutenzione/ManutenzioneForm";
import AnalisiForm from "../Analisi/AnalisiForm";
import FissaggioForm from "../Fissaggio/FissaggioForm";
import { findElementFromID } from "../../../utils";

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
  const operazioniQuery = useImpiantoQuery({ queryKey: URLS.OPERAZIONI_DEEP });
  const postURL = (record) => {
    const tipologia = findElementFromID(record.operazione, operazioniQuery.data).tipologia
    return tabellaURLs[tipologia];
  }
  const FormComponent = (record) => {
    const tipologia = findElementFromID(record.operazione, operazioniQuery.data).tipologia
    return tabellaForms[tipologia];
  }
  return (
    <PageContext
      getURL={URLS.PAGINA_RICERCA_DATABASE}
      postURL={postURL}
      FormComponent={FormComponent}
      impiantoFilter={true}
    >
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
                  <RicercaDatabaseForm />
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
                    valori={["operazione__operazioni", "operatore__operatori"]}
                    queries={{
                      operatori: URLS.OPERATORI,
                      operazioni: URLS.OPERAZIONI_DEEP
                    }}
                    filtering={false}
                    colSizes={[70, 30]}
                    canCopy={false}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </PageContext>
  );
}

export default RicercaDatabase;
