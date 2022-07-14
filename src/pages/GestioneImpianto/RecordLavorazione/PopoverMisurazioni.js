import { faPlus, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useMemo } from "react";
import { Button, Col, Popover, Row, Table } from "react-bootstrap";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import Input from "../../../components/form-components/Input";
import MinusIcon from "../../../components/Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../../components/Icons/PlusIcon/PlusIcon";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter/useOutsideAlerter";
import { findElementFromID, max, mean, min } from "../../../utils";
import { modifyNestedObject } from "../../utils";

const defaultMisurazioni = (initialData, lavorazioni) => {
  if (initialData.misurazioni.length === 0) return []
  let groups = {}
  initialData.misurazioni.forEach(misurazione => {
    if (misurazione.lavorazione in groups) {
      groups[misurazione.lavorazione].push(misurazione)
    } else {
      groups[misurazione.lavorazione] = [misurazione]
    }
  })
  let maxRows = Math.max(...Object.values(groups).map(el => el.length))
  let columns = []
  lavorazioni.forEach(lav => {
    if (lav.id in groups) {
      let col = groups[lav.id]
      if (col.length < maxRows) {
        Array(maxRows - col.length).fill(0).forEach(_ => col.push({ valore: "" }))
      }
      columns.push(col)
    } else {
      let col = []
      Array(maxRows).fill(0).forEach(_ => col.push({ valore: "" }))
      columns.push(col)
    }
  })
  columns = columns[0].map((_, colIndex) => columns.map(row => row[colIndex]))
  return columns
}

function PopoverMisurazioni({ data, controllo, idxControllo, initialData, articolo }) {
  const lavorazioni = useMemo(() => 
    controllo?.misurazioni?.map(lav => findElementFromID(lav, data?.lavorazioni))
  , [controllo?.misurazioni, data?.lavorazioni]) 
  const emptyRow = lavorazioni.map(_ => ({ valore: "" }))
  const [misurazioni, setMisurazioni] = useState(initialData?.misurazioni ? defaultMisurazioni(initialData, lavorazioni) : [emptyRow])
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null);
  useOutsideAlerter(popupRef, (e) => {
    if (e.target.parentElement.id !== `popover-${controllo.id}` && e.target.id !== `popover-${controllo.id}`) {
      setOpen(false);
    }
  });
  const basePath = `record_controlli__${idxControllo}__misurazioni`
  const width = 250 + 100 * lavorazioni.length
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
          placement="left"
          id="popover-basic"
          style={{ top: "-20px", left: `-${width}px`, maxWidth: "700px", width: `${width}px` }}
        >
          <Popover.Header as="h3" className="text-center font-bold py-[10px]" style={{ borderTopRightRadius: "0" }}>
            Misurazioni effettuate
          </Popover.Header>
          <Popover.Body>
            <Table className="align-middle text-center" bordered>
              <thead>
                <tr>
                  <th>N°</th>
                  {lavorazioni.map(lav => (
                    <th key={lav.id}>Valore {lav.nome.toLowerCase()}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {misurazioni?.map((row, idxRow) => (
                  <tr key={idxRow}>
                    <td className="font-semibold">{idxRow + 1}</td>
                    {row?.map((misurazione, idxCol) => {
                      const idx = idxRow * lavorazioni.length + idxCol
                      const lavorazione = lavorazioni[idxCol]
                      return (
                        <td key={idxCol}>
                          {initialData && misurazione.valore && (
                            <Hidden name={`${basePath}__${idx}__id`} value={misurazione.id || undefined}/>
                          )}
                          <Input
                            label={false}
                            name={`${basePath}__${idx}__valore`}
                            inputProps={{
                              className: "text-center pl-5",
                              value: misurazione.valore,
                              type: "number",
                              onChange: (e) => setMisurazioni(
                                modifyNestedObject(misurazioni, `${idxRow}__${idxCol}__valore`, e.target.value)
                              )
                            }}
                          />
                          <ErroreInput 
                            misurazione={misurazione}
                            articolo={articolo}
                            lavorazione={lavorazione}
                          />
                          {misurazione.valore && (
                            <Hidden name={`${basePath}__${idx}__lavorazione`} value={lavorazione.id}/>
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
                  <td colSpan={4}>
                    <PlusIcon 
                      onClick={() => setMisurazioni([...misurazioni, emptyRow])}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Popover.Body>
          {misurazioni[0].length === 1 && (
            <RiassuntoDati misurazioni={misurazioni} lavorazione={lavorazioni[0]} index={0} />
          )}
          {/* {lavorazioni.map((lav, idx) => (
            <RiassuntoDati misurazioni={misurazioni} lavorazione={lav} index={idx} />
          ))} */}
        </Popover>
      </div>
    </>
  )
}

function RiassuntoDati({ misurazioni, lavorazione, index }) {
  const misurazioniCompilate = misurazioni ? misurazioni.map(row => row[index]).filter(el => !!el.valore).map(el => el.valore) : 0
  const padding = misurazioni[0].length === 1 ? "py-[13px]" : "py-[5px]"
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

function ErroreInput({ misurazione, articolo, lavorazione }) {
  const lavorazioniRichieste = articolo.richieste.map(ric => ric.lavorazione)
  const hasValore = misurazione.valore !== ""
  const hasMassimoMinimo = lavorazioniRichieste.map(lav => lav.id).includes(lavorazione.id)
  if (!hasValore || !hasMassimoMinimo) return null;
  const richiesta = articolo.richieste.find(ric => ric.lavorazione.id === lavorazione.id)
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