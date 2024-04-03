import { faArrowCircleRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Container, Row, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import { isDateRecent } from "../../../utils";
import Form from "../../Form";
import Wrapper from "@ui/wrapper/Wrapper";
import RecordLavorazioneForm from "./RecordLavorazioneForm";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import PageContext from "../../../contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";
const { motion } = require("framer-motion");

function RecordLavorazione() {
  const { data: schedaImpianto } = useImpiantoQuery({ queryKey: URLS.ULTIMA_SCHEDA_IMPIANTO });
  const isSchedaImpiantoOld = schedaImpianto?.id && !isDateRecent(schedaImpianto.data, 8);
  const richiesteQuery = useImpiantoQuery({ queryKey: [URLS.RICHIESTE_CORREZIONE_BAGNO, { eseguita: "false" }] });

  const azioniRichieste = [];

  if (isSchedaImpiantoOld) {
    azioniRichieste.push(
      <Alert variant="danger" className="py-2 mb-2 text-left pl-[7%] inline-flex items-center w-full">
        <FontAwesomeIcon icon={faTriangleExclamation} className="mr-10"></FontAwesomeIcon>
        <b className="w-[30%]">Attenzione:</b>
        <div className="pl-4 w-[55%] pr-2"> compilare la scheda dell'impianto !</div>
        <Link to="/manutenzione/record-scheda-impianto/">
          <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
        </Link>
      </Alert>
    );
  }
  richiesteQuery.data?.results?.forEach((richiesta) => {
    azioniRichieste.push(
      <Alert variant="danger" className="py-2 mb-2 text-left pl-[7%] inline-flex items-center w-full">
        <FontAwesomeIcon icon={faTriangleExclamation} className="mr-10"></FontAwesomeIcon>
        <b className="w-[30%]">Richiesta correzione bagno</b>
        <div className="pl-4 w-[55%] pr-2"></div>
        <Link to={`/manutenzione/richiesta-correzione-bagno/${richiesta.id}`}>
          <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
        </Link>
      </Alert>
    );
  });
  return (
    <PageContext
      getURL={URLS.RECORD_LAVORAZIONI_NOT_OSSIDO}
      postURL={URLS.RECORD_LAVORAZIONI}
      FormComponent={RecordLavorazioneForm}
      queriesToInvalidate={[URLS.RECORD_LAVORAZIONI_IN_SOSPESO, URLS.RECORD_LAVORAZIONI_NOT_OSSIDO]}
      impiantoFilter={true}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Scheda di Controllo</PageTitle>
          {azioniRichieste.length > 0 && (
            <div className="mt-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {azioniRichieste}
              </motion.div>
            </div>
          )}
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
