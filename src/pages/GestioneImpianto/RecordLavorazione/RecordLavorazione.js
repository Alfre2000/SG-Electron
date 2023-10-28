import {
  faArrowCircleRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Container, Row, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import { isDateRecent } from "../../../utils";
import Form from "../../Form";
import Tabella from "../../Tabella";
import Wrapper from "../Wrapper";
import RecordLavorazioneForm from "./RecordLavorazioneForm";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import PageContext from "../../../contexts/PageContext";
const { motion } = require("framer-motion");

function RecordLavorazione() {
  const { data: schedaImpianto } = useImpiantoQuery({ queryKey: URLS.ULTIMA_SCHEDA_IMPIANTO });
  const isSchedaImpiantoOld = schedaImpianto?.id && !isDateRecent(schedaImpianto.data, 8);
  return (
    <PageContext
      getURL={URLS.RECORD_LAVORAZIONI_NOT_OSSIDO}
      postURL={URLS.RECORD_LAVORAZIONI}
      FormComponent={RecordLavorazioneForm}
      queriesToInvalidate={[URLS.RECORD_LAVORAZIONI_IN_SOSPESO]}
      impiantoFilter={true}
    >
      <Wrapper title="Scheda di Controllo">
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Scheda di Controllo</PageTitle>
          {isSchedaImpiantoOld && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Alert
                variant="danger"
                className="mt-8 -mb-2 py-2 px-20 text-left inline-flex items-center"
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="mr-10"
                ></FontAwesomeIcon>
                <b>Attenzione:</b>
                <div className="pl-2 pr-16">
                  {" "}
                  compilare la scheda dell'impianto !
                </div>
                <Link to="/manutenzione/record-scheda-impianto/">
                  <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
                </Link>
              </Alert>
            </motion.div>
          )}
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
                  <Tabella
                    headers={["Lotto", "N° Pezzi", "Operatore", "Completata"]}
                    valori={[
                      "n_lotto_super",
                      "quantità",
                      "operatore__operatori",
                      "completata"
                    ]}
                    types={["text", "number", "text", "boolean"]}
                    queries={{ operatori: URLS.OPERATORI }}
                    hoursModify={false}
                    canCopy={false}
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
