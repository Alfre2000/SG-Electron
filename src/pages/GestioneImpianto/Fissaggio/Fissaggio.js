import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../Wrapper";
import FissaggioForm from "./FissaggioForm";
import FormWrapper from "../../FormWrapper";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import Tabella from "../../Tabella";
import PageTitle from "../../../components/PageTitle/PageTitle";

function Fissaggio() {
  const [data, setData] = useGetAPIData([
    { nome: "operatori", url: URLS.OPERATORI },
    { nome: "operazioni", url: URLS.FISSAGGI },
    { nome: "records", url: URLS.RECORD_FISSAGGIO },
  ]);
  return (
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
                <FormWrapper
                  data={data}
                  setData={setData}
                  url={URLS.RECORD_FISSAGGIO}
                >
                  <FissaggioForm data={data} />
                </FormWrapper>
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
                  data={data}
                  setData={setData}
                  FormComponent={FissaggioForm}
                  url={URLS.RECORD_FISSAGGIO}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Fissaggio;
