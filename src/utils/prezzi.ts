import { Articolo, InfoPrezzi, RecordLavorazione } from "@interfaces/global";
import { round } from "@lib/utils";

export const prezzoSuggerito = (record: RecordLavorazione, articolo: Articolo, infoPrezzi: InfoPrezzi) => {
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
    return null;
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
    return round(totale, 2);
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
    return round(totale, 2);
  }
};
