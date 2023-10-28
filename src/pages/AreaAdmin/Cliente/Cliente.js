import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "../../AreaAdmin/Wrapper";
import ClienteForm from "./ClienteForm";
import Tabella from "../../Tabella";
import PageContext from "../../../contexts/PageContext";

function Cliente() {
  return (
    <PageContext
      getURL={URLS.CLIENTI}
      FormComponent={ClienteForm}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Clienti</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuovo Cliente
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
                  Ultimi Clienti creati
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

export default Cliente;
