import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../Wrapper";
import FissaggioForm from "./FissaggioForm";
import Form from "../../Form";
import Tabella from "../../Tabella";
import PageTitle from "../../../components/PageTitle/PageTitle";
import PageContext from "../../../contexts/PageContext";

function Fissaggio() {
  return (
    <PageContext
      getURL={URLS.RECORD_FISSAGGIO}
      FormComponent={FissaggioForm}
      impiantoFilter={true}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Fissaggio</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Registra aggiunta fissaggio
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
                  Ultime aggiunte eseguite
                </Card.Header>
                <Card.Body>
                  <Tabella
                    headers={["Operatore", "pH"]}
                    valori={[
                      "operatore__operatori",
                      "record_parametri__0__valore",
                    ]}
                    queries={{ operatori: URLS.OPERATORI }}
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

export default Fissaggio;
