import React, { useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import Fieldset from "../../../components/form-components/Fieldset";
import Input from "../../../components/form-components/Input";
import InputMisura from "../../../components/form-components/InputMisura";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { convertPeso, convertSuperficie, searchOptions } from "../../../utils";
import TabellaNestedItems from "../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import { useFormContext } from "../../../contexts/FormContext";
import { useMemo } from "react";
import Hidden from "../../../components/form-components/Hidden/Hidden";

function ArticoloForm({ data, campoScheda }) {
  const { initialData } = useFormContext();
  const [clienteSelect, setClienteSelect] = useState(
    data?.clienti?.find((c) => c.nome === initialData?.cliente)?.id || undefined
  );
  const cliente = useMemo(() => {
    if (clienteSelect) {
      return data?.clienti.find((c) => c.id === clienteSelect);
    }
  }, [clienteSelect, data?.clienti]);
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
              inputProps={{
                value: { label: cliente?.nome, value: cliente?.id },
                onChange: (e) => setClienteSelect(e.value),
              }}
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
      <Fieldset title="informazioni certificato">
        <Row className="mb-3">
          <Stack gap={1}>
            <Input
              name="specifica_it"
              labelProps={{ className: "text-left" }}
              labelCols={2}
              inputProps={{ className: "text-left pl-3" }}
            />
            <Input
              name="specifica_en"
              labelProps={{ className: "text-left" }}
              labelCols={2}
              inputProps={{ className: "text-left pl-3" }}
            />
          </Stack>
        </Row>
      </Fieldset>
      {clienteSelect && cliente?.campi_aggiuntivi && (
        <Fieldset title={`Dati Aggiuntivi - ${cliente.nome}`}>
          <Hidden name="info_aggiuntive" value={null}/>
          <Row className="mb-3">
            <Stack gap={1}>
              {cliente.campi_aggiuntivi.split(",").map((campo) => (
                <Input
                  key={campo}
                  name={`info_aggiuntive.${campo.trim()}`}
                  label={campo.trim() + ":"}
                  labelProps={{ className: "text-left" }}
                  labelCols={3}
                  inputProps={{
                    defaultValue: initialData?.info_aggiuntive?.[campo.trim()],
                    className: "text-left pl-3 mb-1"
                  }}
                />
              ))}
            </Stack>
          </Row>
        </Fieldset>
      )}
      <Fieldset title="lavorazioni richieste">
        <TabellaNestedItems
          name="richieste"
          sortBy={["lavorazione", "punto"]}
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
