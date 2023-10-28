import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Table } from "react-bootstrap";
import { findElementFromID } from "../../../../utils";
import { useQuery } from "react-query";
import { URLS } from "../../../../urls";


const getRichieste = (articolo, lavorazioni) => {
  if (!articolo || !lavorazioni) return {};
  const richieste = {};
  articolo.richieste?.forEach((richiesta) => {
    const lavorazione = findElementFromID(
      richiesta.lavorazione,
      lavorazioni
    ).nome;
    if (!richieste[lavorazione]) richieste[lavorazione] = [];
    richieste[lavorazione].push(richiesta);
  });
  Object.keys(richieste).forEach((lavorazione) => {
    const isFlash = lavorazione === "Ramatura" && richieste[lavorazione].length === 1 && !richieste[lavorazione][0].spessore_minimo && !richieste[lavorazione][0].spessore_massimo
    if (isFlash) richieste[lavorazione][0].flash = true
    richieste[lavorazione] = richieste[lavorazione].sort(
      (a, b) => a.punto - b.punto
    );
  });
  return richieste;
};


function LavorazioniRichieste({ articolo }) {
  const lavorazioniQuery = useQuery([URLS.LAVORAZIONI]);
  const richieste = getRichieste(articolo, lavorazioniQuery.data);
  return (
    <Card className="">
      <Card.Header className="text-center">
        <FontAwesomeIcon
          icon={faScrewdriverWrench}
          className="mr-4 text-lg text-slate-100"
        />
        Lavorazioni Richieste
      </Card.Header>
      <Card.Body className="flex flex-col">
        <Table className="table-fixed w-full align-middle text-left" striped>
          <thead>
            <tr>
              <th className="w-[40%]">Richiesta</th>
              <th className="w-[30%] text-center">Spessore Minimo</th>
              <th className="w-[30%] text-center">Spessore Massimo</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(richieste).map(([lavorazione, richieste], idx) => (
              <>
                <tr key={lavorazione}>
                  <td
                    className="w-[40%]"
                    colSpan={richieste.length > 1 ? 3 : 0}
                  >
                    <span className="font-bold text-nav-blue mr-2">
                      {idx + 1}.
                    </span>{" "}
                    {lavorazione}
                  </td>
                  {richieste.length === 1 && !richieste[0].flash && (
                    <>
                      <td className="w-[30%] text-center">
                        {richieste[0].spessore_minimo
                          ? `${richieste[0].spessore_minimo} µ`
                          : "-"}
                      </td>
                      <td className="w-[30%] text-center">
                        {richieste[0].spessore_minimo
                          ? `${richieste[0].spessore_massimo} µ`
                          : "-"}
                      </td>
                    </>
                  )}
                  {richieste.length === 1 && richieste[0].flash && (
                    <>
                      <td className="text-center" colSpan={2}>
                        Flash
                      </td>
                    </>
                  )}
                </tr>
                {richieste.length > 1 &&
                  richieste.map((richiesta) => (
                    <tr key={richiesta.id}>
                      <td className="w-[40%]">
                        <li className="ml-10">Punto {richiesta.punto}:</li>
                      </td>
                      <td className="w-[30%] text-center">
                        {richiesta.spessore_minimo} µ
                      </td>
                      <td className="w-[30%] text-center">
                        {richiesta.spessore_massimo} µ
                      </td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default LavorazioniRichieste;
