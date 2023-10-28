import {
  faArrowCircleRight,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Card, Col, Container, Placeholder, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { URLS } from "../../../urls";
import Wrapper from "../Wrapper";
import { parseProssimeManutenzioni } from "../parsers";
import InfoPopup from "./InfoPopup";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";

function Prossime() {
  const [popup, setPopup] = useState(null);
  const scadenzeQuery = useImpiantoQuery(
    { queryKey: URLS.PAGINA_PROSSIME },
    { select: (data) => parseProssimeManutenzioni(data, true) }
  );
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Prossime Manutenzioni</PageTitle>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Allarmi attivi
              </Card.Header>
              <Card.Body className="px-4 pb-0">
                <Table striped bordered className="align-middle">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Frequenza</th>
                      <th>Ritardo</th>
                      <th>Frequenza</th>
                      <th>Ritardo</th>
                      <th>Info</th>
                      <th>Esegui</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scadenzeQuery.isSuccess &&
                      scadenzeQuery.data.late.length > 0 &&
                      scadenzeQuery.data.late.map((operazione) => (
                        <tr key={operazione.id}>
                          <td className="max-w-[35%] w-[100%]">
                            {operazione.nome}
                          </td>
                          <td>{operazione.intervallo_pezzi}</td>
                          <td
                            className="font-semibold"
                            style={{ color: operazione.colore_pezzi }}
                          >
                            {operazione.pezzi_da_utlima}
                          </td>
                          <td>{operazione.intervallo_giorni}</td>
                          <td
                            className="font-semibold"
                            style={{ color: operazione.colore_giorni }}
                          >
                            {operazione.giorni_da_utlima}
                          </td>
                          <td className="relative">
                            {popup === operazione.id && (
                              <InfoPopup
                                placement="left"
                                setPopup={setPopup}
                                operazione={operazione}
                              />
                            )}
                            <FontAwesomeIcon
                              id="info-icon"
                              className="cursor-pointer text-blue-600 hover:text-blue-800"
                              icon={faCircleQuestion}
                              size="lg"
                              onClick={() => {
                                if (popup !== operazione.id)
                                  setPopup(operazione.id);
                                else setPopup(null);
                              }}
                            />
                          </td>
                          <td to={operazione.link}>
                            <Link
                              to={operazione.link}
                              className="cursor-pointer"
                            >
                              <FontAwesomeIcon
                                icon={faArrowCircleRight}
                                size="lg"
                              />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    {scadenzeQuery.isSuccess &&
                      scadenzeQuery.data.late.length === 0 && (
                        <tr>
                          <td colSpan="7">Nessun allarme attivo</td>
                        </tr>
                      )}
                    {scadenzeQuery.isLoading &&
                      Array.from(Array(3)).map((_, idx) => (
                        <tr key={idx}>
                          <td colSpan={7}>
                            <Placeholder as="p" animation="glow">
                              <Placeholder xs={12} className="rounded-md" />
                            </Placeholder>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Prossime manutenzioni
              </Card.Header>
              <Card.Body className="px-4 pb-0">
                <Table striped bordered className="align-middle">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Frequenza</th>
                      <th>Tra</th>
                      <th>Frequenza</th>
                      <th>Tra</th>
                      <th>Info</th>
                      <th>Esegui</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scadenzeQuery.isSuccess &&
                      scadenzeQuery.data.ok.length > 0 &&
                      scadenzeQuery.data.ok.map((operazione) => (
                        <tr key={operazione.id}>
                          <td className="max-w-[35%] w-[100%]">
                            {operazione.nome}
                          </td>
                          <td>{operazione.intervallo_pezzi}</td>
                          <td
                            className="font-semibold"
                            style={{ color: operazione.colore_pezzi }}
                          >
                            {operazione.pezzi_mancanti}
                          </td>
                          <td>{operazione.intervallo_giorni}</td>
                          <td
                            className="font-semibold"
                            style={{ color: operazione.colore_giorni }}
                          >
                            {operazione.giorni_mancanti}
                          </td>
                          <td className="relative">
                            {popup === operazione.id && (
                              <InfoPopup
                                placement="left"
                                setPopup={setPopup}
                                operazione={operazione}
                              />
                            )}
                            <FontAwesomeIcon
                              id="info-icon"
                              className="cursor-pointer text-blue-600 hover:text-blue-800"
                              icon={faCircleQuestion}
                              size="lg"
                              onClick={() => {
                                if (popup !== operazione.id)
                                  setPopup(operazione.id);
                                else setPopup(null);
                              }}
                            />
                          </td>
                          <td
                            to={operazione.link}
                            className="cursor-pointer"
                            onClick={() =>
                              window.scrollTo(0, 0, { behavior: "smooth" })
                            }
                          >
                            <Link to={operazione.link}>
                              <FontAwesomeIcon
                                icon={faArrowCircleRight}
                                size="lg"
                              />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    {scadenzeQuery.isSuccess &&
                      scadenzeQuery.data.ok.length === 0 && (
                        <tr>
                          <td colSpan="7">Nessuna manutenzione in coda</td>
                        </tr>
                      )}
                    {scadenzeQuery.isLoading &&
                      Array.from(Array(3)).map((_, idx) => (
                        <tr key={idx}>
                          <td colSpan={7}>
                            <Placeholder as="p" animation="glow">
                              <Placeholder xs={12} className="rounded-md" />
                            </Placeholder>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Prossime;
