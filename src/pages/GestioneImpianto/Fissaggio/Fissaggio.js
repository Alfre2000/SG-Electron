import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "@ui/wrapper/Wrapper";
import FissaggioForm from "./FissaggioForm";
import Form from "../../Form";
import PageTitle from "../../../components/PageTitle/PageTitle";
import PageContext from "../../../contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";

function Fissaggio() {
  return (
    <PageContext
      getURL={URLS.RECORD_FISSAGGIO}
      FormComponent={FissaggioForm}
      impiantoFilter={true}
      queriesToInvalidate={[URLS.PAGINA_PROSSIME]}
    >
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
                  <Form />
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
                  <DataTable
                    endpoint={URLS.RECORD_FISSAGGIO}
                    columns={[
                      { accessorKey: "data", type: "datetime", size: 25 },
                      { accessorKey: "operatore__nome", query: URLS.OPERATORI, enableSorting: false },
                      { accessorKey: "record_parametri__0__valore", label: "pH", enableSorting: false },
                    ]}
                    options={{ impiantoFilter: true, canCopy: false }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </PageContext>
  );
}

export default Fissaggio;
