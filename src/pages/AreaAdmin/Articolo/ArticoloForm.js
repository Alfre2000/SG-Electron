import React from "react";
import { Col, Row, Stack } from "react-bootstrap";
import Fieldset from "../../../components/form-components/Fieldset";
import Input from "../../../components/form-components/Input";
import InputMisura from "../../../components/form-components/InputMisura";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { convertPeso, convertSuperficie, searchOptions } from "../../../utils";
import TabellaNestedItems from "../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import { useFormContext } from "../../../contexts/FormContext";

function ArticoloForm({ data, campoScheda }) {
  const { initialData } = useFormContext();
  return (
    <>
      <Row className="mb-4">
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
            <Input name="nome" />
            <Input name="codice" />
            <Input name="descrizione" />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10 flex m-auto">
          <Stack gap={2} className="text-left">
            <SearchSelect
              name="cliente"
              labelCols={5}
              createTable={true}
              options={searchOptions(data?.clienti, "nome")}
            />
            <SearchSelect
              name="impianto"
              labelCols={5}
              options={searchOptions(data?.impianti, "nome")}
            />
            {campoScheda !== false && (
              <SearchSelect
                name="scheda_controllo"
                labelCols={5}
                options={searchOptions(data?.schede_controllo, "nome")}
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
              options={[
                { value: "kg", label: "Kg" },
                { value: "g", label: "g" },
                { value: "mg", label: "mg" },
              ]}
              convFunction={convertPeso}
              initialData={{
                value: initialData?.peso,
                u: { value: "kg", label: "kg" },
              }}
            />
          </Col>
          <Col className="flex justify-center">
            <InputMisura
              name="superficie"
              options={[
                { value: "m", label: "m²" },
                { value: "dm", label: "dm²" },
                { value: "cm", label: "cm²" },
              ]}
              convFunction={convertSuperficie}
              initialData={{
                value: initialData?.superficie,
                u: { value: "dm", label: "dm²" },
              }}
            />
          </Col>
        </Row>
      </Fieldset>
      <Fieldset title="lavorazioni richieste">
        <TabellaNestedItems
          name="richieste"
          colonne={[
            {
              name: "lavorazione",
              type: "select",
              options: searchOptions(data?.lavorazioni, "nome"),
            },
            {
              name: "punto",
              type: "number",
            },
            {
              name: "spessore_minimo",
              type: "number",
              label: "Spessore minimo (µm)",
            },
            {
              name: "spessore_massimo",
              type: "number",
              label: "Spessore massimo (µm)",
            },
          ]}
        />
      </Fieldset>
      <Fieldset title="immagini di supporto">
        <TabellaNestedItems
          name="immagini_supporto"
          colonne={[{ name: "titolo" }, { name: "immagine", type: "file" }]}
        />
      </Fieldset>
      <Fieldset title="documenti di supporto">
        <TabellaNestedItems
          name="documenti_supporto"
          colonne={[{ name: "titolo" }, { name: "documento", type: "file" }]}
        />
      </Fieldset>
    </>
  );
}

export default ArticoloForm;
