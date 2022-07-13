import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { Popover } from "react-bootstrap";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter/useOutsideAlerter";

function InfoPopup({ placement, setPopup, operazione }) {
  const op = operazione;
  const popupRef = useRef(null);
  useOutsideAlerter(popupRef, (e) => {
    if (
      e.target.parentElement.id !== "info-icon" &&
      e.target.id !== "info-icon"
    ) {
      setPopup(null);
    }
  });
  const ultimaManutenzione = op.ultima_manutenzione
    ? new Date(op.ultima_manutenzione).toLocaleDateString("default", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "nessuna";
  return (
    <Popover
      ref={popupRef}
      placement={placement}
      id="popover-basic"
      style={{ left: "-348px", top: "10px", maxWidth: "350px", width: "350px" }}
    >
      <Popover.Header
        as="h3"
        className="text-center font-bold py-[10px]"
        style={{ borderTopRightRadius: "0" }}
      >
        Informazioni Aggiuntive
      </Popover.Header>
      <Popover.Body>
        {op.intervallo_pezzi !== "-" && (
          <div>
            <div className="flex justify-between items-center mr-4">
              <h5 className="text-[16px] font-bold mb-1">Pezzi</h5>
              <FontAwesomeIcon
                icon={op.icona_pezzi}
                size="lg"
                style={{ color: op.colore_pezzi }}
              />
            </div>
            <p className="my-0.5">
              Frequenza: <b>{op.intervallo_pezzi}</b>
            </p>
            <p className="my-0.5">
              Dall'ultima {op.tipologia}: <b>{op.pezzi_da_utlima_pop}</b>
            </p>
            <p className="my-0.5">
              {op.messaggio_pezzi}:{" "}
              <b style={{ color: op.colore_pezzi }}>
                {op.pezzi_mancanti.startsWith("-")
                  ? op.pezzi_mancanti.slice(1)
                  : op.pezzi_mancanti}
              </b>
            </p>
          </div>
        )}
        {op.intervallo_pezzi !== "-" && op.intervallo_giorni !== "-" && (
          <hr className="my-3" />
        )}
        {op.intervallo_giorni !== "-" && (
          <div>
            <div className="flex justify-between items-center mr-4">
              <h5 className="text-[16px] font-bold mb-1">Giorni</h5>
              <FontAwesomeIcon
                icon={op.icona_giorni}
                size="lg"
                style={{ color: op.colore_giorni }}
              />
            </div>
            <p className="my-0.5">
              Frequenza: <b>{op.intervallo_giorni}</b>
            </p>
            <p className="my-0.5">
              Dall'ultima {op.tipologia}: <b>{op.giorni_da_utlima_pop}</b>
            </p>
            <p className="my-0.5">
              {op.messaggio_giorni}:{" "}
              <b style={{ color: op.colore_giorni }}>
                {op.giorni_mancanti.startsWith("-")
                  ? op.giorni_mancanti.slice(1)
                  : op.giorni_mancanti}
              </b>
            </p>
          </div>
        )}
      </Popover.Body>
      <div
        className="text-center py-[13px] bg-[#f0f0f0] mt-2"
        style={{
          borderTop: "1px solid rgba(0,0,0,0.2)",
          borderBottomLeftRadius: "5px",
          borderBottomRightRadius: "5px",
        }}
      >
        Ultima {op.tipologia}: <b>{ultimaManutenzione}</b>
      </div>
    </Popover>
  );
}

export default InfoPopup;
