import React from "react";
import { Col, Row, Stack } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { searchOptions } from "../../../utils";

function ManutenzioneForm({ data, initialData, errors, view }) {
  const impiantoOssido = data?.impianti?.find((impianto) =>
    impianto.nome.includes("Ossido")
  );
  return (
    <>
      <Row className="mb-4 mt-2">
        <Col xs={6} className="pr-6 border-r-2 border-r-gray-500">
          <Stack gap={1}>
            <Input name="nome" inputProps={{ required: true }} />
            <SearchSelect
              name="impianto"
              initialData={initialData}
              inputProps={{
                isDisabled: view,
              }}
              options={searchOptions(impiantoOssido && [impiantoOssido], "nome")}
            />
          </Stack>
        </Col>
        <Col xs={6} className="pl-6">
          <Stack gap={1}>
            <Input name="intervallo_pezzi" inputProps={{ type: "number" }} />
            <Input name="intervallo_giorni" inputProps={{ type: "number" }} />
          </Stack>
        </Col>
        <input hidden className="hidden" name="attiva" defaultValue={true} />
      </Row>
    </>
  )
}

export default ManutenzioneForm