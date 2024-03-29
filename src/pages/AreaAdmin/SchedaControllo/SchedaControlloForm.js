import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row, Table, Button } from "react-bootstrap";
import Fieldset from "../../../components/form-components/Fieldset";
import Input from "../../../components/form-components/Input";
import MinusIcon from "../../../components/Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../../components/Icons/PlusIcon/PlusIcon";
import ArticoliInput from "./ArticoliInput";
import { addToNestedArray, modifyNestedObject, removeFromNestedArray } from "../../utils";
import { useFormContext } from "../../../contexts/FormContext";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { findElementFromID, searchOptions } from "../../../utils";
import TabellaNestedItems from "../../../components/form-components/TabellaNestedItems/TabellaNestedItems";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { URLS } from "../../../urls";
import Checkbox from "../../../components/form-components/Checkbox";

function SchedaControlloForm() {
  const { data: lavorazioni } = useCustomQuery({ queryKey: URLS.LAVORAZIONI });

  const { initialData, view } = useFormContext()
  const emptyControllo = { nome: "", frequenza: "", responsabilità: "", misurazioni: null }
  const getSezioneVuota = (n) => {
    const nextLetter = String.fromCharCode(65 + n)
    return { nome: `${nextLetter}. `, controlli: [ emptyControllo ]}
  }
  const [sezioni, setSezioni] = useState(!!initialData ? initialData?.sezioni?.map(sez => ({...sez, controlli: sez.controlli.map(con => ({...con, misurazioni: con.misurazioni.map(mis => ({ value: mis, label: findElementFromID(mis, lavorazioni).nome }))}))})) || [] : [getSezioneVuota(0)])
  return (
    <>
      <Row className="mb-4 mt-2">
        <Input
          label="Nome scheda di controllo:"
          name="nome"
          labelProps={{ className: "text-left" }}
          inputProps={{ className: "text-left px-3" }}
        />
      </Row>
      <Fieldset title="Articoli collegati alla scheda di controllo">
        <ArticoliInput />
      </Fieldset>
      <Fieldset title="Controlli da effettuare">
        {sezioni.map((sezione, idxSezione) => (
          <div key={idxSezione} className="mb-8">
            <div className="py-2 text-sm border-t-0 border-r-0 border-l-0 font-semibold  text-white bg-nav-blue rounded-t-md px-4">
              <Row>
                <Col xs={11}>
                  {initialData && (
                    <Hidden name={`sezioni__${idxSezione}__id`} value={sezione.id || undefined}/>
                  )}
                  <Input 
                    label="Nome sezione:"
                    labelCols={3}
                    labelProps={{ className: "text-left" }}
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
                  <th className="w-[30%]">nome</th>
                  <th className="w-[15%]">frequenza</th>
                  <th className="w-[15%]">responsabilità</th>
                  <th className="w-[20%]">misurazioni</th>
                  <th className="w-[15%]">rischi</th>
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
                        <Hidden name={`${basePath}__id`} value={controllo.id || undefined}/>
                      )}
                      <Input
                        label={false}
                        name={`${basePath}__nome`}
                        inputProps={{
                          className: "text-left",
                          as: "textarea",
                          rows: initialData ? 2 : 1,
                          value: controllo.nome,
                          onChange: (e) => setSezioni(modifyNestedObject(sezioni, `${richiestePath}__nome`, e.target.value))
                        }}
                      />
                    </td>
                    <td>
                      <Input
                        label={false}
                        name={`${basePath}__frequenza`}
                        inputProps={{
                          className: "text-left",
                          value: controllo.frequenza,
                          onChange: (e) => setSezioni(modifyNestedObject(sezioni, `${richiestePath}__frequenza`, e.target.value))
                        }}
                        />
                    </td>
                    <td>
                      <Input
                        label={false}
                        name={`${basePath}__responsabilità`}
                        inputProps={{
                          className: "text-left",
                          value: controllo.responsabilità,
                          onChange: (e) => setSezioni(
                            modifyNestedObject(sezioni, `${richiestePath}__responsabilità`, e.target.value)
                          )
                        }}
                        />
                    </td>
                    <td>
                      <SearchSelect
                        label={false}
                        name={`${basePath}__misurazioni`}
                        options={searchOptions(lavorazioni, "nome")}
                        inputProps={{
                          isMulti: true,
                          value: controllo.misurazioni,
                          onChange: (e, a) => {
                            setSezioni(
                            modifyNestedObject(sezioni, `${richiestePath}__misurazioni`, e)
                          )}
                        }}
                      />
                    </td>
                    <td>
                      {!!view || initialData ? (
                        <>
                        <Checkbox name={`${basePath}__safety`} label="Safety" inputProps={{ className: "text-lg relative -top-1" }} labelProps={{ className: "py-0 pl-5"}}  />
                        <Checkbox name={`${basePath}__critical`} label="Critical" inputProps={{ className: "text-lg relative -top-1" }} labelProps={{ className: "py-0 pl-5"}} />
                        </>
                      ) : (
                        <>
                        <Checkbox labelCols={8} name={`${basePath}__safety`} label="Safety" inputProps={{ className: "text-lg relative -top-1", defaultChecked: false }} labelProps={{ className: "py-0"}}  />
                        <Checkbox labelCols={8} name={`${basePath}__critical`} label="Critical" inputProps={{ className: "text-lg relative -top-1", defaultChecked: false }} labelProps={{ className: "py-0"}} />
                        </>
                      )}
                    </td>
                    <td>
                      <MinusIcon 
                        onClick={() => setSezioni(removeFromNestedArray(sezioni, `${idxSezione}__controlli`, idxControllo))}
                      />
                    </td>
                  </tr>
                )})}
                <tr>
                  <td colSpan={4}>
                    <PlusIcon 
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
      <Fieldset title="Allegati obbligatori">
        <TabellaNestedItems
          name="allegati"
          colonne={[
            { name: "nome_file" },
          ]}
        />
      </Fieldset>
    </>
  );
}

export default SchedaControlloForm;
