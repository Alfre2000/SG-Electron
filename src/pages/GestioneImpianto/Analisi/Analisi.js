import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../Wrapper";
import Form from "../../Form";
import AnalisiForm from "./AnalisiForm";
import Tabella from "../../Tabella";
import PageTitle from "../../../components/PageTitle/PageTitle";
import PageContext from "../../../contexts/PageContext";

function Analisi() {
  return (
    <PageContext
      getURL={URLS.RECORD_ANALISI}
      FormComponent={AnalisiForm}
      impiantoFilter={true}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Analisi</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Seleziona l'analisi effettuata
                </Card.Header>
                <Card.Body className="px-5">
                  <Form />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Ultime analisi effettuate
                </Card.Header>
                <Card.Body>
                  <Tabella
                    headers={["Analisi", "Operatore"]}
                    valori={["operazione__operazioni", "operatore__operatori"]}
                    queries={{
                      operazioni: URLS.ANALISI,
                      operatori: URLS.OPERATORI,
                    }}
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

export default Analisi;
