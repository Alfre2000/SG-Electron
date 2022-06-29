import React, { useState } from "react";
import { Col, Row, Form, Table } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, dateToTimePicker, toTableArray } from "../../../utils";
import SearchSelect from "../../../components/form-components/SearchSelect";
import Checkbox from "../../../components/form-components/Checkbox";
import Fieldset from "../../../components/form-components/Fieldset";
import MinusIcon from "../../../components/Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../../components/Icons/PlusIcon/PlusIcon";
import { modifyNestedObject } from "../../utils";

function RecordSchedaImpiantoForm({ data, initialData, errors, view }) {
  console.log(data);
  const schedaImpianto = Array.isArray(data.schede_impianto) ? data.schede_impianto[0] : data.schede_impianto
  const groupedVerifiche = toTableArray(schedaImpianto.verifiche_iniziali)
  const groupedAggiunte = toTableArray(schedaImpianto.aggiunte.filter(el => el.iniziale === true))
  const aggiunteSuccessive = schedaImpianto.aggiunte.filter(agg => agg.iniziale === false)
  const emptyAggiunta = { data: dateToDatePicker(new Date()), ora: dateToTimePicker(new Date()), aggiunta: "" }
  const defaultAggiunte = initialData?.record_aggiunte ? initialData.record_aggiunte.filter(agg => !agg.iniziale).map(record => (
      {...record, ora: dateToTimePicker(new Date(record.data)), data: dateToDatePicker(new Date(record.data)), aggiunta: { value: record.aggiunta, label: schedaImpianto.aggiunte.find(a => a.id === record.aggiunta).materiale}}
    )) : [emptyAggiunta]
  const [aggiunte, setAggiunte] = useState(defaultAggiunte)
  return (
    <>
      <Row className="mb-4 mt-4">
        <input hidden className="hidden" name="scheda_impianto" defaultValue={schedaImpianto.id} />
        <Col xs={4}>
          <Input
            name="data"
            errors={errors}
            inputProps={{
              type: "date",
              defaultValue: dateToDatePicker(
                initialData?.data ? new Date(initialData.data) : new Date()
              ),
            }}
          />
        </Col>
        <Col xs={3}>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Ora:
            </Form.Label>
            <Col sm="8">
              <TimeInput initialData={initialData} />
            </Col>
          </Form.Group>
        </Col>
        <Col xs={5}>
          <SearchSelect
            name="operatore" 
            initialData={initialData}
            errors={errors}
            inputProps={{ required: true, isDisabled: view }}
            colProps={{ className: "text-center" }}
            options={data?.operatori?.map(o => ({ value: o.id, label: o.nome }))}
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
                    <input
                      hidden
                      className="hidden"
                      defaultValue={row[0].id}
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
                        <input
                          hidden
                          className="hidden"
                          defaultValue={row[1].id}
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
      </Row>
      <Row className="mb-4">
        <Fieldset title="Aggiunte Iniziali">
          <Table className="align-middle text-center" bordered>
            <tbody>
              {groupedAggiunte.map((row, idx) => (
                <tr key={row[0].id}>
                  <td className="w-[42%]">{row[0].materiale}</td>
                  <td>
                    <input
                      hidden
                      className="hidden"
                      defaultValue={row[0].id}
                      name={`record_aggiunte__${idx * 2}__aggiunta`}
                    />
                    <input
                      hidden
                      className="hidden"
                      defaultValue={true}
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
                      <td className="w-[42%]">{row[1].materiale}</td>
                      <td>
                        <input
                          hidden
                          className="hidden"
                          defaultValue={row[1].id}
                          name={`record_aggiunte__${idx * 2 + 1}__aggiunta`}
                        />
                        <input
                          hidden
                          className="hidden"
                          defaultValue={true}
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
                      <input hidden name={`record_aggiunte__${index}__id`} className="hidden" defaultValue={aggiunta.id || undefined}/>
                    )}
                    <input
                      hidden
                      name={`record_aggiunte__${index}__data`}
                      className="hidden"
                      defaultValue={new Date(aggiunta.data + " " + aggiunta.ora).toISOString()}
                    />
                    <input
                      hidden
                      name={`record_aggiunte__${index}__eseguito`}
                      className="hidden"
                      defaultValue={true}
                    />
                    <Input
                      label={false}
                      errors={errors}
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
                      errors={errors}
                      isDisabled={view}
                      initialData={initialData}
                      inputProps={{
                        required: true,
                        onChange: (e) => setAggiunte(
                          modifyNestedObject(aggiunte, `${idx}__aggiunta`, e)
                        ),
                        value: aggiunta.aggiunta,
                        isDisabled: view
                      }}
                    />
                  </td>
                  <td>
                    <MinusIcon 
                      disabled={view}
                      onClick={() => setAggiunte(aggiunte.filter((_, i) => i !== idx))}
                    />
                  </td>
                </tr>
            )})}
            <tr>
              <td colSpan={4}>
                <PlusIcon
                  disabled={view}
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
          <Form.Control as="textarea" rows={3} name="malfunzionamenti" />
        </Form.Group>
      </Row>
      <Row className="mb-4 text-left">
        <Form.Group>
          <Form.Label className="mt-2">Eventuali malfunzionamenti - fermi linea - non conformità prodotti:</Form.Label>
          <Form.Control as="textarea" rows={3} name="operazioni_straordinarie" />
        </Form.Group>
      </Row>
    </>
  )
}

export default RecordSchedaImpiantoForm