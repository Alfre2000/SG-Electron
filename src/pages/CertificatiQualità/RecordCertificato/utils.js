import { max, mean, min } from "../../../utils";

export const punti = (record, test) => {
  const richieste = record.articolo.richieste;
  const res = [];
  record.record_controlli
    .find((c) => c.controllo === test.controllo)
    .misurazioni.map((m) => ({
      ...m,
      richiesta: richieste.find((r) => r.id === m.richiesta),
    }))
    .filter((m) => m.richiesta.lavorazione.id === test.lavorazione)
    .forEach((m) => {
      if (res[m.richiesta.punto - 1] === undefined) {
        res[m.richiesta.punto - 1] = [m.valore];
      } else {
        res[m.richiesta.punto - 1].push(m.valore);
      }
    });
  return res.map((misurazioni) => ({
    values: misurazioni,
    min: min(misurazioni),
    med: mean(misurazioni),
    max: max(misurazioni),
  }));
};

export const ddtNumber = (certificate_n) => {
  let val = certificate_n.split(".")[1]
  while (val && val[0] === "0") {
    val = val.slice(1)
  }
  return val
}