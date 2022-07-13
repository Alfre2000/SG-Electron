import React, { useState } from "react";
import { Table } from "react-bootstrap";
import ImageModal from "../../../../components/Modals/ImageModal/ImageModal";
import Sezione from "./Sezione";
const electron = window?.require ? window.require("electron") : null;

function SezioneDocumenti({ articolo }) {
  const [modalImg, setModalImg] = useState(false);
  const docs = [
    ...(articolo?.immagini_supporto || []),
    ...(articolo?.documenti_supporto || []),
  ];
  if (docs.length <= 0) return null;
  return (
    <Sezione title="Immagini e Documenti di supporto">
      <Table className="align-middle text-center" bordered>
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((documento) => (
            <tr key={documento.id}>
              <td
                className="hover:underline hover:cursor-pointer w-[50%]"
                onClick={() => {
                  if (documento.immagine) {
                    setModalImg(documento.id);
                  } else {
                    electron.ipcRenderer.invoke(
                      "open-file",
                      documento.documento
                    );
                  }
                }}
              >
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
                    <ImageModal
                      setShow={setModalImg}
                      url={documento.immagine}
                      titolo={documento.titolo}
                    />
                  )}
                </td>
              ) : (
                <td
                  className="max-w-xs hover:cursor-pointer italic hover:underline hover:underline-offset-1"
                  onClick={() =>
                    electron.ipcRenderer.invoke(
                      "open-file",
                      documento.documento
                    )
                  }
                >
                  Apri documento
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Sezione>
  );
}

export default SezioneDocumenti;
