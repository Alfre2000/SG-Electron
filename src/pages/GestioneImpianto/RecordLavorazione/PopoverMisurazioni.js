import { faPlus, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Button, Form, Popover, Table } from "react-bootstrap";
import MinusIcon from "../../../components/Icons/MinusIcon/MinusIcon";
import PlusIcon from "../../../components/Icons/PlusIcon/PlusIcon";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import { modifyNestedObject } from "../../utils";

function PopoverMisurazioni({ controllo, idxControllo, initialData, view, articolo }) {
  const [misurazioni, setMisurazioni] = useState(initialData?.misurazioni ? initialData.misurazioni : [{ valore: "" }])
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null);
  useOutsideAlerter(popupRef, (e) => {
    if (e.target.parentElement.id !== `popover-${controllo.id}` && e.target.id !== `popover-${controllo.id}`) {
      setOpen(false);
    }
  });
  const misurazioniCompilate = misurazioni ? misurazioni.filter(el => !!el.valore).map(el => el.valore) : 0
  const minimo = misurazioniCompilate.length > 0 ? Math.min(...misurazioniCompilate).toFixed(2) : "-"
  const media = misurazioniCompilate.length > 0 ? (misurazioniCompilate.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / misurazioniCompilate.length).toFixed(2) : "-"
  const massimo = misurazioniCompilate.length > 0 ? Math.max(...misurazioniCompilate).toFixed(2) : "-"
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
          style={{ top: "-20px", left: "-350px", maxWidth: "350px", width: "350px" }}
        >
          <Popover.Header as="h3" className="text-center font-bold py-[10px]" style={{ borderTopRightRadius: "0" }}>
            Misurazioni effettuate
          </Popover.Header>
          <Popover.Body>
            <Table className="align-middle text-center" bordered>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Valore</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {misurazioni?.map((misurazione, idxMisurazione) => {
                  const misurazioniPath = `${idxControllo}__misurazioni__${idxMisurazione}`
                  const basePath = `record_controlli__${misurazioniPath}`
                  const sopraMassimo = articolo.richieste.length > 0 && misurazione.valore > articolo.richieste[0].spessore_massimo
                  const sottoMinimo = articolo.richieste.length > 0 && misurazione.valore < articolo.richieste[0].spessore_minimo
                  return(
                    <tr key={idxMisurazione}>
                      <td className="font-semibold">{idxMisurazione + 1}</td>
                      <td>
                        {initialData && (
                          <input hidden name={`${basePath}__id`} className="hidden" defaultValue={misurazione.id || undefined}/>
                        )}
                        <Form.Control
                          size="sm"
                          className="text-center pl-5"
                          name={`${basePath}__valore`}
                          value={misurazione.valore}
                          type="number"
                          onChange={(e) => setMisurazioni(
                            modifyNestedObject(misurazioni, `${idxMisurazione}__valore`, e.target.value)
                          )}
                        />
                        {misurazione.valore !== "" && (sopraMassimo || sottoMinimo)  && (
                          <span type="invalid" className="text-xs font-semibold text-center text-[#d48208]">
                              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" /> 
                              {sopraMassimo ? "Valore sopra il massimo" : "Valore sotto il minimo"}
                          </span>
                        )}
                      </td>
                      <td>
                        <MinusIcon 
                          disabled={view}
                          onClick={() => setMisurazioni(misurazioni.filter((_, idx) => idx !== idxMisurazione))}
                        />
                      </td>
                    </tr>
                  )
                })}
                <tr>
                  <td colSpan={4}>
                    <PlusIcon 
                      disabled={view}
                      onClick={() => setMisurazioni([...misurazioni, { valore: "" }])}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Popover.Body>
          <div className="text-center py-[13px] bg-[#f0f0f0] mt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.2)", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px"}}>
            <span>Minimo: <b>{minimo}</b></span>
            <span className="mx-3">Media: <b>{media}</b></span>
            <span>Massimo: <b>{massimo}</b></span>
          </div>
        </Popover>
      </div>
    </>
  )
}

export default PopoverMisurazioni