import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "@components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "@ui/wrapper/Wrapper";
import SchedaControlloForm from "./SchedaControlloForm";
import PageContext from "@contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";

function SchedaControllo() {
  return (
    <PageContext
      getURL={URLS.SCHEDE_CONTROLLO}
      FormComponent={SchedaControlloForm}
      queriesToInvalidate={[URLS.ARTICOLI_NESTED, URLS.ARTICOLI]}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Schede di Controllo</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuova Scheda di Controllo
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
                  Ultimi schede controllo create
                </Card.Header>
                <Card.Body>
                  <DataTable columns={[{ accessorKey: "nome" }]} endpoint={URLS.SCHEDE_CONTROLLO} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </PageContext>
  );
}

export default SchedaControllo;
