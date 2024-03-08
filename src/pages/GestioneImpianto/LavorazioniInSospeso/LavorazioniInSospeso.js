import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Wrapper from "@ui/wrapper/Wrapper";
import RecordLavorazioneForm from "./../RecordLavorazione/RecordLavorazioneForm";
import PageContext from "../../../contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";

function LavorazioniInSospeso() {
  return (
    <PageContext
      getURL={URLS.RECORD_LAVORAZIONI_IN_SOSPESO}
      postURL={URLS.RECORD_LAVORAZIONI}
      FormComponent={RecordLavorazioneForm}
      queriesToInvalidate={[URLS.RECORD_LAVORAZIONI_IN_SOSPESO]}
      impiantoFilter={true}
    >
      <Wrapper title="Scheda di Controllo">
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Lavorazioni in sospeso</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Lavorazioni non completate
                </Card.Header>
                <Card.Body>
                  <DataTable
                    endpoint={URLS.RECORD_LAVORAZIONI_IN_SOSPESO}
                    columns={[
                      { accessorKey: "data", type: "datetime", size: 25 },
                      { accessorKey: "n_lotto_super", label: "Lotto" },
                      { accessorKey: "quantità" },
                      { accessorKey: "operatore__nome", query: URLS.OPERATORI },
                      { accessorKey: "completata", type: "boolean", enableSorting: false},
                    ]}
                    options={{ impiantoFilter: true, canCopy: false, canDelete: false}}
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

export default LavorazioniInSospeso;
