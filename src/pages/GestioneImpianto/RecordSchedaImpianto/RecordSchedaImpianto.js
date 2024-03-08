import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { Col, Container, Row, Card, Alert } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Form from "../../Form";
import Wrapper from "@ui/wrapper/Wrapper";
import RecordSchedaImpiantoForm from "./RecordSchedaImpiantoForm";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import PageContext from "../../../contexts/PageContext";
import DataTable from "@ui/data-table/DataTable";

function RecordSchedaImpianto() {
  const [warning, setWarning] = useState(false);
  const schedeImpiantoQuery = useImpiantoQuery({ queryKey: URLS.SCHEDE_IMPIANTO });

  const pageRef = useRef();
  const validator = (form) => {
    const checkboxes = [...form.elements].filter(
      (el) => el.name.startsWith("record_verifiche_iniziali") && !el.hasAttribute("hidden")
    );
    if (!checkboxes.every((el) => el.checked) && warning === false) {
      setWarning(true);
      pageRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return false;
    }
    setWarning(false);
    return true;
  };
  return (
    <PageContext
      getURL={URLS.RECORD_SCHEDE_IMPIANTO}
      FormComponent={RecordSchedaImpiantoForm}
      impiantoFilter={true}
      queriesToInvalidate={[URLS.ULTIMA_SCHEDA_IMPIANTO]}
    >
      <Wrapper title="Scheda di Controllo" ref={pageRef}>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Scheda Impianto</PageTitle>
          {schedeImpiantoQuery.isSuccess && schedeImpiantoQuery.data.length === 0 ? (
            <Alert variant="danger" className="mt-14 py-3 px-6 mb-2 text-left inline-flex items-center">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-10"></FontAwesomeIcon>
              <div>L'impianto non presenta ancora nessuna scheda</div>
            </Alert>
          ) : (
            schedeImpiantoQuery.isSuccess && (
              <>
                <Row className="mt-6">
                  <Col xs={12}>
                    <Card>
                      <Card.Header as="h6" className="font-semibold text-lg">
                        Aggiungi scheda impianto
                      </Card.Header>
                      <Card.Body className="px-5">
                        <Form validator={validator} componentProps={{ warning }} />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row className="mt-10">
                  <Col xs={12}>
                    <Card>
                      <Card.Header as="h6" className="font-semibold text-lg">
                        Ultimi schede impianto
                      </Card.Header>
                      <Card.Body>
                        <DataTable
                          columns={[
                            { accessorKey: "data", type: "datetime" },
                            { accessorKey: "operatore__nome", query: URLS.OPERATORI },
                            { accessorKey: "note" },
                          ]}
                          endpoint={URLS.RECORD_SCHEDE_IMPIANTO}
                          options={{canCopy: false, impiantoFilter: true}}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )
          )}
        </Container>
      </Wrapper>
    </PageContext>
  );
}

export default RecordSchedaImpianto;
