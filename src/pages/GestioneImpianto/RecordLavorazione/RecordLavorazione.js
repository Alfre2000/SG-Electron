import {
  faArrowCircleRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Container, Row, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import { isDateRecent } from "../../../utils";
import FormWrapper from "../../FormWrapper";
import Tabella from "../../Tabella";
import Wrapper from "../Wrapper";
import RecordLavorazioneForm from "./RecordLavorazioneForm";
const { motion } = require("framer-motion");

function RecordLavorazione() {
  const [data, setData] = useGetAPIData(
    [
      { nome: "operatori", url: URLS.OPERATORI },
      { nome: "lavorazioni", url: URLS.LAVORAZIONI },
      { nome: "articoli", url: URLS.ARTICOLI_NESTED },
      { nome: "records", url: URLS.RECORD_LAVORAZIONI },
      { nome: "scheda_impianto", url: URLS.ULTIMA_SCHEDA_IMPIANTO },
    ],
    true
  );
  const isSchedaImpiantoOld =
    data?.scheda_impianto?.id && !isDateRecent(data.scheda_impianto.data, 8);
  return (
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
                <FormWrapper
                  data={data}
                  setData={setData}
                  url={URLS.RECORD_LAVORAZIONI}
                >
                  <RecordLavorazioneForm data={data} />
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
                    "n_lotto_super",
                    "n_pezzi_dichiarati",
                    "operatore__operatori",
                  ]}
                  types={["text", "number", "text"]}
                  data={data}
                  setData={setData}
                  FormComponent={RecordLavorazioneForm}
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

export default RecordLavorazione;
