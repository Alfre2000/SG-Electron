import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "@components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "@ui/wrapper/Wrapper";
import SchedaImpiantoForm from "./SchedaImpiantoForm";
import PageContext from "@contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";

function SchedaImpianto() {
  const onSuccess = (_, queryClient) => {
    queryClient.invalidateQueries(URLS.MATERIALI);
  };
  return (
    <PageContext getURL={URLS.SCHEDE_IMPIANTO} FormComponent={SchedaImpiantoForm}>
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Schede Impianto</PageTitle>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Nuova scheda impianto
                </Card.Header>
                <Card.Body className="px-5">
                  <Form onSuccess={onSuccess} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-10">
            <Col xs={12}>
              <Card>
                <Card.Header as="h6" className="font-semibold text-lg">
                  Schede impianto create
                </Card.Header>
                <Card.Body>
                  <DataTable
                    columns={[{ accessorKey: "impianto__nome", query: URLS.IMPIANTI }]}
                    endpoint={URLS.SCHEDE_IMPIANTO}
                    onSuccess={onSuccess}
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

export default SchedaImpianto;
