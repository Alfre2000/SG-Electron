import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import FormWrapper from "../../FormWrapper";
import Wrapper from "../../AreaAdmin/Wrapper";
import ManutenzioneForm from "./ManutenzioneForm";
import Tabella from "../../Tabella";

function Manutenzione() {
  const [data, setData] = useGetAPIData([
    { nome: "impianti", url: URLS.IMPIANTI },
    { nome: "records", url: URLS.MANUTENZIONI },
  ]);
  return (
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
                <FormWrapper
                  data={data}
                  setData={setData}
                  url={URLS.MANUTENZIONI}
                >
                  <ManutenzioneForm data={data} />
                </FormWrapper>
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
                  headers={["Impianto", "Nome", "Intervallo pezzi", "Intervallo giorni"]}
                  valori={["impianto__impianti", "nome", "intervallo_pezzi", "intervallo_giorni"]}
                  data={data}
                  setData={setData}
                  FormComponent={ManutenzioneForm}
                  url={URLS.MANUTENZIONI}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Manutenzione;
