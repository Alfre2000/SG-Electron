import React from "react";
import { Table } from "react-bootstrap";
import Sezione from "./Sezione";

function SezioneSpessori({ articolo }) {
  if (
    !articolo.richieste.some(
      (richiesta) => richiesta.spessore_minimo || richiesta.spessore_massimo
    )
  ) {
    return null;
  }
  return (
    <Sezione title="Spessori Richiesti">
      <Table className="align-middle text-center" bordered>
        <thead>
          <tr>
            <th>Punto</th>
            {articolo.richieste.map((ric) => (
              <th key={ric.id}>{ric.lavorazione.metallo?.nome || "-"}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            {articolo.richieste.map((ric) => (
              <th key={ric.id}>
                {ric.spessore_minimo} ÷ {ric.spessore_massimo} µ
              </th>
            ))}
          </tr>
        </tbody>
      </Table>
    </Sezione>
  );
}

export default SezioneSpessori;
