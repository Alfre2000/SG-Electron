import { faCirclePlus, faMinusCircle, faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row, Form, Stack, Table, Button } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import ArticoliInput from "./ArticoliInput";

function SchedaControlloForm({ data, initialData, errors }) {
  const getSezioneVuota = (n) => {
    const nextLetter = String.fromCharCode(65 + n)
    return { nome: `${nextLetter}. `, controlli: [
      { nome: "", frequenza: "", responsabilità: ""}, { nome: "", frequenza: "", responsabilità: ""}
    ]}
  }
  const [sezioni, setSezioni] = useState([getSezioneVuota(0), getSezioneVuota(1)])
  return (
    <>
      <Row className="mb-4 mt-2">
        <Input
          label="Nome Scheda di Controllo:"
          labelProps={{ className: "text-left" }}
          name="nome"
          errors={errors}
          inputProps={{ className: "text-left px-3", required: true }}
        />
      </Row>
      <fieldset className="border-[groove] border-2 px-8 py-1 m-0 rounded-md border-blue-100" style={{ borderStyle: "groove" }}>
        <legend className="mb-2 px-3 text-left uppercase font-semibold text-nav-blue text-lg float-none w-fit">Articoli collegati alla scheda di controllo</legend>
        <ArticoliInput data={data} />
      </fieldset>
      <fieldset className="mt-8 border-[groove] border-2 px-8 py-1 mx-0 rounded-md border-blue-100" style={{ borderStyle: "groove" }}>
        <legend className="mb-2 px-3 text-left uppercase font-semibold text-nav-blue text-lg float-none w-fit">Immagini di supporto</legend>
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
      </fieldset>
      <fieldset className="my-8 border-[groove] border-2 px-8 py-1 mx-0 rounded-md border-blue-100" style={{ borderStyle: "groove" }}>
        <legend className="mb-4 px-3 text-left uppercase font-semibold text-nav-blue text-lg float-none w-fit">Controlli da effettuare</legend>
        {sezioni.map((sezione, idxSezione) => (
          <div key={idxSezione} className="mb-8">
            <div className="py-2 text-sm border-t-0 border-r-0 border-l-0 font-semibold  text-white bg-nav-blue rounded-t-md px-4">
              <Row>
                <Col xs={11}>
                  <Input 
                    label="Nome sezione:"
                    labelCols={3}
                    labelProps={{ className: "text-left" }}
                    errors={errors}
                    name="sezione-"
                    inputProps={{ 
                      className: "text-left px-3",
                      value: sezione.nome,
                      onChange: (event) => {
                        let newSezioni = [...sezioni]
                        let changedSezione = {...sezioni[idxSezione]}
                        changedSezione.nome = event.target.value
                        newSezioni[idxSezione] = changedSezione
                        setSezioni(newSezioni)
                      }
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
            <Table bordered className="align-middle text-sm">
              <thead>
                <tr className="uppercase">
                  <th className="w-[45%]">nome</th>
                  <th className="w-[25%]">frequenza</th>
                  <th className="w-[25%]">responsabilità</th>
                  <th className="w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {sezione.controlli.map((controllo, idxControllo) => (
                  <tr key={idxControllo}>
                    <td>
                      <Form.Control
                        size="sm"
                        as="textarea"
                        rows={1}
                        name="nome-"
                        value={controllo.nome}
                        onChange= {(event) => {
                          let newSezioni = [...sezioni]
                          let changedSezione = {...sezioni[idxSezione]}
                          changedSezione.controlli[idxControllo].nome = event.target.value
                          newSezioni[idxSezione] = changedSezione
                          setSezioni(newSezioni)
                        }} />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        name="frequenza"
                        value={controllo.frequenza}
                        onChange= {(event) => {
                          let newSezioni = [...sezioni]
                          let changedSezione = {...sezioni[idxSezione]}
                          changedSezione.controlli[idxControllo].frequenza = event.target.value
                          newSezioni[idxSezione] = changedSezione
                          setSezioni(newSezioni)
                        }} />
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        name="responsabilità"
                        value={controllo.responsabilità}
                        onChange= {(event) => {
                          let newSezioni = [...sezioni]
                          let changedSezione = {...sezioni[idxSezione]}
                          changedSezione.controlli[idxControllo].responsabilità = event.target.value
                          newSezioni[idxSezione] = changedSezione
                          setSezioni(newSezioni)
                        }} />
                    </td>
                    <td>
                      <FontAwesomeIcon
                        icon={faMinusCircle}
                        size="lg"
                        className="cursor-pointer text-nav-blue hover:text-blue-800"
                        onClick={() => {
                          let newSezioni = [...sezioni]
                          let changedSezione = {...sezioni[idxSezione]}
                          changedSezione.controlli.splice(idxControllo, 1)
                          newSezioni[idxSezione] = changedSezione
                          setSezioni(newSezioni)
                        }}/>
                    </td>
                  </tr>
                ))}
                <tr className="">
                  <td colSpan={4} className="">
                    <FontAwesomeIcon 
                      icon={faCirclePlus}
                      size="lg"
                      className="cursor-pointer text-nav-blue hover:text-blue-800" 
                      onClick={() => {
                        let newSezioni = [...sezioni]
                        let changedSezione = {...sezioni[idxSezione]}
                        changedSezione.controlli.push({ nome: "", frequenza: "", responsabilità: ""})
                        newSezioni[idxSezione] = changedSezione
                        setSezioni(newSezioni)
                      }}/>
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
      </fieldset>
    </>
  );
}

export default SchedaControlloForm;
