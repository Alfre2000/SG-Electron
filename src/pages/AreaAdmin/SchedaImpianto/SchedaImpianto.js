import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import FormWrapper from "../../FormWrapper";
import Wrapper from "../../AreaAdmin/Wrapper";
import SchedaImpiantoForm from "./SchedaImpiantoForm";
import Tabella from "../../Tabella";

function SchedaImpianto() {
  const [data, setData] = useGetAPIData([
    { nome: "impianti", url: URLS.IMPIANTI },
    { nome: "materiali", url: URLS.MATERIALI },
    { nome: "records", url: URLS.SCHEDE_IMPIANTO },
  ]);
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Schede Impianto</PageTitle>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Nuova scheda impianto
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper
                  data={data}
                  setData={setData}
                  url={URLS.SCHEDE_IMPIANTO}
                >
                  <SchedaImpiantoForm data={data} />
                </FormWrapper>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Schede impianto create
              </Card.Header>
              <Card.Body>
                <Tabella
                  date={false}
                  headers={["Impianto"]}
                  valori={["impianto__impianti"]}
                  data={data}
                  setData={setData}
                  FormComponent={SchedaImpiantoForm}
                  url={URLS.SCHEDE_IMPIANTO}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default SchedaImpianto;
