import { faCircleCheck, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { Popover } from "react-bootstrap";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter/useOutsideAlerter";

function InfoPopup({ placement, setPopup, operazione }) {
  const popupRef = useRef(null);
  useOutsideAlerter(popupRef, (e) => {
    if (e.target.parentElement.id !== "info-icon" && e.target.id !== "info-icon") {
      setPopup(null);
    }
  });
  const ultimaManutenzione = operazione.ultima_manutenzione
    ? new Date(operazione.ultima_manutenzione).toLocaleDateString("default", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "nessuna";
  const frequenzaPezzi = operazione.intervallo_pezzi.toLocaleString()
  const daUltimaPezzi = (operazione.intervallo_pezzi - operazione.pezzi_mancanti).toLocaleString()
  const iconaPezzi = operazione.pezzi_mancanti <= 0 ? faWarning : faCircleCheck
  const colorePezzi = operazione.pezzi_mancanti <= 0 ? "#960c0c" : "#058020"
  const messaggioPezzi = operazione.pezzi_mancanti <= 0 ? "Ritardo" : "Da fare tra"

  const frequenzaGiorni = operazione.intervallo_giorni
  const daUltimaGiorni = operazione.intervallo_giorni - operazione.giorni_mancanti
  const iconaGiorni = operazione.giorni_mancanti <= 0 ? faWarning : faCircleCheck
  const coloreGiorni = operazione.giorni_mancanti <= 0 ? "#960c0c" : "#058020"
  const messaggioGiorni = operazione.giorni_mancanti <= 0 ? "Ritardo" : "Da fare tra"

  let tipologia = operazione.tipologia
  if (tipologia === 'fissaggio') tipologia = 'analisi'
  return (
    <Popover
      ref={popupRef}
      placement={placement}
      id="popover-basic"
      style={{ left: "-348px", top: "10px", maxWidth: "350px", width: "350px" }}
    >
      <Popover.Header as="h3" className="text-center font-bold py-[10px]" style={{ borderTopRightRadius: "0" }}>
        Informazioni Aggiuntive
      </Popover.Header>
      <Popover.Body>
        {operazione.intervallo_pezzi && (
          <div>
            <div className="flex justify-between items-center mr-4">
              <h5 className="text-[16px] font-bold mb-1">Pezzi</h5>
              <FontAwesomeIcon icon={iconaPezzi} size="lg" style={{ color: colorePezzi }}/>
            </div>
            <p className="my-0.5">Frequenza: <b>{frequenzaPezzi} pezzi</b></p>
            <p className="my-0.5">Dall'ultima {tipologia}: <b>{daUltimaPezzi} pezzi</b></p>
            <p className="my-0.5">{messaggioPezzi}: <b style={{ color: colorePezzi }}>{Math.abs(operazione.pezzi_mancanti).toLocaleString()} pezzi</b></p>
          </div>
        )} 
        {operazione.intervallo_pezzi && operazione.intervallo_giorni && <hr className="my-3"/>}
        {operazione.intervallo_giorni && (
          <div>
            <div className="flex justify-between items-center mr-4">
              <h5 className="text-[16px] font-bold mb-1">Giorni</h5>
              <FontAwesomeIcon icon={iconaGiorni} size="lg" style={{ color: coloreGiorni }}/>
            </div>
            <p className="my-0.5">Frequenza: <b>{frequenzaGiorni.toLocaleString()} {frequenzaGiorni === 1 ? "giornio" : "giorni"}</b></p>
            <p className="my-0.5">
              Dall'ultima {tipologia}: <b>{daUltimaGiorni.toLocaleString()} {daUltimaGiorni === 1 ? "giornio" : "giorni"}</b>
            </p>
            <p className="my-0.5">
              {messaggioGiorni}: <b style={{ color: coloreGiorni }}>
                {Math.abs(operazione.giorni_mancanti).toLocaleString()} {Math.abs(operazione.giorni_mancanti) === 1 ? "giornio" : "giorni"}
              </b>
            </p>
          </div>
        )}
        
      </Popover.Body>
      <div className="text-center py-[13px] bg-[#f0f0f0] mt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.2)", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px"}}>
          Ultima {tipologia}: <b>{ultimaManutenzione}</b>
        </div>
    </Popover>
  );
}

export default InfoPopup;
