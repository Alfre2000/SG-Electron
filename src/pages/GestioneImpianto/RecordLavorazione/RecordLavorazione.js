import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "@ui/wrapper/Wrapper";
import RecordLavorazioneForm from "./RecordLavorazioneForm";
import PageContext from "../../../contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";
import Allarmi from "./Allarmi";

function RecordLavorazione() {
  return (
    <PageContext
      getURL={URLS.RECORD_LAVORAZIONI_NOT_OSSIDO}
      postURL={URLS.RECORD_LAVORAZIONI}
      FormComponent={RecordLavorazioneForm}
      queriesToInvalidate={[URLS.RECORD_LAVORAZIONI_NOT_OSSIDO]}
      impiantoFilter={true}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Scheda di Controllo</PageTitle>
          <div className="pt-8">
            <Allarmi />
          </div>
          <Row className="mt-6">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Aggiungi lavorazione lotto
                </Card.Header>
                <Card.Body className="px-5">
                  <Form forceNoCopy={true} />
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
                  <DataTable
                    endpoint={URLS.RECORD_LAVORAZIONI_NOT_OSSIDO}
                    columns={[
                      { accessorKey: "data", type: "datetime", size: 25 },
                      { accessorKey: "n_lotto_super", label: "Lotto" },
                      { accessorKey: "quantità" },
                      { accessorKey: "operatore__nome", query: URLS.OPERATORI },
                      { accessorKey: "completata", type: "boolean" },
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

export default RecordLavorazione;
