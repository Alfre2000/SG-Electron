import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Wrapper from "@ui/wrapper/Wrapper";
import LastSchedaImpianto from "./components/LastSchedaImpianto/LastSchedaImpianto";

function Dashboards() {
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-8">
        <Row className="gap-8">
          <Col className="px-0">
            <LastSchedaImpianto />
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default Dashboards;
