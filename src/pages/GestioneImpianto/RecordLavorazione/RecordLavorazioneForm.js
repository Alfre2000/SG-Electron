import React, { useState } from "react";
import { Col, Row, Form, Stack } from "react-bootstrap";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/form-components/TimeInput/TimeInput";
import { findElementFromID, searchOptions } from "../../../utils";
import Fieldset from "../../../components/form-components/Fieldset";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { useUserContext } from "../../../UserContext";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import SezioneInformazioniArticolo from "./Sezioni/SezioneInformazioniArticolo";
import SezioneSpessori from "./Sezioni/SezioneSpessori";
import SezioneDocumenti from "./Sezioni/SezioneDocumenti";
import SezioneControlli from "./Sezioni/SezioneControlli";
import SezioneAnomalie from "./Sezioni/SezioneAnomalie";
import { useFormContext } from "../../../contexts/FormContext";
import SezioneAllegati from "./Sezioni/SezioneAllegati";

function RecordLavorazioneForm({ data }) {
  const { initialData, view } = useFormContext();
  const { user } = useUserContext();
  const initialCliente =
    data.articoli && initialData?.articolo
      ? findElementFromID(initialData?.articolo, data.articoli).cliente.nome
      : "";
  const [cliente, setCliente] = useState(
    initialCliente ? { value: initialCliente, label: initialCliente } : null
  );
  const [articoloID, setArticoloID] = useState(initialData?.articolo || "");
  const [lavorazione, setLavorazione] = useState(
    initialData?.lavorazione || null
  );
  const articolo = findElementFromID(articoloID, data.articoli);
  const clienti = data.articoli
    ? new Set(data.articoli.map((articolo) => articolo.cliente.nome))
    : new Set([]);
  let lavorazioni = user?.user?.impianto?.lavorazioni;
  if (lavorazioni && articolo) {
    let lavorazioniRichieste = articolo.richieste.map(
      (ric) => ric.lavorazione.id
    );
    lavorazioni = lavorazioni.filter((lav) =>
      lavorazioniRichieste.includes(lav.id)
    );
  }
  if (lavorazioni.length === 1 && lavorazioni[0]?.id !== lavorazione?.value) {
    setLavorazione({ value: lavorazioni[0].id, label: lavorazioni[0].nome });
  }
  return (
    <>
      <Row className="mb-4">
        <Hidden name="impianto" value={user.user.impianto.id} />
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
            <DateInput />
            <TimeInput />
            <SearchSelect
              name="operatore"
              options={searchOptions(data?.operatori, "nome")}
            />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10 flex">
          <Stack gap={2} className="text-left justify-center">
            <SearchSelect
              name="cliente"
              inputProps={{
                value: cliente,
                onChange: (e) =>
                  setCliente(e) || setArticoloID(null) || setLavorazione(null),
              }}
              options={
                clienti &&
                [...clienti].map((cliente) => ({
                  value: cliente,
                  label: cliente,
                }))
              }
            />
            <SearchSelect
              name="articolo"
              inputProps={{
                isDisabled: !cliente || view,
                value: articolo
                  ? {
                      value: articolo.id,
                      label: `${articolo.nome} (${articolo.codice || "-"})`,
                    }
                  : null,
                onChange: (e) =>
                  setArticoloID(e?.value ? e.value : null) ||
                  setLavorazione(null),
              }}
              options={data?.articoli
                ?.filter((arti) => arti.cliente.nome === cliente?.value)
                .map((a) => ({
                  value: a.id,
                  label: `${a.nome} (${a.codice || "-"})`,
                }))}
            />
            <SearchSelect
              name="lavorazione"
              options={searchOptions(lavorazioni, "nome")}
              inputProps={{
                isDisabled: !articolo || view,
                value: lavorazione,
                onChange: (e) => setLavorazione(e),
              }}
            />
          </Stack>
        </Col>
      </Row>
      <Fieldset title="Informazioni Lotto">
        <Row>
          <Col xs={6} className="pr-8">
            <Input
              label="N° lotto cliente:"
              name="n_lotto_cliente"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
            />
          </Col>
          <Col xs={6} className="pl-0">
            <Input
              label="N° lotto supergalvanica:"
              name="n_lotto_super"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
            />
          </Col>
        </Row>
        <Row className="my-3">
          <Col xs={6} className="pr-8">
            <Input
              label="N° pezzi dichiarati:"
              name="n_pezzi_dichiarati"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
              inputProps={{
                type: "number",
              }}
            />
          </Col>
          <Col xs={6} className="pl-0">
            <Input
              label="N° pezzi scartati:"
              name="n_pezzi_scartati"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
              inputProps={{
                defaultValue: initialData?.n_pezzi_scartati || 0,
                type: "number",
              }}
            />
          </Col>
        </Row>
      </Fieldset>
      {articolo && (
        <>
          <SezioneInformazioniArticolo articolo={articolo} />
          <SezioneSpessori articolo={articolo} />
          <SezioneDocumenti articolo={articolo} />
          <SezioneControlli data={data} articolo={articolo} />
          <SezioneAnomalie articolo={articolo} />
          <SezioneAllegati articolo={articolo} />
        </>
      )}
      
      <Form.Group className="mt-8">
        <Row className="mb-4">
          <Col xs={1} className="flex items-center">
            <Form.Label className="mt-2">Note:</Form.Label>
          </Col>
          <Col sm={8}>
            <Input
              label={false}
              inputProps={{ as: "textarea", rows: 3, className: "text-left" }}
              name="note"
            />
          </Col>
          <Col xs={3} className="flex">
            <Checkbox
              vertical={true}
              name="completata"
              inputProps={{
                defaultChecked: initialData ? initialData.completata : false,
                className: "bigger-checkbox",
              }}
            />
          </Col>
        </Row>
      </Form.Group>
    </>
  );
}

export default RecordLavorazioneForm;
