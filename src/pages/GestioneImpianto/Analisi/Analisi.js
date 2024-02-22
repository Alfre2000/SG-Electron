import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../Wrapper";
import Form from "../../Form";
import AnalisiForm from "./AnalisiForm";
import PageTitle from "../../../components/PageTitle/PageTitle";
import DataTable from "@ui/data-table/DataTable";
import PageContext from "../../../contexts/PageContext";

function Analisi() {
  return (
    <PageContext
      getURL={URLS.RECORD_ANALISI}
      FormComponent={AnalisiForm}
      impiantoFilter={true}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Analisi</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Seleziona l'analisi effettuata
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
                  Ultime analisi effettuate
                </Card.Header>
                <Card.Body>
                  <DataTable
                    endpoint={URLS.RECORD_ANALISI}
                    columns={[
                      { accessorKey: "data", type: "datetime", size: 25 },
                      { accessorKey: "operazione__nome", query: URLS.ANALISI, size: 50, label: "Analisi", enableSorting: false },
                      { accessorKey: "operatore__nome", query: URLS.OPERATORI, size: 25, enableSorting: false },
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

export default Analisi;
