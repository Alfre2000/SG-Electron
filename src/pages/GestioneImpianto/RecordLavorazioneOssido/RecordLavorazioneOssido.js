import React from "react";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card, Stack, Alert } from "react-bootstrap";
import Wrapper from "../Wrapper";
import Form from "../../Form";
import RecordLavorazioneOssidoForm from "./RecordLavorazioneOssidoForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Tabella from "../../Tabella";
import { parseProssimeManutenzioni } from "../parsers";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { capitalize, isDateRecent } from "../../../utils";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import PageContext from "../../../contexts/PageContext";
const { motion } = require("framer-motion");

const alert = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1 },
};
const alerts = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function RecordLavorazioneOssido() {
  const schedaImpiantoQuery = useImpiantoQuery({ queryKey: URLS.ULTIMA_SCHEDA_IMPIANTO });
  const avvisiQuery = useImpiantoQuery(
    { queryKey: URLS.PAGINA_PROSSIME },
    { select: parseProssimeManutenzioni }
  );
  const isSchedaImpiantoOld =
    schedaImpiantoQuery.data?.id && !isDateRecent(schedaImpiantoQuery.data.data, 8);
  return (
    <PageContext
      getURL={URLS.RECORD_LAVORAZIONI_OSSIDO}
      postURL={URLS.RECORD_LAVORAZIONI}
      FormComponent={RecordLavorazioneOssidoForm}
      impiantoFilter={true}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Scheda di Controllo</PageTitle>
          <Stack className="pt-8" gap={0}>
            {(isSchedaImpiantoOld || avvisiQuery.data?.length > 0) && (
              <motion.div variants={alerts} initial="hidden" animate="show">
                {isSchedaImpiantoOld && (
                  <motion.div variants={alert}>
                    <Alert
                      variant="danger"
                      className="py-2 mb-2 text-left pl-[7%] inline-flex items-center w-full"
                    >
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="mr-10"
                      ></FontAwesomeIcon>
                      <div className="w-[30%]">Attenzione:</div>
                      <b className="pl-4 w-[55%]">
                        {" "}
                        Compilare la scheda dell'impianto !
                      </b>
                      <Link to="/manutenzione/record-scheda-impianto/">
                        <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
                      </Link>
                    </Alert>
                  </motion.div>
                )}
                {avvisiQuery.isSuccess &&
                  avvisiQuery.data.late.map((operazione) => (
                    <motion.div variants={alert} key={operazione.id}>
                      <Alert
                        key={operazione.id}
                        variant="danger"
                        className="py-2 mb-2 text-left pl-[7%] inline-flex items-center w-full"
                      >
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="mr-10"
                        ></FontAwesomeIcon>
                        <div className="w-[30%]">
                          {capitalize(operazione.tipologia)} da effettuare:
                        </div>
                        <b className="pl-4 w-[55%] pr-2">{operazione.nome}</b>
                        <Link to={operazione.link}>
                          <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
                        </Link>
                      </Alert>
                    </motion.div>
                  ))}
              </motion.div>
            )}
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
                  <Tabella
                    headers={["Lotto", "N° Pezzi", "Operatore"]}
                    valori={[
                      "n_lotto_cliente",
                      "quantità",
                      "operatore__operatori",
                    ]}
                    types={["text", "number", "text"]}
                    queries={{ operatori: URLS.OPERATORI }}
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

export default RecordLavorazioneOssido;
