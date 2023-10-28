import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "../../AreaAdmin/Wrapper";
import ManutenzioneForm from "./ManutenzioneForm";
import Tabella from "../../Tabella";
import PageContext from "../../../contexts/PageContext";

function Manutenzione() {
  return (
    <PageContext
      getURL={URLS.MANUTENZIONI}
      FormComponent={ManutenzioneForm}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Manutenzioni</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuova manutenzione
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
                  Ultime manutenzioni create creati
                </Card.Header>
                <Card.Body>
                  <Tabella
                    date={false}
                    valori={[
                      "impianto__impianti",
                      "nome",
                      "intervallo_pezzi",
                      "intervallo_giorni",
                    ]}
                    colSizes={[20, 40, 20, 20]}
                    queries={{ impianti: URLS.IMPIANTI }}
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

export default Manutenzione;
