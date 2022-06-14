import { faCirclePlus, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Col, Row, Stack, Table } from "react-bootstrap";
import Select from 'react-select';
import Fieldset from '../../../components/form-components/Fieldset';
import Input from '../../../components/form-components/Input';
import SearchSelect from '../../../components/form-components/SearchSelect';
import { customStyle } from '../../../components/form-components/stylesSelect';
import { convertPeso, findElementFromID, convertSuperficie } from '../../../utils';

function ArticoloForm({ data, initialData, errors, view, campoScheda }) {
  const [peso, setPeso] = useState(!!initialData ? initialData.peso : "")
  const [uPeso, setUPeso] = useState({ value: "kg", label: "Kg" })
  const [superficie, setSuperficie] = useState(!!initialData ? initialData.superficie : "")
  const [uSuperficie, setUSuperficie] = useState({ value: "dm", label: "dm²" })
  const emptyRichiesta = [{ lavorazione: null, spessore_minimo: "", spessore_massimo: ""}]
  const defaultRichieste = initialData && Object.keys(initialData).length > 0 ? initialData.richieste.map(richiesta => (
    {...richiesta, lavorazione: {
       value: richiesta.lavorazione,
       label: findElementFromID(richiesta.lavorazione, data.lavorazioni).nome
      }
    })) : emptyRichiesta
  const [richieste, setRichieste] = useState(defaultRichieste)
  const inputStyle = {...customStyle,
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgb(13 110 253 / 25%)" : "none",
      minHeight: "31px",
      height: "31px",
      borderRadius: "0px 4px 4px 0px",
      borderLeft: "none",
      minWidth: "75px",
    }),
  }
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
        <Col xs={6} className="pl-10 flex m-auto">
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
            {campoScheda !== false && (
              <SearchSelect 
                name="scheda_controllo"
                labelCols={5}
                isDisabled={view}
                errors={errors}
                options={data?.schede_controllo?.map(scheda => ({ value: scheda.id, label: scheda.nome }))}
                initialData={initialData}
                inputProps={{ isDisabled: view }}
              />
            )}
          </Stack>
        </Col>
      </Row>
      <Fieldset title="caratteristiche fisiche">
        <Row className="mb-3">
          <Col className="flex justify-center">
              <input hidden name="peso" className="hidden" value={convertPeso(uPeso.value, "kg", peso)}/>
              <Input 
                label="Peso:"
                labelCols={5}
                errors={errors}
                inputProps={{
                  type: "number",
                  value: peso,
                  onChange: (e) => setPeso(e.target.value),
                  className: "rounded-r-none text-center"
                }}
              />
              <Select
                placeholder=""
                noOptionsMessage={() => "Nessun risultato"}
                isClearable={false}
                styles={inputStyle}
                options={[{value: "kg", label: "Kg"}, {value: "g", label: "g"}, {value: "mg", label: "mg"}]}
                value={uPeso}
                onChange={(selection) => {
                  const newUnità = selection.value
                  const oldUnità = uPeso.value
                  setPeso(convertPeso(oldUnità, newUnità, peso))
                  setUPeso(selection)
                }}
              />
          </Col>
          <Col className="flex justify-center">
            <input hidden name="superficie" className="hidden" value={convertSuperficie(uSuperficie.value, "dm", superficie)}/>
            <Input 
              label="Superficie:"
              labelCols={5}
              inputProps={{
                type: "number",
                value: superficie,
                onChange: (e) => setSuperficie(e.target.value),
                className: "rounded-r-none text-center"
              }}
              errors={errors}
            />
            <Select
                placeholder=""
                noOptionsMessage={() => "Nessun risultato"}
                isClearable={false}
                styles={inputStyle}
                options={[{value: "m", label: "m²"}, { value: "dm", label: "dm²" }, {value: "cm", label: "cm²"}]}
                value={uSuperficie}
                onChange={(selection) => {
                  const newUnità = selection.value
                  const oldUnità = uSuperficie.value
                  setSuperficie(convertSuperficie(oldUnità, newUnità, superficie))
                  setUSuperficie(selection)
                }}
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