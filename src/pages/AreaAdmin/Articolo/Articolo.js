import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "@components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import ArticoloForm from "./OldArticoloForm";
import NewArticoloForm from "./ArticoloForm";
import PageContext from "@contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";
import Wrapper from "@ui/wrapper/Wrapper";

function Articolo() {
  return (
    <PageContext
      getURL={URLS.ARTICOLI}
      FormComponent={NewArticoloForm}
      queriesToInvalidate={[URLS.ARTICOLI_NESTED, URLS.SCHEDE_CONTROLLO]}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Articoli</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuovo Articolo
                </Card.Header>
                <Card.Body className="px-5">
                  <NewArticoloForm />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Ultimi articoli creati
                </Card.Header>
                <Card.Body>
                  <DataTable
                    columns={[{ accessorKey: "nome" }, { accessorKey: "codice" }, { accessorKey: "cliente" }]}
                    endpoint={URLS.ARTICOLI}
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

export default Articolo;
