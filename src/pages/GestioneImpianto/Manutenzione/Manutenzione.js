import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card } from "react-bootstrap";
import Wrapper from "../Wrapper";
import Form from "../../Form";
import ManutenzioneForm from "./ManutenzioneForm";
import PageTitle from "../../../components/PageTitle/PageTitle";
import PageContext from "../../../contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";

function Manutenzione() {
  return (
    <PageContext
      getURL={URLS.RECORD_MANUTENZIONE}
      FormComponent={ManutenzioneForm}
      impiantoFilter={true}
    >
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
                  <Form />
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
                  <DataTable
                    endpoint={URLS.RECORD_MANUTENZIONE}
                    columns={[
                      { accessorKey: "data", type: "datetime", size: 25 },
                      { accessorKey: "operazione__nome", query: URLS.MANUTENZIONI, size: 50, label: "Manutenzione", enableSorting: false },
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

export default Manutenzione;
