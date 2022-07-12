import React, { useState } from "react";
import { Col, Row, Form, Table, Alert } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, dateToTimePicker, searchOptions, toTableArray } from "../../../utils";
import SearchSelect from "../../../components/form-components/SearchSelect";
import Checkbox from "../../../components/form-components/Checkbox";
import Fieldset from "../../../components/form-components/Fieldset";
import MinusIcon from "../../../components/Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../../components/Icons/PlusIcon/PlusIcon";
import { modifyNestedObject } from "../../utils";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
const electron = window?.require ? window.require("electron") : null;

function RecordSchedaImpiantoForm({ data, initialData, warning }) {
  const schedaImpianto = Array.isArray(data.schede_impianto) ? data.schede_impianto[0] : data.schede_impianto
  const groupedVerifiche = toTableArray(schedaImpianto.verifiche_iniziali)
  const groupedAggiunte = toTableArray(schedaImpianto.aggiunte.filter(el => el.iniziale === true))
  const aggiunteSuccessive = schedaImpianto.aggiunte.filter(agg => agg.iniziale === false)
  const emptyAggiunta = { data: dateToDatePicker(new Date()), ora: dateToTimePicker(new Date()), aggiunta: "" }
  const defaultAggiunte = initialData?.record_aggiunte ? initialData.record_aggiunte.filter(agg => !agg.iniziale).map(record => (
      {...record, ora: dateToTimePicker(new Date(record.data)), data: dateToDatePicker(new Date(record.data)), aggiunta: { value: record.aggiunta, label: schedaImpianto.aggiunte.find(a => a.id === record.aggiunta).materiale}}
    )) : []
  const [aggiunte, setAggiunte] = useState(defaultAggiunte)
  return (
    <>
      <Row className="mb-4 mt-4">
        <Hidden name="scheda_impianto" value={schedaImpianto.id} />
        <Col xs={4}>
          <DateInput />
        </Col>
        <Col xs={3}>
          <TimeInput />
        </Col>
        <Col xs={5}>
          <SearchSelect
            name="operatore" 
            options={searchOptions(data?.operatori, "nome")}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Fieldset title="Verifiche Iniziali">
          <Table className="align-middle text-center" bordered>
            <tbody>
              {groupedVerifiche.map((row, idx) => (
                <tr key={row[0].id}>
                  <td className="w-[42%]">{row[0].nome}</td>
                  <td>
                    <Hidden
                      value={row[0].id}
                      name={`record_verifiche_iniziali__${idx * 2}__verifica_iniziale`}
                    />
                    <Checkbox
                      name={`record_verifiche_iniziali__${idx * 2}__eseguito`}
                      label={false}
                      inputProps={{
                        defaultChecked: initialData?.record_verifiche_iniziali ? initialData.record_verifiche_iniziali[idx * 2].eseguito : false,
                        className: "bigger-checkbox"
                      }}
                      vertical={true}
                    />
                  </td>
                  {row[1] && (
                    <>
                      <td className="w-[42%]">{row[1].nome}</td>
                      <td>
                        <Hidden
                          value={row[1].id}
                          name={`record_verifiche_iniziali__${idx * 2 + 1}__verifica_iniziale`}
                        />
                        <Checkbox 
                          name={`record_verifiche_iniziali__${idx * 2 + 1}__eseguito`}
                          label={false}
                          inputProps={{
                            defaultChecked: initialData?.record_verifiche_iniziali ? initialData.record_verifiche_iniziali[idx * 2 + 1].eseguito : false,
                            className: "bigger-checkbox"
                          }}
                          vertical={true}
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Fieldset>
        {warning && (
          <Alert variant="warning" className="py-2 w-[60%] m-auto font-semibold">
            <FontAwesomeIcon icon={faTriangleExclamation} size="lg" className="mr-4" />
            Non sono state completate tutte le verifiche iniziali
          </Alert>
        )}
      </Row>
      <Row className="mb-4">
        <Fieldset title="Aggiunte Iniziali">
          <Table className="align-middle text-center" bordered>
            <tbody>
              {groupedAggiunte.map((row, idx) => (
                <tr key={row[0].id}>
                  <td className="w-[42%] uppercase">{row[0].materiale}</td>
                  <td>
                    <Hidden
                      value={row[0].id}
                      name={`record_aggiunte__${idx * 2}__aggiunta`}
                    />
                    <Hidden
                      value={true}
                      name={`record_aggiunte__${idx * 2}__iniziale`}
                    />
                    <Checkbox
                      name={`record_aggiunte__${idx * 2}__eseguito`}
                      label={false}
                      inputProps={{
                        defaultChecked: initialData?.record_aggiunte ? initialData.record_aggiunte[idx * 2].eseguito : false,
                        className: "bigger-checkbox"
                      }}
                      vertical={true}
                    />
                  </td>
                  {row[1] && (
                    <>
                      <td className="w-[42%] uppercase">{row[1].materiale}</td>
                      <td>
                        <Hidden
                          value={row[1].id}
                          name={`record_aggiunte__${idx * 2 + 1}__aggiunta`}
                        />
                        <Hidden
                          value={true}
                          name={`record_aggiunte__${idx * 2 + 1}__iniziale`}
                        />
                        <Checkbox 
                          name={`record_aggiunte__${idx * 2 + 1}__eseguito`}
                          label={false}
                          inputProps={{
                            defaultChecked: initialData?.record_aggiunte ? initialData.record_aggiunte[idx * 2 + 1].eseguito : false,
                            className: "bigger-checkbox"
                          }}
                          vertical={true}
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Fieldset>
      </Row>
      <Fieldset title="Aggiunte successive" className="mb-4">
        <Table className="align-middle text-center" bordered>
          <thead>
            <tr>
              <th className="w-1/5">Data</th>
              <th className="w-1/5">Ora</th>
              <th className="w-1/2">Aggiunta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {aggiunte.map((aggiunta, idx) => {
              const index = idx + groupedAggiunte.length * 2
              return (
                <tr key={idx}>
                  <td>
                    {initialData && (
                      <Hidden name={`record_aggiunte__${index}__id`} value={aggiunta.id || undefined}/>
                    )}
                    <Hidden
                      name={`record_aggiunte__${index}__data`}
                      value={new Date(aggiunta.data + " " + aggiunta.ora).toISOString()}
                    />
                    <Hidden
                      name={`record_aggiunte__${index}__eseguito`}
                      value={true}
                    />
                    <Input
                      label={false}
                      inputProps={{
                        type: "date",
                        value: aggiunta.data,
                        onChange: (e) => setAggiunte(
                          modifyNestedObject(aggiunte, `${idx}__data`, e.target.value)
                        )
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      className="text-center"
                      type="time"
                      value={aggiunta.ora}
                      onChange={(e) => setAggiunte(
                        modifyNestedObject(aggiunte, `${idx}__ora`, e.target.value)
                      )}
                    />
                  </td>
                  <td>
                    <SearchSelect 
                      name={`record_aggiunte__${index}__aggiunta`}
                      label={false}
                      options={aggiunteSuccessive.map(agg => ({ value: agg.id, label: agg.materiale }))}
                      inputProps={{
                        onChange: (e) => setAggiunte(
                          modifyNestedObject(aggiunte, `${idx}__aggiunta`, e)
                        ),
                        value: aggiunta.aggiunta,
                      }}
                    />
                  </td>
                  <td>
                    <MinusIcon 
                      onClick={() => setAggiunte(aggiunte.filter((_, i) => i !== idx))}
                    />
                  </td>
                </tr>
            )})}
            <tr>
              <td colSpan={4}>
                <PlusIcon
                  onClick={() => setAggiunte([...aggiunte, emptyAggiunta])}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Fieldset>
      <Row className="mb-4 text-left">
        <Form.Group>
          <Form.Label className="mt-2">Operazioni straordinarie:</Form.Label>
          <Input
            label={false}
            inputProps={{ as: "textarea", rows: 3, className: "text-left" }}
            name="malfunzionamenti"
          />
        </Form.Group>
      </Row>
      <Row className="mb-4 text-left">
        <Form.Group>
          <Form.Label className="mt-2">Eventuali malfunzionamenti - fermi linea - non conformità prodotti:</Form.Label>
          <Input
            label={false}
            inputProps={{ as: "textarea", rows: 3, className: "text-left" }}
            name="operazioni_straordinarie"
          />
        </Form.Group>
      </Row>
      <Row className="mb-4 text-left">
        <p className="uppercase font-semibold text-nav-blue text-lg">Documenti di supporto</p>
        <hr className="h-4 w-28 ml-3 pt-px pb-0.5 bg-nav-blue opacity-90"/>
        <ul className="ml-4 mt-2.5">
          {schedaImpianto?.documenti_supporto?.map(documento => (
            <li key={documento.id} className="list-disc italic cursor-pointer hover:underline hover:underline-offset-1" onClick={() => electron.ipcRenderer.invoke("open-file", documento.documento)}>{documento.titolo} <FontAwesomeIcon icon={faFilePdf} className="ml-1 text-nav-blue"/></li>
          ))}
        </ul>
      </Row>
    </>
  )
}

export default RecordSchedaImpiantoForm