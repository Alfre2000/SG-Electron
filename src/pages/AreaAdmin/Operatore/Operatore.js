import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import FormWrapper from "../../FormWrapper";
import Wrapper from "../../AreaAdmin/Wrapper";
import OperatoreForm from "./OperatoreForm";
import Tabella from "../../Tabella";

function Operatore() {
  const [data, setData] = useGetAPIData([
    { nome: "records", url: URLS.OPERATORI },
    { nome: "impianti", url: URLS.IMPIANTI },
  ]);
  return (
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
                <FormWrapper data={data} setData={setData} url={URLS.OPERATORI}>
                  <OperatoreForm data={data} />
                </FormWrapper>
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
                  headers={["Nome"]}
                  valori={["nome"]}
                  data={data}
                  setData={setData}
                  FormComponent={OperatoreForm}
                  url={URLS.OPERATORI}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Operatore;
