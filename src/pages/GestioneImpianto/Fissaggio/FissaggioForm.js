import { Col, Row, Stack } from "react-bootstrap";
import React, { useMemo } from "react";
import TimeInput from "../../../components/form-components/TimeInput/TimeInput";
import { searchOptions } from "../../../utils";
import Input from "../../../components/form-components/Input";
import Checkbox from "../../../components/form-components/Checkbox";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { useFormContext } from "../../../contexts/FormContext";

function FissaggioForm({ data }) {
  const { initialData } = useFormContext();
  const operazione = useMemo(
    () =>
      data?.operazioni
        ? data.operazioni.length === 1
          ? data.operazioni[0]
          : data.operazioni.filter((op) => op.tipologia === "fissaggio")[0]
        : {},
    [data?.operazioni]
  );
  const parametroID = operazione?.parametri?.at(0)?.id || "";
  return (
    <Row className="mb-4 justify-between">
      <Col
        xs={6}
        className="pr-12 border-r-2 border-r-gray-500 border-b-2 border-b-gray-500 pb-6"
      >
        <Stack gap={2} className="text-left">
          <DateInput />
          <TimeInput />
          <SearchSelect
            name="operatore"
            options={searchOptions(data?.operatori, "nome")}
          />
        </Stack>
      </Col>
      <Col xs={6} className="flex border-b-2 border-b-gray-500 pb-6">
        <Stack gap={2} className="text-right justify-center">
          {initialData?.record_parametri && (
            <Hidden
              name={`record_parametri__0__id`}
              value={initialData.record_parametri[0].id}
            />
          )}
          <Hidden value={parametroID} name="record_parametri__0__parametro" />
          <Checkbox
            label="Aggiunta eseguita:"
            labelCols={6}
            labelProps={{ className: "pr-6" }}
            inputProps={{ defaultChecked: true }}
          />
          <Input
            label="pH:"
            name="record_parametri__0__valore"
            labelCols={6}
            labelProps={{ className: "pr-6" }}
            inputProps={{
              step: "0.01",
              type: "number",
              className: "text-center w-2/3 m-auto",
            }}
          />
        </Stack>
      </Col>
      <Hidden value={operazione?.id} name="operazione" />
      <Hidden value={true} name="contro_analisi" />
    </Row>
  );
}

export default FissaggioForm;
