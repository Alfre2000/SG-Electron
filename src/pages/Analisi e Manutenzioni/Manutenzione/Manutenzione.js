import React, { useEffect, useState } from "react";
import { apiGet } from "../../../api/utils";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "./../subcomponents/Wrapper";
import Tabella from "./../subcomponents/Tabella";
import FormWrapper from "../subcomponents/FormWrapper";
import ManutenzioneForm from "./ManutenzioneForm";

function Manutenzione() {
  const [data, setData] = useState({});
  useEffect(() => {
    apiGet(URLS.PAGINA_MANUTENZIONI).then(data => setData(data))
    setInterval(() => apiGet(URLS.PAGINA_MANUTENZIONI).then(data => {
      setData(data)
      console.log('Data updated !');
    }), 1000 * 60 * 10)
  }, [])
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <Row className="justify-center">
          <Col xs={8} className="px-6">
            <Card className="h-full min-h-[70px]">
              <Card.Header className="h-full grid items-center border-b-0 titolo-pagina">
                <h3 className="text-2xl text-nav-blue text-bold font-roboto">
                  Manutenzione
                </h3>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Seleziona la manutenzione effettuata
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setData}>
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
                  headers={["Data", "Ora", "Manutenzione", "Operatore"]}
                  data={data}
                  setData={setData}
                  FormComponent={ManutenzioneForm}
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