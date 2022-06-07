import React, { useState } from "react";
import { Col, Row, Form, Stack, Table } from "react-bootstrap";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import Select from "../../../components/form-components/Select";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, findElementFromID } from "../../../utils";
import SectionHeader from "./SectionHeader";

function SchedaControlloForm({ data, initialData, errors }) {
  const [articoloID, setArticoloID] = useState(initialData?.articolo || "")
  const initialCliente = data.articoli && initialData?.articolo 
    ? findElementFromID(initialData?.articolo, data.articoli).cliente.nome
    : ""
  const [cliente, setCliente] = useState(initialCliente)
  const [infoOpen, setInfoOpen] = useState(false)
  const [spessoriOpen, setSpessoriOpen] = useState(false)
  const [immaginiOpen, setImmaginiOpen] = useState(false)
  const [controlliOpen, setControlliOpen] = useState(false)
  const articolo = findElementFromID(articoloID, data.articoli)
  const clienti = data.articoli ? new Set(data.articoli.map(articolo => articolo.cliente.nome)) : new Set([]);
  return (
    <>
      <Row className="mb-4">
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
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
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Ora:
              </Form.Label>
              <Col sm="8">
                <TimeInput initialData={initialData} />
              </Col>
            </Form.Group>
            <Select
              name="operatore"
              inputProps={{ required: true }}
              data={
                data?.operatori && data?.operatori?.map((o) => [o.id, o.nome])
              }
            />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10">
          <Stack gap={2} className="text-left">
            <Select
              name="cliente"
              inputProps={{ 
                required: true,
                value: cliente,
                onChange: (e) => setCliente(e.target.value)
              }}
              data={
                clienti && [...clienti].map((cliente) => [cliente, cliente])
              }
            />
            <Select
              name="articolo"
              inputProps={{
                required: true,
                disabled: !cliente,
                value: articoloID,
                onChange: (e) => setArticoloID(e.target.value),
              }}
              data={data?.articoli && data?.articoli?.filter(arti => arti.cliente.nome === cliente).map(o => [o.id, `${o.nome} (${o.codice})`])}
            />
            <Input 
              name="lotto"
              errors={errors}
              labelProps={{ className: "pr-6" }}
              inputProps={{ required: true }}
            />
          </Stack>
        </Col>
      </Row>
      {articolo && (
        <>
          <SectionHeader title="Informazioni Articolo" open={infoOpen} setOpen={setInfoOpen} />
          <div className={`${infoOpen ? "" : "max-h-0 h-0 overflow-hidden"}`}>
            <Table className="align-middle text-center" bordered>
              <thead>
                <tr>
                  <th>Denominazione</th>
                  <th>Codice articolo</th>
                  <th>Trattamento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{articolo.nome}</td>
                  <td>{articolo.codice}</td>
                  <td>{articolo.richieste.map(ric => ric.lavorazione.nome).join(' - ')}</td>
                </tr>
              </tbody>
            </Table>
          </div>
          {articolo.richieste.some(richiesta => richiesta.spessore_minimo || richiesta.spessore_massimo) && (
            <>
            <SectionHeader title="Spessori Richiesti" open={spessoriOpen} setOpen={setSpessoriOpen} />
            <div className={`${spessoriOpen ? "" : "max-h-0 h-0 overflow-hidden"}`}>
              <Table className="align-middle text-center" bordered>
                <thead>
                  <tr className={`${spessoriOpen ? "" : "hidden"}`}>
                    <th>Punto</th>
                    {articolo.richieste.map(ric => (
                      <th key={ric.id}>{ric.lavorazione.metallo?.nome || "-"}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`${spessoriOpen ? "" : "hidden"}`}>
                  <tr>
                    <td>1</td>
                    {articolo.richieste.map(ric => (
                      <th key={ric.id}>{ric.spessore_minimo} ÷ {ric.spessore_massimo} µ</th>
                    ))}
                  </tr>
                </tbody>
              </Table>
            </div>
            </>
          )}
          {(articolo.scheda_controllo?.immagine_misurazione || articolo.scheda_controllo?.immagine_aggancio) && (
            <>
            <SectionHeader title="Immagini di supporto" open={immaginiOpen} setOpen={setImmaginiOpen} />
            <div className={`${immaginiOpen ? "" : "max-h-0 h-0 overflow-hidden"}`}>
              <Table className="align-middle text-center" bordered>
                <thead>
                  <tr className={`${immaginiOpen ? "" : "hidden"}`}>
                    {articolo.scheda_controllo.immagine_misurazione && (
                      <th className="w-1/2 align-middle">Punto di misura per la verifica dello spessore del trattamento</th>
                    )}
                    {articolo.scheda_controllo.immagine_aggancio && (
                      <th className="w-1/2 align-middle">Zona di aggancio</th>
                    )}
                  </tr>
                </thead>
                <tbody className={`${immaginiOpen ? "" : "hidden"}`}>
                  <tr>
                    {articolo.scheda_controllo.immagine_misurazione && (
                      <td className="w-1/2 align-middle">
                        <img src={articolo.scheda_controllo.immagine_misurazione} alt="misurazione" />
                      </td>
                    )}
                    {articolo.scheda_controllo.immagine_aggancio && (
                      <td className="w-1/2 align-middle">
                        <img src={articolo.scheda_controllo.immagine_aggancio} alt="aggancio" />
                      </td>
                    )}
                  </tr>
                </tbody>
              </Table>
            </div>
            </>
          )}
          {articolo.scheda_controllo && articolo.scheda_controllo.sezioni.length > 0 && (
            <>
            <SectionHeader title="Controlli da effettuare" open={controlliOpen} setOpen={setControlliOpen} />
            <div className={`${controlliOpen ? "" : "max-h-0 h-0 overflow-hidden"}`}>
              <Table className="align-middle text-center" bordered>
                <thead>
                  <tr className={`${controlliOpen ? "" : "hidden"}`}>
                    <th>Cosa</th>
                    <th>Quanti</th>
                    <th>Chi</th>
                    <th>Eseguito</th>
                  </tr>
                </thead>
                <tbody className={`${controlliOpen ? "" : "hidden"}`}>
                  {articolo.scheda_controllo.sezioni.map(sezione => (
                    <>
                      <tr key={sezione.id}>
                        <td colSpan="4" className="text-left uppercase font-medium text-nav-blue">{sezione.nome}</td>
                      </tr>
                      {sezione.controlli.map(controllo => {
                        if (controllo.frequenza || controllo.responsabilità) {
                          return (
                            <tr className="text-sm" key={controllo.id}>
                              <td className="text-left py-1.5" style={{ paddingLeft: "1.5em"}}>{controllo.nome}</td>
                              <td className="py-1.5">{controllo.frequenza}</td>
                              <td className="py-1.5">{controllo.responsabilità}</td>
                              <td className="py-1.5">
                                <Checkbox 
                                  label={false}
                                  name="controllo"
                                  inputProps={{ defaultChecked: true }}
                                  vertical={true}
                                />
                              </td>
                            </tr>
                          )
                        } else {
                          return (
                            <tr className="text-sm" key={controllo.id}>
                              <td colSpan="4" className="text-left py-1.5" style={{ paddingLeft: "1.5em"}}>• {controllo.nome}</td>
                            </tr>
                          )
                        }
                      })}
                    </>
                  ))}
                </tbody>
              </Table>
            </div>
            </>
          )}
        </>
      )}
      <Form.Group className="mt-8">
        <Row className="mb-4">
          <Col xs={1} className="flex items-center">
            <Form.Label className="mt-2">Note:</Form.Label>
          </Col>
          <Col sm={6}>
            <Form.Control as="textarea" rows={3} name="note" />
          </Col>
          <Col sm={5}>
            <Input
              label="N° Pezzi:"
              name="n_pezzi_dichiarati"
              vertical={true}
              inputProps={{
                required: true,
                className: "w-3/4 m-auto text-center",
                type: "number",
              }}
            />
          </Col>
        </Row>
      </Form.Group>
    </>
  );
}

export default SchedaControlloForm;
