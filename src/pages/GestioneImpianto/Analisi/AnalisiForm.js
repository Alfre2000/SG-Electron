import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { Col, Row, Form, Stack, Table } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Checkbox from "../../../components/form-components/Checkbox";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import TimeInput from "../../../components/form-components/TimeInput/TimeInput";
import { useFormContext } from "../../../contexts/FormContext";
import { findElementFromID, searchOptions } from "../../../utils";
import { URLS } from "../../../urls";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";

function AnalisiForm() {
  const operatoriQuery = useImpiantoQuery({ queryKey: URLS.OPERATORI });
  const operazioniQuery = useImpiantoQuery({ queryKey: URLS.ANALISI });

  const [searchParams] = useSearchParams();
  const { initialData } = useFormContext();

  const [analisiID, setAnalisiID] = useState(
    initialData?.operazione || searchParams.get("analisi") || ""
  );
  const analisi = useMemo(
    () => findElementFromID(analisiID, operazioniQuery.data),
    [analisiID, operazioniQuery.data]
  );
  const [errValore, setErrValore] = useState({});

  const handleValoreChange = useCallback(
    (e) => {
      if (!analisi) return;
      const parametro = analisi.parametri[e.target.name.split("__").at(1)];
      const value = parseFloat(e.target.value);
      let errMsg = "";
      if (value > parametro.massimo) errMsg = "Valore oltre il massimo !";
      else if (value < parametro.minimo) errMsg = "Valore sotto il minimo !";
      setErrValore((oldErr) => ({ ...oldErr, [e.target.name]: errMsg }));
    },
    [analisi]
  );

  useEffect(() => {
    if (initialData?.record_parametri) {
      initialData.record_parametri.forEach((record, idx) => {
        const evento = {
          target: {
            name: `record_parametri__${idx}__valore`,
            value: record.valore,
          },
        };
        handleValoreChange(evento);
      });
    }
  }, [initialData, handleValoreChange]);
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
              options={searchOptions(operatoriQuery.data, "nome")}
            />
            <SearchSelect
              label="Analisi:"
              name="operazione"
              inputProps={{
                isDisabled: !!initialData,
                value: { value: analisi?.id, label: analisi?.nome },
                onChange: (newValue) => setAnalisiID(newValue.value),
              }}
              options={searchOptions(operazioniQuery.data, "nome")}
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
              {operazioniQuery.data &&
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
                            )?.id
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
                          role: "input",
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
                <Form.Label htmlFor="note">Note:</Form.Label>
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
