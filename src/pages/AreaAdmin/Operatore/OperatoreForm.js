import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { useFormContext } from "../../../contexts/FormContext";
import { searchOptions } from "../../../utils";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { URLS } from "../../../urls";

function OperatoreForm() {
  const impiantiQuery = useCustomQuery({ queryKey: URLS.IMPIANTI });
  const { initialData } = useFormContext();
  const [impianti, setImpianti] = useState(
    initialData?.impianti
      ? searchOptions(impiantiQuery.data, "nome").filter((im) =>
          initialData.impianti.includes(im.value)
        )
      : []
  );
  return (
    <>
      <Row className="mb-8">
        <Col xs={6} className="flex justify-center">
          <Input name="nome" vertical={true} />
        </Col>
        <Col xs={6} className="pl-10 flex m-auto justify-center">
          <Input name="codice" vertical={true} />
        </Col>
      </Row>
      <Row className="mb-4 mx-10">
        <SearchSelect
          errorName="impianti"
          labelCols={2}
          options={searchOptions(impiantiQuery.data, "nome")}
          inputProps={{
            isMulti: true,
            value: impianti,
            onChange: (e) => setImpianti(e),
          }}
        />
        <Hidden
          name="impianti"
          value={`[${impianti?.map((x) => x.value).join()}]`}
        />
      </Row>
    </>
  );
}

export default OperatoreForm;
