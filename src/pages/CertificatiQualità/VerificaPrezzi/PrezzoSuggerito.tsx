import { HoverCard, HoverCardContent, HoverCardTrigger } from "@components/shadcn/HoverCard";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Articolo, InfoPrezzi, RecordLavorazione } from "@interfaces/global";
import { round } from "@lib/utils";
import { toEuro, toFormattedNumber } from "@utils/main";
import React from "react";

type PrezzoSuggeritoProps = {
  record: RecordLavorazione;
  articolo: Articolo;
  infoPrezzi: InfoPrezzi;
};

const Error = ({ message }: { message: string }) => {
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger>
          <FontAwesomeIcon icon={faTriangleExclamation} className="hover:underline cursor-help text-red-700" />
        </HoverCardTrigger>
        <HoverCardContent className="py-3 pb-4 px-6 text-left">
          <h4 className="text-red-700 text-center mb-3 font-medium">Dati Mancanti</h4>
          <li className="text-xs ml-2">{message}</li>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

function PrezzoSuggerito({ record, articolo, infoPrezzi }: PrezzoSuggeritoProps) {
  const richieste = articolo.richieste.filter((r) => r.spessore_massimo);
  const lavorazioni = richieste.map((r) => r.lavorazione.nome);
  const allLavorazioni = articolo.richieste.map((r) => r.lavorazione.nome)

  const isPrezioso = allLavorazioni.includes("Doratura") || allLavorazioni.includes("Argentatura");

  const prezzo_oro_valido =
    infoPrezzi.prezzo_oro &&
    infoPrezzi.scadenza_prezzo_oro &&
    new Date(infoPrezzi.scadenza_prezzo_oro) > new Date();
  const prezzo_argento_valido =
    infoPrezzi.prezzo_argento &&
    infoPrezzi.scadenza_prezzo_argento &&
    new Date(infoPrezzi.scadenza_prezzo_argento) > new Date();

  if (!articolo.superficie || !record.quantità) {
    return <Error message="Superficie mancante" />;
  }

  if (articolo.prezzo_dmq) {
    let amount = articolo.prezzo_dmq * articolo.superficie;
    let isBelowMinimumPezzo = infoPrezzi.minimo_per_pezzo && amount < infoPrezzi.minimo_per_pezzo;
    if (infoPrezzi.minimo_per_pezzo && isBelowMinimumPezzo && !isPrezioso) {
      amount = infoPrezzi.minimo_per_pezzo;
    }
    let totale = round(amount, 4) * record.quantità;
    let isBelowMinimumRiga = infoPrezzi.minimo_per_riga && totale < infoPrezzi.minimo_per_riga;
    if (infoPrezzi.minimo_per_riga && isBelowMinimumRiga) {
      totale = infoPrezzi.minimo_per_riga;
    }
    return (
      <div>
        <HoverCard>
          <HoverCardTrigger className="font-medium">
            <div className="hover:underline cursor-help">{toEuro(totale, 2)}</div>
          </HoverCardTrigger>
          <HoverCardContent className="py-3 pb-4 px-6 w-[30rem] text-left">
            <h4 className="text-center mb-3 font-semibold">Calcolo Eseguito</h4>
            <div className="text-xs space-y-2">
              <div className="grid grid-cols-2">
                <span className="col-span-2">
                  <span className="font-semibold">Superficie:</span> {toFormattedNumber(articolo.superficie)} dm²
                  <span className="mx-2">-</span>
                  <span className="font-semibold">Prezzo al dm²:</span> {toFormattedNumber(articolo.prezzo_dmq)}{" "}
                  €/dm²
                </span>
              </div>
              <ol className="ml-3">
                {articolo.richieste.map((r, index) => (
                  <li key={index} className="list-decimal">
                    <span className="font-semibold">{r.lavorazione.nome}:</span>{" "}
                    {r.spessore_minimo && r.spessore_massimo ? (
                      <>
                        {toFormattedNumber(r.spessore_minimo)} µm ÷ {toFormattedNumber(r.spessore_massimo)} µm
                      </>
                    ) : r.spessore_massimo ? (
                      <>{toFormattedNumber(r.spessore_massimo)} µm</>
                    ) : (
                      null
                    )}
                  </li>
                ))}
              </ol>
              <hr className="w-2/3 my-3 mx-auto" />
              {isBelowMinimumRiga ? (
                <div>
                  <span className="font-semibold">Prezzo Unitario:</span> {toFormattedNumber(articolo.superficie)}{" "}
                  dm² * {toFormattedNumber(articolo.prezzo_dmq)} € / dm² ={" "}
                  <span className="font-semibold">{toEuro(round(amount, 4), 4)}</span>
                  <hr className="w-2/3 my-3 mx-auto" />
                  <span className="font-semibold">Prezzo Teorico Totale:</span> {toEuro(round(amount, 4), 4)} *{" "}
                  {toFormattedNumber(record.quantità)} ={" "}
                  <span className="font-semibold">{toEuro(amount * record.quantità, 2)}</span>
                  <div className="mt-2">
                    <span className="font-semibold">Prezzo Totale Suggerito:</span> ={" "}
                    <span className="font-semibold">{toEuro(round(totale, 2), 2)}</span>{" "}
                    <span className="ml-2 text-muted">(minimo per riga)</span>
                  </div>
                </div>
              ) : isBelowMinimumPezzo && !isPrezioso ? (
                <>
                  <div>
                    <span className="font-semibold">Prezzo Teorico:</span> {toFormattedNumber(articolo.superficie)}{" "}
                    dm² * {toFormattedNumber(articolo.prezzo_dmq)} € / dm² ={" "}
                    {toEuro(round(articolo.prezzo_dmq * articolo.superficie, 4), 4)}
                  </div>
                  <div>
                    <span className="font-semibold">Prezzo Unitario Suggerito:</span> ={" "}
                    <span className="font-semibold">{toEuro(round(amount, 4), 4)}</span>{" "}
                    <span className="ml-2 text-muted">(minimo per pezzo)</span>
                  </div>
                  <hr className="w-2/3 my-3 mx-auto" />
                  <span className="font-semibold">Prezzo Totale Suggerito:</span> {toEuro(round(amount, 4), 4)}*{" "}
                  {toFormattedNumber(record.quantità)} = <span className="font-semibold">{toEuro(totale, 2)}</span>
                </>
              ) : (
                <div>
                  <span className="font-semibold">Prezzo Unitario Suggerito:</span>{" "}
                  {toFormattedNumber(articolo.superficie)} dm² * {toFormattedNumber(articolo.prezzo_dmq)} € / dm² ={" "}
                  <span className="font-semibold">{toEuro(round(amount, 4), 4)}</span>
                  <hr className="w-2/3 my-3 mx-auto" />
                  <span className="font-semibold">Prezzo Totale Suggerito:</span> {toEuro(round(amount, 4), 4)}*{" "}
                  {toFormattedNumber(record.quantità)} = <span className="font-semibold">{toEuro(totale, 2)}</span>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    );
  }

  const hasDoratura = lavorazioni.includes("Doratura") && prezzo_oro_valido;
  const hasArgentatura = lavorazioni.includes("Argentatura") && prezzo_argento_valido;

  if (articolo.costo_manodopera && (hasArgentatura || hasDoratura)) {
    let amount = round(articolo.costo_manodopera * articolo.superficie, 4);
    const fattoreMoltiplicativo = articolo.fattore_moltiplicativo || 1;
    const richiesta = hasDoratura
      ? richieste.find((r) => r.lavorazione.nome === "Doratura")!
      : richieste.find((r) => r.lavorazione.nome === "Argentatura")!;
    if (hasDoratura) {
      amount += round(
        (infoPrezzi.prezzo_oro! *
          round(
            articolo.superficie *
              richiesta.spessore_massimo! *
              infoPrezzi.densità_oro *
              fattoreMoltiplicativo *
              10,
            2
          )) /
          1000,
        4
      );
    } else if (hasArgentatura) {
      amount += round(
        (infoPrezzi.prezzo_argento! *
          round(
            articolo.superficie *
              richiesta.spessore_massimo! *
              infoPrezzi.densità_argento *
              fattoreMoltiplicativo *
              10,
            2
          )) /
          1000,
        4
      );
    }
    let isBelowMinimumPezzo = infoPrezzi.minimo_per_pezzo && amount < infoPrezzi.minimo_per_pezzo;
    if (infoPrezzi.minimo_per_pezzo && isBelowMinimumPezzo && !isPrezioso) {
      amount = infoPrezzi.minimo_per_pezzo;
    }
    let totale = round(amount, 4) * record.quantità;
    let isBelowMinimumRiga = infoPrezzi.minimo_per_riga && totale < infoPrezzi.minimo_per_riga;
    if (infoPrezzi.minimo_per_riga && isBelowMinimumRiga) {
      totale = infoPrezzi.minimo_per_riga;
    }
    return (
      <div>
        <HoverCard>
          <HoverCardTrigger className="font-medium">
            <div className="hover:underline cursor-help">{toEuro(totale, 2)}</div>
          </HoverCardTrigger>
          <HoverCardContent className="py-3 pb-4 px-6 w-[30rem] text-left">
            <h4 className="text-center mb-3 font-semibold">Calcolo Eseguito</h4>
            <div className="text-xs space-y-2">
              <div className="grid grid-cols-2">
                <span className="col-span-2">
                  <span className="font-semibold">Superficie:</span> {toFormattedNumber(articolo.superficie)} dm²
                  <span className="mx-2">-</span>
                  <span className="font-semibold">Fattore Moltiplicativo:</span>{" "}
                  {toFormattedNumber(fattoreMoltiplicativo)}
                </span>
              </div>
              {hasArgentatura && (
                <div>
                  <span className="font-semibold">Argento:</span> {toFormattedNumber(infoPrezzi.prezzo_argento!)}{" "}
                  €/kg - <span className="font-semibold">Densità:</span>{" "}
                  {toFormattedNumber(infoPrezzi.densità_argento)} g/cm³
                </div>
              )}
              {hasDoratura && (
                <div>
                  <span className="font-semibold">Oro:</span> {toFormattedNumber(infoPrezzi.prezzo_oro!)} €/g -{" "}
                  <span className="font-semibold">Densità:</span> {toFormattedNumber(infoPrezzi.densità_oro)} g/cm³
                </div>
              )}
              <ol className="ml-3">
                {richieste.map((r, index) => (
                  <li key={index} className="list-decimal">
                    <span className="font-semibold">{r.lavorazione.nome}:</span> {r.spessore_massimo} µm
                  </li>
                ))}
              </ol>
              <hr className="w-2/3 my-3 mx-auto" />
              {hasArgentatura && (
                <>
                  <div>
                    <span className="font-semibold">Peso Argento:</span> {toFormattedNumber(articolo.superficie)}{" "}
                    dm² * {toFormattedNumber(richiesta.spessore_massimo!)} µm *{" "}
                    {toFormattedNumber(infoPrezzi.densità_argento)} g/cm³ *{" "}
                    {toFormattedNumber(fattoreMoltiplicativo)} * 10 ={" "}
                    {round(
                      articolo.superficie! *
                        richiesta.spessore_massimo! *
                        infoPrezzi.densità_argento *
                        10 *
                        fattoreMoltiplicativo,
                      2
                    )}{" "}
                    mg
                  </div>
                  <div>
                    <span className="font-semibold">Prezzo Argento:</span>{" "}
                    {round(
                      articolo.superficie! *
                        richiesta.spessore_massimo! *
                        infoPrezzi.densità_argento *
                        10 *
                        fattoreMoltiplicativo,
                      2
                    )}{" "}
                    mg / 1000 * {infoPrezzi.prezzo_argento} €/g ={" "}
                    {round(
                      (infoPrezzi.prezzo_argento! *
                        round(
                          articolo.superficie! *
                            richiesta.spessore_massimo! *
                            infoPrezzi.densità_argento *
                            10 *
                            fattoreMoltiplicativo,
                          2
                        )) /
                        1000,
                      4
                    )}{" "}
                    €
                  </div>
                </>
              )}
              {hasDoratura && (
                <>
                  <div>
                    <span className="font-semibold">Peso Oro:</span> {toFormattedNumber(articolo.superficie)} dm² *{" "}
                    {toFormattedNumber(richiesta.spessore_massimo!)} µm *{" "}
                    {toFormattedNumber(infoPrezzi.densità_oro)} g/cm³ * {toFormattedNumber(fattoreMoltiplicativo)}{" "}
                    * 10 ={" "}
                    {round(
                      articolo.superficie! *
                        richiesta.spessore_massimo! *
                        infoPrezzi.densità_oro *
                        10 *
                        fattoreMoltiplicativo,
                      2
                    )}{" "}
                    mg
                  </div>
                  <div>
                    <span className="font-semibold">Prezzo Oro:</span>{" "}
                    {round(
                      articolo.superficie! *
                        richiesta.spessore_massimo! *
                        infoPrezzi.densità_oro *
                        10 *
                        fattoreMoltiplicativo,
                      2
                    )}{" "}
                    mg / 1000 * {infoPrezzi.prezzo_oro} €/g ={" "}
                    {toEuro(
                      round(
                        (infoPrezzi.prezzo_oro! *
                          round(
                            articolo.superficie! *
                              richiesta.spessore_massimo! *
                              infoPrezzi.densità_oro *
                              10 *
                              fattoreMoltiplicativo,
                            2
                          )) /
                          1000,
                        4
                      ),
                      4
                    )}
                  </div>
                </>
              )}
              <div>
                <span className="font-semibold">Costo Manodopera:</span>{" "}
                {toFormattedNumber(articolo.costo_manodopera)} €/dm² * {toFormattedNumber(articolo.superficie)} dm²
                = {toEuro(round(articolo.costo_manodopera * articolo.superficie, 4), 4)}
              </div>
              <hr className="w-2/3 my-3 mx-auto" />
              <div>
                <span className="font-semibold">Prezzo Unitario:</span> {toEuro(round(amount, 4), 4)}
              </div>
              {isBelowMinimumRiga ? (
                <div>
                  <hr className="w-2/3 my-3 mx-auto" />
                  <span className="font-semibold">Prezzo Teorico Totale:</span> {toEuro(round(amount, 4), 4)} *{" "}
                  {toFormattedNumber(record.quantità)} ={" "}
                  <span className="font-semibold">{toEuro(amount * record.quantità, 2)}</span>
                  <div className="mt-2">
                    <span className="font-semibold">Prezzo Totale Suggerito:</span> ={" "}
                    <span className="font-semibold">{toEuro(round(totale, 2), 2)}</span>{" "}
                    <span className="ml-2 text-muted">(minimo per riga)</span>
                  </div>
                </div>
              ) : isBelowMinimumPezzo && !isPrezioso ? (
                <>
                  <div>
                    <span className="font-semibold">Prezzo Unitario Suggerito:</span> ={" "}
                    <span className="font-semibold">{toEuro(round(amount, 4), 4)}</span>{" "}
                    <span className="ml-2 text-muted">(minimo per pezzo)</span>
                  </div>
                  <hr className="w-2/3 my-3 mx-auto" />
                  <span className="font-semibold">Prezzo Totale Suggerito:</span> {toEuro(round(amount, 4), 4)}*{" "}
                  {toFormattedNumber(record.quantità)} = <span className="font-semibold">{toEuro(totale, 2)}</span>
                </>
              ) : (
                <>
                  <hr className="w-2/3 my-3 mx-auto" />
                  <span className="font-semibold">Prezzo Totale Suggerito:</span> {toEuro(round(amount, 4), 4)}*{" "}
                  {toFormattedNumber(record.quantità)} = <span className="font-semibold">{toEuro(totale, 2)}</span>
                </>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    );
  }

  const mancaSpessoreArgento = articolo.richieste.some(
    (r) => r.lavorazione.nome === "Argentatura" && (!r.spessore_massimo)
  );
  if (mancaSpessoreArgento) {
    return <Error message="Manca lo spessore per l'argentatura oppure il prezzo a dm²" />;
  }
  const mancaSpessoreOro = articolo.richieste.some(
    (r) => r.lavorazione.nome === "Doratura" && (!r.spessore_massimo)
  );
  if (mancaSpessoreOro) {
    return <Error message="Manca lo spessore per la doratura oppure il prezzo a dm²" />;
  }
  if (!articolo.prezzo_dmq) {
    return <Error message="Manca il prezzo a dm²" />;
  }
  return <Error message="Dati mancanti" />;
}

export default PrezzoSuggerito;
