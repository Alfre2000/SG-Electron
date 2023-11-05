import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Tabella from "../../Tabella";
import Wrapper from "../Wrapper";
import RecordLavorazioneForm from "./../RecordLavorazione/RecordLavorazioneForm";
import PageContext from "../../../contexts/PageContext";

function LavorazioniInSospeso() {
  return (
    <PageContext
      getURL={URLS.RECORD_LAVORAZIONI_IN_SOSPESO}
      postURL={URLS.RECORD_LAVORAZIONI}
      FormComponent={RecordLavorazioneForm}
      queriesToInvalidate={[URLS.RECORD_LAVORAZIONI_IN_SOSPESO]}
      impiantoFilter={true}
    >
      <Wrapper title="Scheda di Controllo">
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Lavorazioni in sospeso</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Lavorazioni non completate
                </Card.Header>
                <Card.Body>
                  <Tabella
                    headers={["Lotto", "N° Pezzi", "Operatore"]}
                    valori={[
                      "n_lotto_super",
                      "quantità",
                      "operatore__operatori",
                    ]}
                    queries={{
                      clienti: URLS.CLIENTI,
                      operatori: URLS.OPERATORI,
                    }}
                    hoursModify={false}
                    filtering={false}
                    canCopy={false}
                    canDelete={false}
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

export default LavorazioniInSospeso;
