import React, { useEffect, useState } from "react";
import { apiGet } from "../../../api/utils";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../subcomponents/Wrapper";
import Tabella from "../subcomponents/Tabella";
import FormWrapper from "../subcomponents/FormWrapper";
import OssidoForm from "./OssidoForm";


function Ossido() {
  const [data, setData] = useState({});
  useEffect(() => {
    apiGet(URLS.PAGINA_OSSIDI).then(data => setParsedData(data))
    setInterval(() => apiGet(URLS.PAGINA_OSSIDI).then(data => {
      setParsedData(data)
      console.log('Data updated !');
    }), 1000 * 60 * 10)
  }, [])
  const setParsedData = (response) => {
    response.records = response.records.map(record => {
      const manutenzione = response.operazioni.filter(op => op.id === record.operazione)[0]
      record.aggiuta_solforico = manutenzione.nome.toLowerCase().includes('solforico') 
      record.aggiuta_ossalico = manutenzione.nome.toLowerCase().includes('ossalico') 
      record.tagliato_bagno = manutenzione.nome.toLowerCase().includes('taglio bagno') 
      return record
    })
    setData(response)
  }
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <Row className="justify-center">
          <Col xs={8} className="px-6">
            <Card className="h-full min-h-[70px]">
              <Card.Header className="h-full grid items-center border-b-0 titolo-pagina">
                <h3 className="text-2xl text-nav-blue text-bold font-roboto">
                  Ossido
                </h3>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Registra aggiunta vasca ossido
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setParsedData}>
                  <OssidoForm data={data} />
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
                  headers={["Data", "Ora", "Operatore"]}
                  data={data}
                  setData={setParsedData}
                  FormComponent={OssidoForm}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Ossido