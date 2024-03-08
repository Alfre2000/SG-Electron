import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "@components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "@ui/wrapper/Wrapper";
import ManutenzioneForm from "./ManutenzioneForm";
import PageContext from "@contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";

function Manutenzione() {
  return (
    <PageContext getURL={URLS.MANUTENZIONI} FormComponent={ManutenzioneForm}>
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Manutenzioni</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuova manutenzione
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
                  Ultime manutenzioni create creati
                </Card.Header>
                <Card.Body>
                  <DataTable
                    columns={[
                      { accessorKey: "impianto__nome", size: 20, query: URLS.IMPIANTI },
                      { accessorKey: "nome", size: 40 },
                      { accessorKey: "intervallo_pezzi", size: 20 },
                      { accessorKey: "intervallo_giorni", size: 20 },
                    ]}
                    endpoint={URLS.MANUTENZIONI}
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

export default Manutenzione;
