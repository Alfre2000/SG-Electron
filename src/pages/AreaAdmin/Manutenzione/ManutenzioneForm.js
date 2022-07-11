import React from "react";
import { Col, Row, Stack } from "react-bootstrap";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { searchOptions } from "../../../utils";

function ManutenzioneForm({ data }) {
  return (
    <>
      <Row className="mb-4 mt-2">
        <Col xs={6} className="pr-6 border-r-2 border-r-gray-500">
          <Stack gap={1}>
            <Input name="nome" />
            <SearchSelect
              name="impianto"
              options={searchOptions(data?.impianti, "nome")}
            />
          </Stack>
        </Col>
        <Col xs={6} className="pl-6">
          <Stack gap={1}>
            <Input name="intervallo_pezzi" inputProps={{ type: "number" }} />
            <Input name="intervallo_giorni" inputProps={{ type: "number" }} />
          </Stack>
        </Col>
        <Hidden name="attiva" value={true} />
      </Row>
    </>
  );
}

export default ManutenzioneForm;
