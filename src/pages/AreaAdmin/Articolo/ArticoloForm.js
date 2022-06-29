import React, { useState } from 'react'
import { Col, Row, Stack, Table } from "react-bootstrap";
import Fieldset from '../../../components/form-components/Fieldset';
import Input from '../../../components/form-components/Input';
import InputMisura from '../../../components/form-components/InputMisura';
import SearchSelect from '../../../components/form-components/SearchSelect';
import MinusIcon from '../../../components/Icons/MinusIcon/MinusIcon';
import PlusIcon from '../../../components/Icons/PlusIcon/PlusIcon';
import { convertPeso, findElementFromID, convertSuperficie } from '../../../utils';

function ArticoloForm({ data, initialData, errors, view, campoScheda }) {
  const emptyRichiesta = { lavorazione: null, spessore_minimo: "", spessore_massimo: ""}
  const defaultRichieste = initialData && Object.keys(initialData).length > 0 ? initialData.richieste.map(richiesta => (
    {...richiesta, lavorazione: {
       value: richiesta.lavorazione,
       label: findElementFromID(richiesta.lavorazione, data.lavorazioni).nome
      }
    })) : [emptyRichiesta]
  const [richieste, setRichieste] = useState(defaultRichieste)

  const handleModifyRichiesta = (newValue, idxRichiesta, campo) => {
    let newRichieste = [...richieste]
    newRichieste[idxRichiesta][campo] = newValue
    setRichieste(newRichieste)
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
            <InputMisura 
              name="peso"
              options={[{value: "kg", label: "Kg"}, {value: "g", label: "g"}, {value: "mg", label: "mg"}]}
              convFunction={convertPeso}
              initialData={{ value: initialData?.peso, u: { value: "kg", label: "kg" } }}
              errors={errors}
            />
          </Col>
          <Col className="flex justify-center">
            <InputMisura 
              name="superficie"
              options={[{value: "m", label: "m²"}, { value: "dm", label: "dm²" }, {value: "cm", label: "cm²"}]}
              convFunction={convertSuperficie}
              initialData={{ value: initialData?.superficie, u: { value: "dm", label: "dm²" } }}
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
                        handleModifyRichiesta({...newValue, value: parseInt(newValue.value)}, idx, "lavorazione")
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
                      onChange: (event) => handleModifyRichiesta(event.target.value, idx, "spessore_minimo"),
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
                      onChange: (event) => handleModifyRichiesta(event.target.value, idx, "spessore_massimo"),
                      value: richiesta.spessore_massimo
                    }}
                  />
                </td>
                <td>
                  <MinusIcon 
                    disabled={view}
                    onClick={() => setRichieste(richieste.filter((_, i) => i !== idx))}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>
                <PlusIcon
                  disabled={view}
                  onClick={() => setRichieste([...richieste, emptyRichiesta])}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Fieldset>
    </>
  )
}

export default ArticoloForm