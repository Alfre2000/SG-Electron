import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Container, Row, Card, Alert } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import FormWrapper from "../../AreaAdmin/FormWrapper";
import Tabella from "../../Tabella";
import Wrapper from "../Wrapper";
import RecordSchedaImpiantoForm from "./RecordSchedaImpiantoForm";

function RecordSchedaImpianto() {
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "schede_impianto", url: URLS.SCHEDE_IMPIANTO},
    {nome: "records", url: URLS.RECORD_SCHEDE_IMPIANTO},
  ])
  return (
    <Wrapper title="Scheda di Controllo">
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Scheda Impianto</PageTitle>
        {data?.schede_impianto?.length === 0 ? (
          <Alert variant="danger" className="mt-14 py-3 px-6 mb-2 text-left inline-flex items-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-10"></FontAwesomeIcon>
            <div>L'impianto non presenta ancora nessuna scheda</div>
          </Alert>
        ) : data?.schede_impianto && (
          <>
          <Row className="mt-6">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Aggiungi scheda impianto
                </Card.Header>
                <Card.Body className="px-5">
                  <FormWrapper data={data} setData={setData} url={URLS.RECORD_SCHEDE_IMPIANTO}>
                    <RecordSchedaImpiantoForm data={data} />
                  </FormWrapper>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Ultimi schede impianto
                </Card.Header>
                <Card.Body>
                  <Tabella 
                    headers={["Operatore"]}
                    valori={['operatore__operatori']}
                    data={data}
                    setData={setData}
                    FormComponent={RecordSchedaImpiantoForm}
                    url={URLS.RECORD_SCHEDE_IMPIANTO}
                    FormWrapper={FormWrapper}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          </>
        )}
      </Container>
    </Wrapper>
  )
}

export default RecordSchedaImpianto