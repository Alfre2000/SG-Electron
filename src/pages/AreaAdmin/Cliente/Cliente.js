import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import FormWrapper from "../../FormWrapper";
import Wrapper from "../../AreaAdmin/Wrapper";
import ClienteForm from "./ClienteForm";
import Tabella from "../../Tabella";

function Cliente() {
  const [data, setData] = useGetAPIData([
    { nome: "records", url: URLS.CLIENTI },
  ]);
  return (
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
                <FormWrapper data={data} setData={setData} url={URLS.CLIENTI}>
                  <ClienteForm data={data} />
                </FormWrapper>
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
                  headers={["Nome"]}
                  valori={["nome"]}
                  data={data}
                  setData={setData}
                  FormComponent={ClienteForm}
                  url={URLS.CLIENTI}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Cliente;
