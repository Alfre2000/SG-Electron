import { faPlus, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { Button, Col, Popover, Row, Table } from "react-bootstrap";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import Input from "../../../components/form-components/Input";
import MinusIcon from "../../../components/Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../../components/Icons/PlusIcon/PlusIcon";
import { useFormContext } from "../../../contexts/FormContext";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter/useOutsideAlerter";
import { findElementFromID, max, mean, min } from "../../../utils";
import { modifyNestedObject } from "../../utils";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import { URLS } from "../../../urls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/shadcn/Tabs";
import { Input as ShadcnInput } from "../../../components/shadcn/Input";
import { Label } from "../../../components/shadcn/Label";
import { UserContext } from "../../../contexts/UserContext";

const defaultMisurazioni = (initialData, lavorazioni) => {
  if (lavorazioni.every(el => el === "")) return []
  if (initialData.misurazioni.length === 0) return []
  let groups = {}
  initialData.misurazioni.forEach(misurazione => {
    if (misurazione.richiesta in groups) {
      groups[misurazione.richiesta].push(misurazione)
    } else {
      groups[misurazione.richiesta] = [misurazione]
    }
  })
  let maxRows = Math.max(...Object.values(groups).map(el => el.length))
  let columns = []
  lavorazioni.forEach(lav => lav.richieste.forEach(ric => {
    if (ric.id in groups) {
      let col = groups[ric.id]
      if (col.length < maxRows) {
        Array(maxRows - col.length).fill(0).forEach(_ => col.push({ valore: "" }))
      }
      columns.push(col)
    } else {
      let col = []
      Array(maxRows).fill(0).forEach(_ => col.push({ valore: "" }))
      columns.push(col)
    }
  }))
  columns = columns[0].map((_, colIndex) => columns.map(row => row[colIndex]))
  return columns
}

function PopoverMisurazioni({ controllo, idxControllo, initialData, articolo }) {
  const { user } = useContext(UserContext);
  const impianto = user?.user?.impianto;

  const lavorazioniQuery = useImpiantoQuery({ queryKey: URLS.LAVORAZIONI })

  const lavorazioni = useMemo(() =>
    controllo?.misurazioni?.map(lav => {
      let lavorazione = findElementFromID(lav, lavorazioniQuery.data)
      if (lavorazione) {
        lavorazione.richieste = articolo.richieste.filter(ric => ric.lavorazione.id === lavorazione.id)
      }
      return lavorazione
    })
  , [controllo?.misurazioni, lavorazioniQuery.data, articolo?.richieste]) 
  let nCols = 0
  lavorazioni?.forEach(lav => {
    nCols += articolo.richieste.filter(ric => ric.lavorazione.id === lav.id).length
  })
  const richieste = lavorazioni.map(lav => lav.richieste).flat()
  const emptyRow = Array(nCols).fill(0).map(_ => ({ valore: "" }))
  const [misurazioni, setMisurazioni] = useState(initialData?.misurazioni ? defaultMisurazioni(initialData, lavorazioni) : [emptyRow])
  
  useEffect(() => {
    if (initialData?.misurazioni?.length > 0 && misurazioni.length === 0) {
      setMisurazioni(defaultMisurazioni(initialData, lavorazioni))
    }
  }, [initialData, lavorazioni, misurazioni.length])


  const [open, setOpen] = useState(false)
  const popupRef = useRef(null);
  useOutsideAlerter(popupRef, (e) => {
    if (e.target.parentElement.id !== `popover-${controllo.id}` && e.target.id !== `popover-${controllo.id}`) {
      setOpen(false);
    }
  });
  const basePath = `record_controlli__${idxControllo}__misurazioni`
  const width = 250 + 100 * nCols
  const style = nCols < 5 ? 
    { top: "-20px", left: `-${width}px`, maxWidth: "700px", width: `${width}px` } :
    { top: "10px" , left: `-${width/3}px`,maxWidth: "800px", width: `${width}px` }
  const placement = nCols < 5 ? "left" : "bottom"
  return (
    <>
      <Button 
        variant="primary" 
        id={`popover-${controllo.id}`}
        size="sm" 
        className="bg-[#0d6efd] text-sm mt-1" 
        onClick={() => setOpen(!open)}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
        Misurazioni
      </Button>
      <div className={`${open ? "block" : "hidden"} relative`}>
        <Popover
          ref={popupRef}
          placement={placement}
          id="popover-misurazioni"
          style={style}
          className="absolute"
        >
          <Popover.Header as="h3" className="text-center font-bold py-[10px]" style={{ borderTopRightRadius: "0" }}>
            Misurazioni effettuate
          </Popover.Header>
          <Popover.Body>
            {lavorazioniQuery.isSuccess && (
              <Tabs defaultValue="misurazioni" className="text-center">
                <TabsList className={`${impianto.nome !== "Oro 140" ? "hidden" : ""}`}>
                  <TabsTrigger value="misurazioni">Misurazioni</TabsTrigger>
                  <TabsTrigger  value="min-max">Min-Max</TabsTrigger>
                </TabsList>
              <TabsContent value="misurazioni">
                <Table className="align-middle text-center" bordered>
                  <thead>
                    {nCols === lavorazioni.length ? (
                      <tr>
                        <th>N°</th>
                        {lavorazioni.map(lav => (
                          <th key={lav.id}>Valori {lav.nome.toLowerCase()}</th>
                        ))}
                        <th></th>
                      </tr>
                    ) : (
                      <>
                        <tr>
                          <th></th>
                          {lavorazioni.map(lav => (
                            <th key={lav.id} colSpan={lav.richieste.length}>Valori {lav.nome.toLowerCase()}<br></br>(Punti)</th>
                          ))}
                          <th></th>
                        </tr>
                        <tr>
                          <th>N°</th>
                          {lavorazioni.map(lav => lav.richieste.map(ric => (
                            <th key={ric.id}>{ric.punto}</th>
                          )))}
                          <th></th>
                        </tr>
                      </>
                    )}
                  </thead>
                  <tbody>
                    {misurazioni?.map((row, idxRow) => (
                      <tr key={idxRow}>
                        <td className="font-semibold">{idxRow + 1}</td>
                        {row?.map((misurazione, idxCol) => {
                          const idx = idxRow * nCols + idxCol
                          const richiesta = richieste[idxCol]
                          return (
                            <td key={idxCol}>
                              {initialData && misurazione.valore && (
                                <Hidden name={`${basePath}__${idx}__id`} value={misurazione.id || undefined}/>
                              )}
                              <Input
                                label={false}
                                name={`${basePath}__${idx}__valore`}
                                inputProps={{
                                  className: nCols < 5 ? "text-center pl-5" : "text-center no-arrows",
                                  value: misurazione.valore,
                                  type: "number",
                                  onChange: (e) => setMisurazioni(old =>
                                    modifyNestedObject(old, `${idxRow}__${idxCol}__valore`, e.target.value)
                                  )
                                }}
                              />
                              <ErroreInput 
                                misurazione={misurazione}
                                richiesta={richiesta}
                              />
                              {misurazione.valore && (
                                <Hidden name={`${basePath}__${idx}__richiesta`} value={richiesta.id}/>
                              )}
                            </td>
                          )
                        })}
                        <td>
                          <MinusIcon 
                            onClick={() => setMisurazioni(misurazioni.filter((_, idx) => idx !== idxRow))}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td colSpan={nCols}>
                        <PlusIcon 
                          onClick={() => setMisurazioni([...misurazioni, emptyRow])}
                        />
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                  {misurazioni?.[0]?.length > 1 && (
                    <RiassuntoDati misurazioni={misurazioni} lavorazione={lavorazioni} index={0} />
                  )}
                </Table>
              </TabsContent>
              <TabsContent value="min-max" className="space-y-1 pt-3 pb-2 grid grid-cols-2 items-center">
                <Label>Minimo</Label>
                <ShadcnInput name="minimo" className="h-8 text-center" type="number" />
                <Label>Media</Label>
                <ShadcnInput name="media" className="h-8 text-center" type="number" />
                <Label>Massimo</Label>
                <ShadcnInput name="massimo" className="h-8 text-center" type="number"/>
                <Label>N° Misurazioni</Label>
                <ShadcnInput name="n_misurazioni" className="h-8 text-center" type="number"/>
              </TabsContent>
            </Tabs>
            )}
          </Popover.Body>
          {misurazioni?.[0]?.length === 1 && (
            <RiassuntoDati misurazioni={misurazioni} lavorazione={lavorazioni[0]} index={0} />
          )}
        </Popover>
      </div>
    </>
  )
}

function RiassuntoDati({ misurazioni, lavorazione, index }) {
  const misurazioniCompilate = misurazioni ? misurazioni.map(row => row[index]).filter(el => !!el.valore).map(el => el.valore) : 0
  const padding = misurazioni[0].length === 1 ? "py-[13px]" : "py-[5px]"
  const { initialData } = useFormContext();
  if (misurazioni?.[0]?.length > 1) {
    const compilate = misurazioni.some(row => row.some(el => el.valore !== ""))
    if (!compilate || initialData?.completata !== true) return;
    const n_richieste = lavorazione.map(lav => lav.richieste.map(_ => 1).reduce((a,b)=>a+b)).reduce((a,b)=>a+b)
    return (
      <tfoot className={`text-center py-[5px] bg-[#f0f0f0] mx-0`} style={{ borderTop: "1px solid rgba(0,0,0,0.2)"}}>
        <tr>
          <td className="font-semibold">Min</td>
          {Array(n_richieste).fill(0).map((_, i) => (
            <td className="border-0">{min(misurazioni.map(row => row[i].valore).filter(x => x !== ""))}</td>
          ))}
          <td></td>
        </tr>
        <tr>
          <td className="font-semibold">Med</td>
          {Array(n_richieste).fill(0).map((_, i) => (
            <td className="border-0">{mean(misurazioni.map(row => row[i].valore).filter(x => x !== ""))}</td>
          ))}
          <td></td>
        </tr>
        <tr>
          <td className="font-semibold">Max</td>
          {Array(n_richieste).fill(0).map((_, i) => (
            <td className="border-0">{max(misurazioni.map(row => row[i].valore).filter(x => x !== ""))}</td>
          ))}
          <td></td>
        </tr>
      </tfoot>
    )
  }
  return index === misurazioni[0].length - 1 ? (
    <Row className={`text-center ${padding} bg-[#f0f0f0] mx-0`} style={{ borderTop: index === 0 ? "1px solid rgba(0,0,0,0.2)" : "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px"}}>
      {misurazioni[0].length > 1 && (
        <Col xs={3} className="text-left pl-6 pr-0">
          <b>{lavorazione.nome}:</b>
        </Col>
      )}
      <Col>
        <span>Minimo: <b>{min(misurazioniCompilate)}</b></span>
        <span className="mx-3">Media: <b>{mean(misurazioniCompilate)}</b></span>
        <span>Massimo: <b>{max(misurazioniCompilate)}</b></span>
      </Col>
    </Row>
  ) : (
    <Row className={`text-center ${padding} bg-[#f0f0f0] mx-0`} style={{ borderTop: index === 0 ? "1px solid rgba(0,0,0,0.2)" : ""}}>
      <Col xs={3} className="text-left pl-6 pr-0">
        <b>{lavorazione.nome}:</b>
      </Col>
      <Col xs={9}>
        <span>Minimo: <b>{min(misurazioniCompilate)}</b></span>
        <span className="mx-3">Media: <b>{mean(misurazioniCompilate)}</b></span>
        <span>Massimo: <b>{max(misurazioniCompilate)}</b></span>
      </Col>
    </Row>
  )
}

function ErroreInput({ misurazione, richiesta }) {
  const hasValore = misurazione.valore !== ""
  if (!hasValore) return null;
  const sopraMassimo = misurazione.valore > richiesta.spessore_massimo
  const sottoMinimo = misurazione.valore < richiesta.spessore_minimo
  if (!sopraMassimo && !sottoMinimo) return null;
  return (
    <span type="invalid" className="text-xs font-semibold text-center text-[#d48208]">
        <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" /> 
        {sopraMassimo ? "Valore sopra il massimo" : "Valore sotto il minimo"}
    </span>
  )
}


export default PopoverMisurazioni