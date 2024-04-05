import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card, Stack } from "react-bootstrap";
import Wrapper from "@ui/wrapper/Wrapper";
import Form from "../../Form";
import RecordLavorazioneOssidoForm from "./RecordLavorazioneOssidoForm";
import PageTitle from "../../../components/PageTitle/PageTitle";
import PageContext from "../../../contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";
import Allarmi from "../RecordLavorazione/Allarmi";


function RecordLavorazioneOssido() {
  return (
    <PageContext
      getURL={URLS.RECORD_LAVORAZIONI_OSSIDO}
      postURL={URLS.RECORD_LAVORAZIONI}
      FormComponent={RecordLavorazioneOssidoForm}
      queriesToInvalidate={[URLS.RECORD_LAVORAZIONI_OSSIDO]}
      impiantoFilter={true}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Scheda di Controllo</PageTitle>
          <Stack className="pt-8" gap={0}>
            <Allarmi />
          </Stack>
          <Row className="mt-6">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Aggiungi lavorazione lotto
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
                  Ultimi lotti lavorati
                </Card.Header>
                <Card.Body>
                  <DataTable
                    endpoint={URLS.RECORD_LAVORAZIONI_OSSIDO}
                    columns={[
                      { accessorKey: "data", type: "datetime", size: 25 },
                      { accessorKey: "n_lotto_cliente", label: "Lotto" },
                      { accessorKey: "quantità" },
                      { accessorKey: "operatore__nome", query: URLS.OPERATORI },
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

export default RecordLavorazioneOssido;
