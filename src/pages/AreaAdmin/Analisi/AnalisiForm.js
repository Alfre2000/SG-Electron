import React from "react";
import { Col, Row, Stack } from "react-bootstrap";
import Fieldset from "../../../components/form-components/Fieldset";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import TabellaNestedItems from "../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import { searchOptions } from "../../../utils";

function AnalisiForm({ data }) {
  // const impiantoOssido = data?.impianti?.find((impianto) =>
  //   impianto.nome.includes("Ossido")
  // );
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
      </Row>
      <Fieldset title="Parametri">
        <TabellaNestedItems
          name="parametri"
          colonne={[
            { name: "nome" },
            { name: "minimo", type: "number" },
            { name: "ottimo", type: "number" },
            { name: "massimo", type: "number" },
          ]}
        />
      </Fieldset>
    </>
  );
}

export default AnalisiForm;
