import React from "react";
import { Col, Container, Row, Card, Table } from "react-bootstrap";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import Wrapper from "../Wrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

function Dashboards() {
  const [data, setData] = useGetAPIData([{ url: URLS.DASHBOARDS }]);
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <Row>
          <Col>
          <Card className="text-center">
            <Card.Header>Schede Impianto</Card.Header>
            <Card.Body>
              <Table>
                <thead>
                  <tr>
                    <th>Impianto</th>
                    <th>Ultima Scheda</th>
                    <th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.schede_impianto?.map((impianto) => (
                      <tr>
                        <td>{impianto.nome}</td>
                        <td>{impianto.last_scheda_text}</td>
                        <td>{impianto.last_scheda > 48 && (
                          <FontAwesomeIcon icon={faExclamationCircle} className="text-red-800" />
                        )}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Dashboards;
