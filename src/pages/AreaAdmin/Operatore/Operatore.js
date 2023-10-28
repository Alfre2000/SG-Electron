import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "../../AreaAdmin/Wrapper";
import OperatoreForm from "./OperatoreForm";
import Tabella from "../../Tabella";
import PageContext from "../../../contexts/PageContext";

function Operatore() {
  return (
    <PageContext
      getURL={URLS.OPERATORI}
      FormComponent={OperatoreForm}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Operatori</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuovo Operatore
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
                  Ultimi Operatori creati
                </Card.Header>
                <Card.Body>
                  <Tabella
                    date={false}
                    valori={["nome"]}
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

export default Operatore;
