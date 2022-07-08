import React, { useContext, useState } from "react";
import { Col, Row, Form, Stack, Table } from "react-bootstrap";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, findElementFromID } from "../../../utils";
import SectionHeader from "./SectionHeader";
import Fieldset from "../../../components/form-components/Fieldset";
import SearchSelect from "../../../components/form-components/SearchSelect";
import UserContext from "../../../UserContext";
import PopoverMisurazioni from "./PopoverMisurazioni";

function RecordLavorazioneForm({ data, initialData, errors, view }) {
  const initialCliente = data.articoli && initialData?.articolo 
    ? findElementFromID(initialData?.articolo, data.articoli).cliente.nome
    : ""
  const [cliente, setCliente] = useState(initialCliente ? { value: initialCliente, label: initialCliente } : null)
  const [articoloID, setArticoloID] = useState(initialData?.articolo || "")
  const [infoOpen, setInfoOpen] = useState(false)
  const [spessoriOpen, setSpessoriOpen] = useState(false)
  const [immaginiOpen, setImmaginiOpen] = useState(false)
  const [controlliOpen, setControlliOpen] = useState(false)
  const articolo = findElementFromID(articoloID, data.articoli)
  const clienti = data.articoli ? new Set(data.articoli.map(articolo => articolo.cliente.nome)) : new Set([]);
  let indexControllo = -1
  const { user } = useContext(UserContext)
  return (
    <>
      <Row className="mb-4">
        <input hidden className="hidden" name="impianto" defaultValue={user.user.impianto.id}/>
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
            <Input
              name="data"
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
                <TimeInput />
              </Col>
            </Form.Group>
            <SearchSelect
              name="operatore" 
              initialData={initialData}
              errors={errors}
              inputProps={{ required: true, isDisabled: view }}
              colProps={{ className: "text-center" }}
              options={data?.operatori?.map(o => ({ value: o.id, label: o.nome }))}
            />
          </Stack>
        </Col>
        <Col xs={6} className="pl-10 flex">
          <Stack gap={3} className="text-left justify-center">
            <SearchSelect
              name="cliente" 
              errors={errors}
              inputProps={{ 
                required: true,
                isDisabled: view,
                value: cliente,
                onChange: (e) => setCliente(e)
              }}
              colProps={{ className: "text-center" }}
              options={clienti && [...clienti].map(cliente => ({ value: cliente, label: cliente }))}
            />
            <SearchSelect
              name="articolo" 
              errors={errors}
              inputProps={{ 
                required: true,
                isDisabled: !cliente || view,
                value: articolo ? { value: articolo.id, label: `${articolo.nome} (${articolo.codice})` } : null,
                onChange: (e) => setArticoloID(e?.value ? e.value : null),
              }}
              colProps={{ className: "text-center" }}
              options={data?.articoli?.filter(arti => arti.cliente.nome === cliente?.value).map(a => ({ value: a.id, label: `${a.nome} (${a.codice})` }))}
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
              errors={errors}
            />
          </Col>
          <Col xs={6} className="pl-0">
            <Input 
              label="N° lotto supergalvanica:"
              name="n_lotto_super"
              labelProps={{ className: "text-right pr-5 pb-2" }}
              labelCols={7}
              errors={errors}
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
                required: true,
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
                required: true,
                defaultValue: initialData?.n_pezzi_scartati || 0,
                type: "number",
              }}
            />
          </Col>
        </Row>
      </Fieldset>
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
                    {/* {articolo.scheda_controllo.immagine_misurazione && (
                      <th className="w-1/2 align-middle">Punto di misura per la verifica dello spessore del trattamento</th>
                    )}
                    {articolo.scheda_controllo.immagine_aggancio && (
                      <th className="w-1/2 align-middle">Zona di aggancio</th>
                    )} */}
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
                  {articolo.scheda_controllo.sezioni.map(sezione => {
                    return (
                      <React.Fragment key={sezione.id}>
                        <tr>
                          <td colSpan="4" className="text-left uppercase font-medium text-nav-blue">{sezione.nome}</td>
                        </tr>
                        {sezione.controlli.map(controllo => {
                          indexControllo += 1
                          if (controllo.frequenza || controllo.responsabilità) {
                            return (
                              <tr className="text-sm" key={controllo.id}>
                                <td className="text-left py-1.5" style={{ paddingLeft: "1.5em"}}>{controllo.nome}</td>
                                <td className="py-1.5">
                                  {controllo.frequenza}
                                  {controllo.misurazioni && (
                                    <>
                                      <br />
                                      <PopoverMisurazioni
                                        idxControllo={indexControllo}
                                        controllo={controllo}
                                        initialData={initialData?.record_controlli && initialData.record_controlli.find(el => el.controllo === controllo.id)}
                                        view={view}
                                        articolo={articolo}
                                      />
                                    </>
                                  )}
                                </td>
                                <td className="py-1.5">{controllo.responsabilità}</td>
                                <td className="py-1.5">
                                  {initialData?.record_controlli && (
                                    <input
                                      hidden
                                      name={`record_controlli__${indexControllo}__id`}
                                      className="hidden"
                                      defaultValue={initialData.record_controlli[indexControllo]?.id || undefined}
                                    />
                                  )}
                                  <input
                                    hidden
                                    className="hidden"
                                    defaultValue={controllo.id}
                                    name={`record_controlli__${indexControllo}__controllo`}
                                  />
                                  <Checkbox 
                                    label={false}
                                    name={`record_controlli__${indexControllo}__eseguito`}
                                    inputProps={{ 
                                      className: "bigger-checkbox",
                                      defaultChecked: initialData?.record_controlli ? initialData?.record_controlli[indexControllo]?.eseguito : false
                                    }}
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
                      </React.Fragment>
                  )})}
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
          <Col sm={8}>
            <Form.Control as="textarea" rows={3} name="note" />
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
