import React, { useMemo, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import SG from "../../../images/certificati/sg.png";
import ICIM from "../../../images/certificati/icim.png";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faCirclePlus, faClose } from "@fortawesome/free-solid-svg-icons";
import { modifyNestedObject } from "../../utils";
import { useFormContext } from "../../../contexts/FormContext";
import { moveDown, moveUp, opzioniControlli, opzioniMisurazioni, removeItem } from "./utils";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import { URLS } from "../../../urls";

const TRANSLATIONS = {
  "stagno": "Tin",
  "oro": "Gold",
  "rame": "Copper",
  "nichel": "Nichel",
  "zinco": "Zinc"
} 

function CertificatoForm({ scheda }) {
  const { data: schedeControllo } = useCustomQuery({ queryKey: URLS.SCHEDE_CONTROLLO })
  const { data: lavorazioni } = useCustomQuery({ queryKey: URLS.LAVORAZIONI })
  const { data: metalli } = useCustomQuery({ queryKey: URLS.MATERIALI })

  const { initialData } = useFormContext();
  const scheda_controllo = schedeControllo?.find(s => s.id === scheda)
  const controlli = scheda_controllo?.sezioni?.map(sez => sez.controlli.filter(c => !!c.frequenza)).flat()
  const [controllo, setControllo] = useState(null)
  const [misurazione, setMisurazione] = useState(null)
  const emptyTest = { titolo: "", controllo: "", titolo_en: "", specifica: "", metodo: "", metodo_en: "" }
  const [tests, setTests] = useState(initialData?.tests ? initialData?.tests : [])
  const [error, setError] = useState(false)

  const updateControllo = (e) => {
    const newControllo = e?.value ? controlli.find(c => c.id === e.value) : null
    if (newControllo?.misurazioni) {
      newControllo.misurazioni = newControllo?.misurazioni?.map(
        mis => lavorazioni.find(lav => lav.id === mis || lav.id === mis.id)
      )
    }
    setControllo(newControllo)
    setMisurazione(null)
  }
  const addTest = () => {
    if (!!controllo && (controllo.misurazioni.length === 0 || !!misurazione)) {
      const test = {...emptyTest, controllo: controllo.id, titolo: "TEST", titolo_en: "Test"}
      if (!!misurazione) {
        const metallo = metalli.find(m => m.id === misurazione.metallo)
        if (metallo?.nome) {
          test.titolo = "TEST SPESSORE " + metallo.nome.toUpperCase()
          test.titolo_en = (TRANSLATIONS[metallo.nome.toLowerCase()] || metallo.nome) + " thickness inspection"
        }
      } else if (controllo.nome.toLowerCase().includes("aderenza")) {
        test.titolo = "TEST ADERENZA"
        test.titolo_en = "Adherence Test"
      }
      if (!!misurazione) test.lavorazione = misurazione.id
      setTests(old => [...old, test])
      setControllo(null)
      setMisurazione(null)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1000 * 3)
    }
  }

  const controlliOptions = useMemo(() => controlli ? opzioniControlli(controlli, tests) : [], [controlli, tests])
  const misurazioniOptions = useMemo(() => controllo ? opzioniMisurazioni(controllo, tests) : [], [controllo, tests])

  return (
    <div className="mb-10">
      <Hidden name="scheda_controllo" value={scheda_controllo?.id} />
      <Table bordered className="mt-12 align-middle border-gray-300">
        <tbody>
          <tr>
            <td rowSpan={2}>
              <img src={SG} alt="SuperGalvanica" />
            </td>
            <td className="w-2/5">
              <h3 className="font-medium text-xl">Certificato di Controllo</h3>
              <p>secondo EN 10204 Tipo 3.1</p>
            </td>
            <td rowSpan={2}>
              <img src={ICIM} alt="Icim" />
            </td>
          </tr>
          <tr className="text-blue-800">
            <td>
              <h3 className="font-medium text-lg">Control Certificate</h3>
              <p className="text-sm">according to EN 10204 Type 3.1</p>
            </td>
          </tr>
        </tbody>
      </Table>
      <Table bordered className="text-sm align-middle border-gray-300">
        <tbody>
          <tr>
            <td className="text-left w-7/10 flex justify-between">
              <div>
                CERTIFICATO N°{" "}
                <span className="ml-4 text-blue-800">Certificate No.</span>
              </div>
              <div className="text-center font-semibold">xxxx.xxxxxx.x</div>
              <div></div>
            </td>
            <td className="w-1/3" style={{ borderLeft: 0}}>Cormano, xx/xx/xxxx</td>
          </tr>
        </tbody>
      </Table>
      <Table bordered className="text-sm text-left align-middle border-gray-300">
        <tbody>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0}}>Cliente</td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0}}>Customer</td>
            <td className="w-3/5">
              <p className="font-semibold">Esempio Cliente</p>
              <p>xxxxxxxx, xx</p>
              <p>xxxxxx xxxxxxxx</p>
            </td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0}}>Articolo</td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0}}>Part Number</td>
            <td className="w-3/5 font-semibold">Esempio Articolo</td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0}}>Quantità</td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0}}>Quantity</td>
            <td className="w-3/5 font-semibold">xxxxx</td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0}}>Nostro DDT N°</td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0}}>Our Delivery Note No.</td>
            <td className="w-3/5">xxx</td>
          </tr>
          <tr>
            <td className="w-1/5" style={{ borderRight: 0}}>Nostro lotto N°</td>
            <td className="w-1/5 text-blue-800" style={{ borderLeft: 0}}>Our Batch No.</td>
            <td className="w-3/5">xx/xxxx.x</td>
          </tr>
        </tbody>
      </Table>
      <Table bordered className="align-middle border-gray-300">
        <tbody>
          <tr>
            <td>
              <Input
                floating={true}
                name="dichiarazione"
                inputProps={{
                  as: "textarea", rows: 3,
                  defaultValue: initialData?.dichiarazione || "SI DICHIARA CHE IL TRATTAMENTO ESEGUITO È CONFORME A ",
                  className: "text-left pl-3"
                }} 
                labelProps={{
                  className: "m-auto"
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <Input
                floating={true}
                name="dichiarazione_en"
                label="Dichiarazione (en):"
                inputProps={{
                  as: "textarea", rows: 3,
                  defaultValue: initialData?.dichiarazione_en || "We herewith declare that the performed treatment is conforming to ",
                  className: "text-left pl-3"
                }}
                labelProps={{
                  className: "m-auto"
                }}
              />
            </td>
          </tr>
        </tbody>
      </Table>
      <div className="text-left flex items-center mb-6 ml-2 font-semibold">
        <h4>ESITO CONTROLLI ESEGUITI</h4>
        <p className="ml-4 text-blue-800">Performed checks results</p>
      </div>
      <div className="mb-6">
        {tests.map((test, idx) => {
          const controllo = controlli?.find(c => c.id === test.controllo)
          return (
          <Table key={test.id} bordered className="text-sm align-middle border-gray-300 mb-10 shadow-sm relative">
            <tbody>
              <tr>
                <td colSpan={test.lavorazione ? 4 : 3} className="relative">
                  <Hidden name={`tests__${idx}__controllo`} value={test.controllo} />
                  {test.lavorazione && (<Hidden name={`tests__${idx}__lavorazione`} value={test.lavorazione} />)}
                  {idx !== 0 && (
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      className="absolute rounded-full bg-blue-300 text-white w-4 h-4 p-0.5 right-full bottom-full translate-x-2 translate-y-2 hover:bg-blue-400 hover:cursor-pointer"
                      onClick={() => setTests(old => moveUp(old, idx))}
                    />
                  )}
                  <div className="flex">
                  <div className="pr-2 w-1/2">
                    <Input
                      floating={true}
                      name={`tests__${idx}__titolo`}
                      inputProps={{
                        value: test.titolo,
                        onChange: (e) =>
                          setTests(
                            modifyNestedObject(
                              tests,
                              `${idx}__titolo`,
                              e.target.value
                            )
                          )
                      }}
                    />
                  </div>
                  <div className="pl-2 w-1/2">
                    <Input
                      floating={true}
                      name={`tests__${idx}__titolo_en`}
                      inputProps={{
                        value: test.titolo_en,
                        onChange: (e) =>
                          setTests(
                            modifyNestedObject(
                              tests,
                              `${idx}__titolo_en`,
                              e.target.value
                            )
                          )
                      }}
                    />
                  </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faClose}
                    className="absolute rounded-full bg-red-300 text-white w-4 h-4 p-0.5 left-full bottom-full -translate-x-2 translate-y-2 hover:bg-red-400 hover:cursor-pointer"
                    onClick={() => setTests(old => removeItem(old, idx))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center justify-between px-3">
                    <div>
                      <p>Specifica di riferimento:</p>
                      <p className="text-blue-800">Specification reference:</p>
                    </div>
                    <div className="w-3/5">
                      <Input
                        label={false}
                        name={`tests__${idx}__specifica`}
                        inputProps={{
                          className: "text-left",
                          value: test.specifica,
                          onChange: (e) =>
                            setTests(
                              modifyNestedObject(
                                tests,
                                `${idx}__specifica`,
                                e.target.value
                              )
                            )
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td rowSpan={2} className="w-1/4">
                  <div className="flex justify-evenly items-center">
                    <div>
                      <p>N° pezzi testati:</p>
                      <p className="text-blue-800">No. of inspected parts:</p>
                    </div>
                    <div className="font-semibold">{controllo?.frequenza_n}</div>
                  </div>
                </td>
                <td rowSpan={2} colSpan={test.lavorazione ? 2 : 1} className="w-1/4 px-4">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <p>Esito:</p>
                      <p className="text-blue-800">Result:</p>
                    </div>
                    <div className="font-semibold">
                      <p>Conforme</p>
                      <p className="text-blue-800">Conforming</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="relative">
                <td>
                  {idx !== tests.length - 1 && !test.lavorazione && (
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className="absolute rounded-full bg-blue-300 text-white w-4 h-4 p-0.5 right-full top-full translate-x-2 -translate-y-2 hover:bg-blue-400 hover:cursor-pointer"
                      onClick={() => setTests(old => moveDown(old, idx))}
                    />
                  )}
                  <div className="flex items-stretch justify-between px-3">
                    <div className="flex flex-col py-1 justify-between">
                      <p>Metodo:</p>
                      <p className="text-blue-800">Method:</p>
                    </div>
                    <div className="w-3/5">
                      <Input
                        label={false}
                        name={`tests__${idx}__metodo`}
                        inputProps={{
                          className: "text-left",
                          value: test.metodo,
                          onChange: (e) =>
                            setTests(
                              modifyNestedObject(
                                tests,
                                `${idx}__metodo`,
                                e.target.value
                              )
                            )
                        }}
                      />
                      <Input
                        label={false}
                        name={`tests__${idx}__metodo_en`}
                        inputProps={{
                          className: "text-left mt-2",
                          value: test.metodo_en,
                          onChange: (e) =>
                            setTests(
                              modifyNestedObject(
                                tests,
                                `${idx}__metodo_en`,
                                e.target.value
                              )
                            )
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              {test.lavorazione && (
                <>
                  <tr>
                    <td>
                      <div className="flex items-stretch justify-between px-3 text-left">
                        <div className="flex flex-col py-1 justify-between">
                          <p>Informazioni aggiuntive:</p>
                          <p className="text-blue-800">Additional information:</p>
                        </div>
                        <div className="w-3/5">
                          <Input
                            label={false}
                            name={`tests__${idx}__note`}
                            inputProps={{
                              className: "text-left",
                              value: test.note,
                              onChange: (e) =>
                                setTests(
                                  modifyNestedObject(
                                    tests,
                                    `${idx}__note`,
                                    e.target.value
                                  )
                                )
                            }}
                          />
                          <Input
                            label={false}
                            name={`tests__${idx}__note_en`}
                            inputProps={{
                              className: "text-left mt-2",
                              value: test.note_en,
                              onChange: (e) =>
                                setTests(
                                  modifyNestedObject(
                                    tests,
                                    `${idx}__note_en`,
                                    e.target.value
                                  )
                                )
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td></td>
                    <td className="font-semibold">Min</td>
                    <td className="font-semibold">Max</td>
                  </tr>
                  <tr>
                    <td rowSpan={3}></td>
                    <td>Punto <span className="text-blue-800">Point</span> n° <span className="font-semibold">1</span></td>
                    <td className="font-semibold">x.xx</td>
                    <td className="font-semibold">x.xx</td>
                  </tr>
                  <tr>
                    <td>Punto <span className="text-blue-800">Point</span> n° <span className="font-semibold">2</span></td>
                    <td className="font-semibold">x.xx</td>
                    <td className="font-semibold">xx.xx</td>
                  </tr>
                  <tr className="relative">
                    <td>Punto <span className="text-blue-800">Point</span> n° <span className="font-semibold">...</span>
                    {idx !== tests.length - 1 && (
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        className="absolute rounded-full bg-blue-300 text-white w-4 h-4 p-0.5 right-full top-full translate-x-2 -translate-y-2 hover:bg-blue-400 hover:cursor-pointer"
                        onClick={() => setTests(old => moveDown(old, idx))}
                      />
                    )}
                    </td>
                    <td className="font-semibold">...</td>
                    <td className="font-semibold">...</td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        )})}
      </div>
      <div className="flex shadow-xl border-1 border-gray-200 bg-white mb-6 rounded-lg p-3">
        <div className="w-full px-8">
          <SearchSelect
            options={controlliOptions}
            label="Controllo"
            errors={error && !controllo ? {"controllo": ["obbligatorio"]} : undefined}
            showMessageError={false}
            errorName="controllo"
            inputProps={{
              value: controllo ? { value: controllo.id, label: controllo.nome } : null,
              onChange: updateControllo
            }}
            labelCols={2}
            labelProps={{
              className: "text-left"
            }}
          />
          {controllo?.misurazioni?.length > 0 && (
            <SearchSelect
              options={misurazioniOptions}
              label="Misurazione"
              errors={error ? {"misurazione": ["obbligatorio"]} : undefined}
              showMessageError={false}
              errorName="misurazione"
              inputProps={{
                value: misurazione ? { value: misurazione.id, label: misurazione.nome } : null,
                onChange: (e) =>  setMisurazione(e?.value ? controllo.misurazioni.find(m => m.id === e.value) : null)
              }}
              labelCols={2}
              labelProps={{
                className: "text-left"
              }}
            />
          )}
        </div>
        <div className="mr-6 my-auto">
          <Button className="bg-[#0d6efd] min-w-[100px] h-10 font-medium m-auto" onClick={addTest}>
            <FontAwesomeIcon icon={faCirclePlus} className="pr-3"/>Test
          </Button>
        </div>
      </div>
      <Table bordered className="text-left align-middle text-sm mt-12 border-gray-300">
        <tbody>
          <tr>
            <td className="font-semibold">
              <span>Il Responsabile Controllo Qualità</span>
              <span className="ml-4 text-blue-800">Quality Control Responsible</span>
            </td>
            <td className="w-1/3 text-center">Carlo Mauri</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default CertificatoForm;
