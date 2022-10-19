import React from "react";
import { Col, Row, Stack } from "react-bootstrap";
import Input from "../../../components/form-components/Input";

function ClienteForm() {
  return (
    <Row className="mb-4">
      <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
        <Stack gap={2} className="text-left justify-center">
          <Input name="nome" />
          <Input name="piva" label="Partita IVA" />
        </Stack>
      </Col>
      <Col xs={6} className="pl-10 flex m-auto">
        <Stack gap={2} className="text-left">
          <Input name="indirizzo" />
          <Input name="cap" />
          <Input name="città" />
        </Stack>
      </Col>
    </Row>
  );
}

export default ClienteForm;
