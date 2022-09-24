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
  let lavorazioni = {};
  articolo.richieste.forEach(
    (ric) => (lavorazioni[ric.lavorazione.nome] = ric.lavorazione)
  );

  const punti = Math.max(...articolo.richieste.map((ric) => ric.punto));
  return (
    <Sezione title="Spessori Richiesti">
      <Table className="align-middle text-center" bordered>
        <thead>
          <tr>
            <th>Punto</th>
            {Object.values(lavorazioni).map((lavorazione) => (
              <th key={lavorazione.id}>{lavorazione.metallo?.nome || "-"}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(punti)].map((_, punto) => (
            <tr key={punto}>
              <td>{punto + 1}</td>
              {Object.values(lavorazioni).map((lav) => {
                const richiesta = articolo.richieste.find(
                  (ric) =>
                    ric.punto === punto + 1 && ric.lavorazione.id === lav.id
                );
                return (
                  <td key={lav.id}>
                    {richiesta && (
                      <>
                        {richiesta.spessore_minimo} ÷{" "}
                        {richiesta.spessore_massimo} µ
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </Sezione>
  );
}

export default SezioneSpessori;
