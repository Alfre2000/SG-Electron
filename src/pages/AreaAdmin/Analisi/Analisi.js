import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Wrapper from "../../AreaAdmin/Wrapper";
import AnalisiForm from "./AnalisiForm";
import Tabella from "../../Tabella";
import PageContext from "../../../contexts/PageContext";
import Form from "../../Form";

function Analisi() {
  return (
    <PageContext
      getURL={URLS.ANALISI}
      FormComponent={AnalisiForm}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Analisi</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuova analisi
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
                  Ultime analisi create creati
                </Card.Header>
                <Card.Body>
                  <Tabella
                    date={false}
                    valori={["impianto__impianti", "nome", "intervallo_pezzi", "intervallo_giorni"]}
                    queries={{ impianti: URLS.IMPIANTI }}
                    colSizes={[20, 40, 20, 20]}
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
