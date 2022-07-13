import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo, useState } from "react";
import { Col, Row, Form, Stack, Table } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Checkbox from "../../../components/form-components/Checkbox";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { useFormContext } from "../../../contexts/FormContext";
import { findElementFromID, searchOptions } from "../../../utils";

function AnalisiForm({ data }) {
  const [searchParams] = useSearchParams();
  const { initialData } = useFormContext();
  const [analisiID, setAnalisiID] = useState(
    initialData?.operazione || searchParams.get("analisi") || ""
  );
  const analisi = useMemo(
    () => findElementFromID(analisiID, data?.operazioni),
    [analisiID, data?.operazioni]
  );
  const [errValore, setErrValore] = useState({});

  const handleValoreChange = (e) => {
    const parametro = analisi.parametri[e.target.name.split("__").at(1)];
    const value = parseFloat(e.target.value);
    let errMsg = "";
    if (value > parametro.massimo) errMsg = "Valore oltre il massimo !";
    else if (value < parametro.minimo) errMsg = "Valore sotto il minimo !";
    setErrValore({ ...errValore, [e.target.name]: errMsg });
  };
  return (
    <>
      <Row className="mb-4">
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
            <DateInput />
            <TimeInput />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10">
          <Stack gap={2} className="text-left">
            <SearchSelect
              name="operatore"
              options={searchOptions(data?.operatori, "nome")}
            />
            <SearchSelect
              label="Analisi:"
              name="operazione"
              inputProps={{
                isDisabled: !!initialData,
                value: { value: analisi?.id, label: analisi?.nome },
                onChange: (newValue) => setAnalisiID(newValue.value),
              }}
              options={searchOptions(data?.operazioni, "nome")}
            />
          </Stack>
        </Col>
      </Row>
      {analisi && (
        <Row className="mb-4">
          <Table>
            <thead>
              <tr className="text-center">
                <th>Parametro</th>
                <th>Valore</th>
                <th>Aggiunte</th>
                <th>Limite minimo</th>
                <th>Limite massimo</th>
              </tr>
            </thead>
            <tbody>
              {data.operazioni &&
                analisi.parametri.map((parametro, idx) => (
                  <tr key={parametro.id} className="align-middle text-center">
                    <td className="text-left">{parametro.nome}</td>
                    <td>
                      {initialData?.record_parametri && (
                        <Hidden
                          name={`record_parametri__${idx}__id`}
                          value={
                            initialData.record_parametri.find(
                              (el) => el.parametro === parametro.id
                            ).id
                          }
                        />
                      )}
                      <Hidden
                        name={`record_parametri__${idx}__parametro`}
                        value={parametro.id}
                      />
                      <Input
                        label={false}
                        inputProps={{
                          type: "number",
                          step: "0.01",
                          className: "w-2/3 m-auto text-center",
                          onBlur: handleValoreChange,
                        }}
                        size="sm"
                        name={`record_parametri__${idx}__valore`}
                      />
                      {errValore[`record_parametri__${idx}__valore`] && (
                        <span
                          type="invalid"
                          className="text-xs font-semibold text-center text-[#d48208]"
                        >
                          <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="mr-1"
                          />
                          {errValore[`record_parametri__${idx}__valore`]}
                        </span>
                      )}
                    </td>
                    <td>
                      <Input
                        label={false}
                        inputProps={{
                          type: "number",
                          step: "0.01",
                          className: "w-2/3 m-auto text-center",
                        }}
                        size="sm"
                        name={`record_parametri__${idx}__aggiunte`}
                      />
                    </td>
                    <td>{parametro.minimo}</td>
                    <td>{parametro.massimo}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Row>
      )}
      <Row className="mb-4">
        <Col xs={9}>
          <Form.Group>
            <Row>
              <Col xs={2} className="flex items-center">
                <Form.Label>Note:</Form.Label>
              </Col>
              <Col sm={10}>
                <Input
                  label={false}
                  inputProps={{
                    as: "textarea",
                    rows: 3,
                    className: "text-left",
                  }}
                  name="note"
                />
              </Col>
            </Row>
          </Form.Group>
        </Col>
        <Col xs={3} className="flex">
          <Checkbox
            label="Controanalisi:"
            name="contro_analisi"
            vertical={true}
          />
        </Col>
      </Row>
    </>
  );
}

export default AnalisiForm;
