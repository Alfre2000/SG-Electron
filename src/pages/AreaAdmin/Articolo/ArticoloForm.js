import React from 'react'
import { Col, Row, Stack } from "react-bootstrap";
import Fieldset from '../../../components/form-components/Fieldset';
import Input from '../../../components/form-components/Input';
import InputMisura from '../../../components/form-components/InputMisura';
import SearchSelect from '../../../components/form-components/SearchSelect';
import { convertPeso, convertSuperficie, searchOptions } from '../../../utils';
import TabellaNestedItems from '../../../components/form-components/TabellaNestedItems/TabellaNestedItems';

function ArticoloForm({ data, initialData, errors, view, campoScheda }) {
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
        <TabellaNestedItems 
          name="richieste"
          initialData={initialData}
          errors={errors}
          view={view}
          colonne={[
            { name: "lavorazione", type: "select", options: searchOptions(data?.lavorazioni, "nome") },
            { name: "spessore_minimo", type: "number", label: "Spessore minimo (µm)" },
            { name: "spessore_massimo", type: "number", label: "Spessore massimo (µm)" },
          ]}
        />
      </Fieldset>
    </>
  )
}

export default ArticoloForm