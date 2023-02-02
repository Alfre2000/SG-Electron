import React, { useEffect, useState } from "react";
import { apiGet } from "../../../api/api";
import { URLS } from "../../../urls";
import { Col, Container, Row, Card, Stack, Alert } from "react-bootstrap";
import Wrapper from "../Wrapper";
import FormWrapper from "../../FormWrapper";
import RecordLavorazioneOssidoForm from "./RecordLavorazioneOssidoForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import Tabella from "../../Tabella";
import { parseProssimeManutenzioni, parseSchedaLavorazione } from "../parsers";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { useUserContext } from "../../../UserContext";
import { capitalize, isDateRecent } from "../../../utils";
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
  const { user } = useUserContext();
  const [avvisi, setAvvisi] = useState([]);
  const [data, setData] = useGetAPIData([
    { nome: "operatori", url: URLS.OPERATORI },
    { nome: "articoli", url: URLS.ARTICOLI },
    { url: URLS.SCHEDA_CONTROLLO_OSSIDO, parser: parseSchedaLavorazione },
    { nome: "records", url: URLS.RECORD_LAVORAZIONI },
    { nome: "scheda_impianto", url: URLS.ULTIMA_SCHEDA_IMPIANTO },
  ]);
  useEffect(() => {
    const impianto = user?.user?.impianto?.id;
    const URL = `${URLS.PAGINA_PROSSIME}?${
      impianto ? `impianto=${impianto}` : ""
    }`;
    apiGet(URL).then((res) => {
      const parsedData = parseProssimeManutenzioni(res);
      setAvvisi(parsedData.late);
    });
  }, [data.records, user?.user?.impianto?.id]);
  const isSchedaImpiantoOld =
    data?.scheda_impianto?.id && !isDateRecent(data.scheda_impianto.data, 8);
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Scheda di Controllo</PageTitle>
        <Stack className="pt-8" gap={0}>
          {(isSchedaImpiantoOld || avvisi.length > 0) && (
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
              {avvisi &&
                avvisi.map((operazione) => (
                  <motion.div variants={alert}>
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
                <FormWrapper
                  data={data}
                  setData={setData}
                  url={URLS.RECORD_LAVORAZIONI}
                >
                  <RecordLavorazioneOssidoForm data={data} />
                </FormWrapper>
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
                    "n_pezzi_dichiarati",
                    "operatore__operatori",
                  ]}
                  types={["text", "number", "text"]}
                  data={data}
                  setData={setData}
                  FormComponent={RecordLavorazioneOssidoForm}
                  url={URLS.RECORD_LAVORAZIONI}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default RecordLavorazioneOssido;
