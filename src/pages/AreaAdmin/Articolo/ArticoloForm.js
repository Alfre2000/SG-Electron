import { faCirclePlus, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Col, Row, Stack, Table } from "react-bootstrap";
import Fieldset from '../../../components/form-components/Fieldset';
import Input from '../../../components/form-components/Input';
import SearchSelect from '../../../components/form-components/SearchSelect';
import { findElementFromID } from '../../../utils';

function ArticoloForm({ data, initialData, errors, view }) {
  const emptyRichiesta = [{ lavorazione: null, spessore_minimo: "", spessore_massimo: ""}]
  const defaultRichieste = initialData && Object.keys(initialData).length > 0 ? initialData.richieste.map(richiesta => (
    {...richiesta, lavorazione: {
       value: richiesta.lavorazione,
       label: findElementFromID(richiesta.lavorazione, data.lavorazioni).nome
      }
    })) : emptyRichiesta
  const [richieste, setRichieste] = useState(defaultRichieste)
  console.log(richieste);
  return (
    <>
      <Row className="mb-4">
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
            <Input 
              name="nome"
              inputProps={{ required: true }}
              errors={errors}
            />
            <Input 
              name="codice"
              inputProps={{ required: true }}
              errors={errors}
            />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10">
          <Stack gap={2} className="text-left">
            <SearchSelect
              name="cliente" 
              labelCols={5}
              initialData={initialData}
              createTable={true}
              errors={errors}
              inputProps={{ 
                required: true,
                isDisabled: view
              }}
              options={data?.clienti?.map(cliente => ({ value: cliente.id, label: cliente.nome }))}
            />
            <SearchSelect 
              name="scheda_controllo"
              labelCols={5}
              isDisabled={view}
              errors={errors}
              options={data?.schede_controllo?.map(scheda => ({ value: scheda.id, label: scheda.nome }))}
              initialData={initialData}
              inputProps={{ isDisabled: view }}
            />
          </Stack>
        </Col>
      </Row>
      <Fieldset title="caratteristiche fisiche">
        <Row className="mb-3">
          <Col>
            <Input 
              name="peso"
              label="Peso (kg):"
              labelCols={5}
              inputProps={{ type: "number" }}
              errors={errors}
            />
          </Col>
          <Col>
            <Input 
              name="superficie"
              label="Superficie (dm²):"
              labelCols={5}
              inputProps={{ type: "number" }}
              errors={errors}
            />
          </Col>
        </Row>
      </Fieldset>
      <Fieldset title="lavorazioni richieste">
        <Table bordered className="text-center align-middle">
          <thead>
            <tr>
              <th className="w-[39%]">Lavorazione</th>
              <th className="w-[28%]">Spessore minimo (µm)</th>
              <th className="w-[28%]">Spessore massimo (µm)</th>
              <th className="w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {richieste.map((richiesta, idx) => (
              <tr key={idx}>
                <td>
                  {initialData && (
                    <input hidden name={`richieste__${idx}__id`} className="hidden" defaultValue={richiesta.id || undefined}/>
                  )}
                  <SearchSelect 
                    name={`richieste__${idx}__lavorazione`}
                    label={false}
                    options={data?.lavorazioni?.map(lavorazione => ({ value: parseInt(lavorazione.id), label: lavorazione.nome }))}
                    errors={errors}
                    isDisabled={view}
                    initialData={initialData}
                    inputProps={{
                      onChange: (newValue) => {
                        newValue.value = parseInt(newValue.value)
                        let newRichieste = [...richieste]
                        newRichieste[idx].lavorazione = newValue
                        setRichieste(newRichieste)
                      }, 
                      value: richiesta.lavorazione,
                      isDisabled: view
                    }}
                  />
                </td>
                <td>
                  <Input 
                    name={`richieste__${idx}__spessore_minimo`}
                    label={false}
                    errors={errors}
                    inputProps={{
                      type: "number",
                      onChange: (event) => {
                        let newRichieste = [...richieste]
                        newRichieste[idx].spessore_minimo = event.target.value
                        setRichieste(newRichieste)
                      }, 
                      value: richiesta.spessore_minimo
                    }}
                  />
                </td>
                <td>
                  <Input 
                    name={`richieste__${idx}__spessore_massimo`}
                    label={false}
                    errors={errors}
                    inputProps={{
                      type: "number",
                      onChange: (event) => {
                        let newRichieste = [...richieste]
                        newRichieste[idx].spessore_massimo = event.target.value
                        setRichieste(newRichieste)
                      }, 
                      value: richiesta.spessore_massimo
                    }}
                  />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faMinusCircle}
                    size="lg"
                    className={`${view ? "cursor-not-allowed" : "cursor-pointer"} text-nav-blue hover:text-blue-800`}
                    onClick={() => !view && setRichieste(richieste.filter((r, i) => i !== idx))}/>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  size="lg"
                  className={`${view ? "cursor-not-allowed" : "cursor-pointer"} text-nav-blue hover:text-blue-800`}
                  onClick={() => !view && setRichieste([...richieste, { lavorazione: null, minimo: "", massimo: "" }])}/>
              </td>
            </tr>
          </tbody>
        </Table>
      </Fieldset>
    </>
  )
}

export default ArticoloForm