import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row, Form, Stack, Table, Button } from "react-bootstrap";
import Fieldset from "../../../components/form-components/Fieldset";
import Input from "../../../components/form-components/Input";
import MinusIcon from "../../../components/Icons/MinusIcon";
import PlusIcon from "../../../components/Icons/PlusIcon";
import ArticoliInput from "./ArticoliInput";
import { addToNestedArray, modifyNestedObject, removeFromNestedArray } from "../../utils";

function SchedaControlloForm({ data, setData, initialData, errors, view }) {
  const emptyControllo = { nome: "", frequenza: "", responsabilità: ""}
  const getSezioneVuota = (n) => {
    const nextLetter = String.fromCharCode(65 + n)
    return { nome: `${nextLetter}. `, controlli: [ emptyControllo ]}
  }
  const [sezioni, setSezioni] = useState(!!initialData ? initialData.sezioni : [getSezioneVuota(0)])
  return (
    <>
      <Row className="mb-4 mt-2">
        <Input
          label="Nome scheda di controllo:"
          labelProps={{ className: "text-left" }}
          name="nome"
          errors={errors}
          inputProps={{ className: "text-left px-3", required: true }}
        />
      </Row>
      <Fieldset title="Articoli collegati alla scheda di controllo">
        <ArticoliInput data={data} setData={setData} initialData={initialData} />
      </Fieldset>
      <Fieldset title="Immagini di supporto">
        <Stack gap={2} className="mb-2">
          <Input
            label="Misurazione spessore del trattamento:"
            labelCols={5}
            labelProps={{ className: "text-left" }}
            name="immagine_misurazione"
            errors={errors}
            inputProps={{ className: "text-left px-3", type: "file" }}
          />
          <Input
            label="Zona aggancio:"
            labelCols={5}
            labelProps={{ className: "text-left" }}
            name="immagine_aggancio"
            errors={errors}
            inputProps={{ className: "text-left px-3", type: "file" }}
          />
        </Stack>
      </Fieldset>
      <Fieldset title="Controlli da effettuare">
        {sezioni.map((sezione, idxSezione) => (
          <div key={idxSezione} className="mb-8">
            <div className="py-2 text-sm border-t-0 border-r-0 border-l-0 font-semibold  text-white bg-nav-blue rounded-t-md px-4">
              <Row>
                <Col xs={11}>
                  {initialData && (
                    <input hidden name={`sezioni__${idxSezione}__id`} className="hidden" defaultValue={sezione.id || undefined}/>
                  )}
                  <Input 
                    label="Nome sezione:"
                    labelCols={3}
                    labelProps={{ className: "text-left" }}
                    errors={errors}
                    name={`sezioni__${idxSezione}__nome`}
                    inputProps={{ 
                      className: "text-left px-3",
                      value: sezione.nome,
                      onChange: (e) => setSezioni(modifyNestedObject(sezioni, `${idxSezione}__nome`, e.target.value))
                    }}
                  />
                </Col>
                <Col xs={1} className="flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faXmarkCircle}
                    size="lg"
                    className="hover:text-slate-200 cursor-pointer"
                    onClick={() => setSezioni(sezioni.filter((s, index) => index !== idxSezione))} />
                </Col>
              </Row>
            </div>
            <Table bordered className="align-middle text-sm text-center">
              <thead>
                <tr className="uppercase">
                  <th className="w-[45%]">nome</th>
                  <th className="w-[25%]">frequenza</th>
                  <th className="w-[25%]">responsabilità</th>
                  <th className="w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {sezione.controlli.map((controllo, idxControllo) => {
                  const richiestePath = `${idxSezione}__controlli__${idxControllo}`
                  const basePath = `sezioni__${richiestePath}`
                  return (
                  <tr key={idxControllo}>
                    <td>
                      {initialData && (
                        <input hidden name={`${basePath}__id`} className="hidden" defaultValue={controllo.id || undefined}/>
                      )}
                      <Form.Control
                        size="sm"
                        as="textarea"
                        rows={initialData ? 2 : 1}
                        name={`${basePath}__nome`}
                        value={controllo.nome}
                        onChange={(e) => setSezioni(modifyNestedObject(sezioni, `${richiestePath}__nome`, e.target.value))}
                        />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        name={`${basePath}__frequenza`}
                        value={controllo.frequenza}
                        onChange={(e) => setSezioni(modifyNestedObject(sezioni, `${richiestePath}__frequenza`, e.target.value))}
                        />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        name={`${basePath}__responsabilità`}
                        value={controllo.responsabilità}
                        onChange={(e) => setSezioni(
                          modifyNestedObject(sezioni, `${richiestePath}__responsabilità`, e.target.value)
                        )}
                        />
                    </td>
                    <td>
                      <MinusIcon 
                        disabled={view}
                        onClick={() => setSezioni(removeFromNestedArray(sezioni, `${idxSezione}__controlli`, idxControllo))}
                      />
                    </td>
                  </tr>
                )})}
                <tr>
                  <td colSpan={4}>
                    <PlusIcon 
                      disabled={view}
                      onClick={() => setSezioni(addToNestedArray(sezioni, `${idxSezione}__controlli`, emptyControllo))}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
        <div className="text-left pl-2 -mt-3 mb-3">
          <Button
            variant="primary"
            className="bg-nav-blue rounded-md border-blue-900 hover:bg-blue-900 focus:bg-blue-900 text-sm font-medium"
            onClick={() => setSezioni([...sezioni, getSezioneVuota(sezioni.length)])}>
            <FontAwesomeIcon icon={faPlus} size="sm" className="pr-2" />
            Sezione
          </Button>
        </div>
      </Fieldset>
    </>
  );
}

export default SchedaControlloForm;
