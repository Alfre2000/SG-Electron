import React, { useContext, useState } from "react";
import { Col, Row, Form, Stack, Table } from "react-bootstrap";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { findElementFromID, searchOptions } from "../../../utils";
import SectionHeader from "./SectionHeader";
import Fieldset from "../../../components/form-components/Fieldset";
import SearchSelect from "../../../components/form-components/SearchSelect";
import UserContext from "../../../UserContext";
import PopoverMisurazioni from "./PopoverMisurazioni";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import ImageModal from "../../../components/Modals/ImageModal/ImageModal";
const electron = window?.require ? window.require("electron") : null;

function RecordLavorazioneForm({ data, initialData, view }) {
  const initialCliente = data.articoli && initialData?.articolo 
    ? findElementFromID(initialData?.articolo, data.articoli).cliente.nome
    : ""
  const [cliente, setCliente] = useState(initialCliente ? { value: initialCliente, label: initialCliente } : null)
  const [articoloID, setArticoloID] = useState(initialData?.articolo || "")
  const [lavorazione, setLavorazione] = useState(initialData?.lavorazione || null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [spessoriOpen, setSpessoriOpen] = useState(false)
  const [documentiOpen, setDocumentiOpen] = useState(false)
  const [controlliOpen, setControlliOpen] = useState(false)
  const articolo = findElementFromID(articoloID, data.articoli)
  const clienti = data.articoli ? new Set(data.articoli.map(articolo => articolo.cliente.nome)) : new Set([]);
  let indexControllo = -1
  const { user } = useContext(UserContext)
  let lavorazioni = user?.user?.impianto?.lavorazioni
  if (lavorazioni && articolo) {
    let lavorazioniRichieste = articolo.richieste.map(ric => ric.lavorazione.id)
    lavorazioni = lavorazioni.filter(lav => lavorazioniRichieste.includes(lav.id))
  }
  if (lavorazioni.length === 1 && lavorazioni[0]?.id !== lavorazione?.value) {
    setLavorazione({ value: lavorazioni[0].id, label: lavorazioni[0].nome })
  }
  const [modalImg, setModalImg] = useState(false)
  const docs = [...(articolo?.immagini_supporto || []), ...(articolo?.documenti_supporto || [])]
  return (
    <>
      <Row className="mb-4">
        <Hidden name="impianto" value={user.user.impianto.id}/>
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
                onChange: (e) => setCliente(e) || setArticoloID(null) || setLavorazione(null)
              }}
              options={clienti && [...clienti].map(cliente => ({ value: cliente, label: cliente }))}
            />
            <SearchSelect
              name="articolo" 
              inputProps={{ 
                isDisabled: !cliente || view,
                value: articolo ? { value: articolo.id, label: `${articolo.nome} (${articolo.codice || "-"})` } : null,
                onChange: (e) => setArticoloID(e?.value ? e.value : null) || setLavorazione(null),
              }}
              options={data?.articoli?.filter(arti => arti.cliente.nome === cliente?.value).map(a => ({ value: a.id, label: `${a.nome} (${a.codice || "-"})` }))}
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
          {(docs.length > 0) && (
            <>
            <SectionHeader title="Immagini e Documenti di supporto" open={documentiOpen} setOpen={setDocumentiOpen} />
            <div className={`${documentiOpen ? "" : "max-h-0 h-0 overflow-hidden"}`}>
              <Table className="align-middle text-center" bordered>
                <thead>
                  <tr className={`${documentiOpen ? "" : "hidden"}`}>
                    <th>Titolo</th>
                    <th>Documento</th>
                  </tr>
                </thead>
                <tbody className={`${documentiOpen ? "" : "hidden"}`}>
                  {docs.map(documento => (
                    <tr key={documento.id}>
                      <td 
                        className="hover:underline hover:cursor-pointer w-[50%]"
                        onClick={() => {
                          if (documento.immagine) {
                            setModalImg(documento.id)
                          } else {
                            electron.ipcRenderer.invoke("open-file", documento.documento);
                          }
                          }}>
                          {documento.titolo}
                      </td>
                      {documento.immagine ? (
                        <td className="">
                          <img
                            className="m-auto max-w-xs hover:cursor-pointer"
                            alt={documento.titolo}
                            src={documento.immagine} 
                            onClick={() => setModalImg(documento.id)}
                          />
                          {documento.id === modalImg && (
                            <ImageModal setShow={setModalImg} url={documento.immagine} titolo={documento.titolo} />
                          )}
                        </td>
                        ) : (
                          <td className="max-w-xs hover:cursor-pointer italic hover:underline hover:underline-offset-1" onClick={() => electron.ipcRenderer.invoke("open-file", documento.documento)}>
                            Apri documento
                          </td>
                        )
                      }
                    </tr>
                  ))}
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
                                    <Hidden
                                      name={`record_controlli__${indexControllo}__id`}
                                      value={initialData.record_controlli[indexControllo]?.id || undefined}
                                    />
                                  )}
                                  <Hidden
                                    value={controllo.id}
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
