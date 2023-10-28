import {
  faFileInvoice,
  faFilePdf,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import ImageModal from "../../../../components/Modals/ImageModal/ImageModal";
const electron = window?.require ? window.require("electron") : null;

function DocumentiSupporto({ articolo }) {
  const [modalImg, setModalImg] = useState(false);
  const immagini =
    articolo?.immagini_supporto?.filter(
      (img) => !img.titolo.includes("spessore")
    ) || [];
  const documenti = articolo?.documenti_supporto || [];
  const altriDocumenti = [...immagini, ...documenti].sort((a, b) =>
    a.titolo.localeCompare(b.titolo)
  );
  const openDocument = (documento) => {
    if (documento.immagine) {
      setModalImg(documento.id);
    } else {
      electron.ipcRenderer.invoke("open-file", documento.documento);
    }
  };
  return (
    <Card className="text-center min-h-[255px]">
      <Card.Header>
        <FontAwesomeIcon
          icon={faFileInvoice}
          className="mr-4 text-lg text-slate-100"
        />
        Altri documenti di supporto
      </Card.Header>
      <Card.Body className="flex flex-col">
        {altriDocumenti.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {altriDocumenti.map((documento, idx) => (
              <div key={documento.id}>
                <li
                  className="flex items-center gap-2"
                  onClick={() => openDocument(documento)}
                >
                  <span className="font-bold text-nav-blue mr-2">{idx + 1}.</span>
                  <div className="hover:underline cursor-pointer text-left">
                    <span>{documento.titolo}</span>
                    <FontAwesomeIcon
                      icon={documento.immagine ? faImage : faFilePdf}
                      className="ml-3 text-nav-blue"
                    />
                  </div>
                </li>
                {documento.id === modalImg && documento.immagine && (
                  <ImageModal
                    setShow={setModalImg}
                    url={documento.immagine}
                    titolo={documento.titolo}
                  />
                )}
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 my-auto italic">
            Nessun documento disponibile
          </p>
        )}
      </Card.Body>
    </Card>
  );
}

export default DocumentiSupporto;
