import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData";
import { URLS } from "../../../urls";
import FormWrapper from "../../FormWrapper";
import Tabella from "../../Tabella";
import Wrapper from "../Wrapper";
import SchedaControlloForm from "./SchedaControlloForm";

function SchedaControllo() {
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "articoli", url: URLS.ARTICOLI},
    {nome: "records", url: URLS.RECORD_LAVORAZIONI},
  ])
  return (
    <Wrapper title="Scheda di Controllo">
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Scheda di Controllo</PageTitle>
        <Row className="mt-6">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Aggiungi lavorazione lotto
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setData} url={URLS.RECORD_LAVORAZIONI}>
                  <SchedaControlloForm data={data}/>
                </FormWrapper>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Ultimi lotti lavorati
              </Card.Header>
              <Card.Body>
                <Tabella 
                  headers={["Lotto", "N° Pezzi", "Operatore"]}
                  valori={['lotto', 'n_pezzi_dichiarati', 'operatore__operatori']}
                  data={data}
                  setData={setData}
                  FormComponent={SchedaControlloForm}
                  url={URLS.RECORD_LAVORAZIONI}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default SchedaControllo;
