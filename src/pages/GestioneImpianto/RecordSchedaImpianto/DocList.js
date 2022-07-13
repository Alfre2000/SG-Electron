import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Row } from "react-bootstrap";
const electron = window?.require ? window.require("electron") : null;

function DocList({ documenti }) {
  return (
    <Row className="mb-4 text-left">
      <p className="uppercase font-semibold text-nav-blue text-lg">
        Documenti di supporto
      </p>
      <hr className="h-4 w-28 ml-3 pt-px pb-0.5 bg-nav-blue opacity-90" />
      <ul className="ml-4 mt-2.5">
        {documenti?.map((documento) => (
          <li
            key={documento.id}
            className="list-disc italic cursor-pointer hover:underline hover:underline-offset-1"
            onClick={() =>
              electron.ipcRenderer.invoke("open-file", documento.documento)
            }
          >
            {documento.titolo}{" "}
            <FontAwesomeIcon icon={faFilePdf} className="ml-1 text-nav-blue" />
          </li>
        ))}
      </ul>
    </Row>
  );
}

export default DocList;
