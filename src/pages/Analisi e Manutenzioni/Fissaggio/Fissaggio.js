import React, { useCallback } from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../subcomponents/Wrapper";
import FissaggioForm from "./FissaggioForm";
import FormWrapper from "../subcomponents/FormWrapper";
import useGetAPIData from "../../../hooks/useGetAPIData";
import Tabella from "../subcomponents/Tabella";

function Fissaggio() {
  const parser = useCallback((response) => {
    response.results = response.results.map(record => {
      record.ph = record.record_parametri[0].valore
      return record
    })
    return response
  }, [])
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "operazioni", url: URLS.FISSAGGI},
    {nome: "records", url: URLS.RECORD_FISSAGGIO, parser: parser}
  ])
  const setParsedData = (newData) => {
    setData({...data, records: parser(newData.records)})
  }
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <Row className="justify-center">
          <Col xs={8} className="px-6">
            <Card className="h-full min-h-[70px]">
              <Card.Header className="h-full grid items-center border-b-0 titolo-pagina">
                <h3 className="text-2xl text-nav-blue text-bold font-roboto">
                  Fissaggio
                </h3>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Registra aggiunta fissaggio
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setParsedData} url={URLS.RECORD_ANALISI}>
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
                  valori={['operatore__operatori', 'ph']}
                  data={data}
                  setData={setParsedData}
                  FormComponent={FissaggioForm}
                  url={URLS.RECORD_ANALISI}
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
