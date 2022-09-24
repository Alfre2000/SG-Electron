import React from "react";
import { Table } from "react-bootstrap";
import Sezione from "./Sezione";

function SezioneInformazioniArticolo({ articolo }) {
  const lavorazioni = [
    ...new Set(articolo.richieste.map((ric) => ric.lavorazione.nome)),
  ].join(" - ");
  return (
    <Sezione title="Informazioni Articolo">
      <Table className="align-middle text-center" bordered>
        <thead>
          <tr>
            <th>Denominazione</th>
            <th>Codice articolo</th>
            <th>Trattamento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{articolo.nome}</td>
            <td>{articolo.codice}</td>
            <td>{lavorazioni}</td>
          </tr>
        </tbody>
      </Table>
    </Sezione>
  );
}

export default SezioneInformazioniArticolo;
