import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../Wrapper";
import FormWrapper from "../../FormWrapper";
import ManutenzioneForm from "./ManutenzioneForm";
import useGetAPIData from "../../../hooks/useGetAPIData";
import Tabella from "../../Tabella";
import PageTitle from "../../../components/PageTitle/PageTitle";

function Manutenzione() {
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "operazioni", url: URLS.MANUTENZIONI},
    {nome: "records", url: URLS.RECORD_MANUTENZIONE}
  ])
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Manutenzione</PageTitle>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Seleziona la manutenzione effettuata
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setData} url={URLS.RECORD_MANUTENZIONE}>
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
                Ultime manutenzioni effettuate
              </Card.Header>
              <Card.Body>
                <Tabella
                  headers={["Manutenzione", "Operatore"]}
                  valori={['operazione__operazioni', 'operatore__operatori']}
                  data={data}
                  setData={setData}
                  FormComponent={ManutenzioneForm}
                  url={URLS.RECORD_MANUTENZIONE}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Manutenzione