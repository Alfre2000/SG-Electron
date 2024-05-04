import {
  faEuro,
  faFlagCheckered,
  faIndustry,
  faRightToBracket,
  faTruckArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecordLavorazioneStatus } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";

const ultimaConsegna = (consegne: RecordLavorazioneStatus["consegne"]) => {
  if (consegne.length === 0) return null;
  return new Date(
    consegne.reduce((prev, current) =>
      new Date(prev.data_consegna) > new Date(current.data_consegna) ? prev : current
    ).data_consegna
  );
};

const ultimaFattura = (consegne: RecordLavorazioneStatus["consegne"]) => {
  const fatture = consegne.filter((c) => c.data_fattura);
  if (fatture.length === 0) return null;
  const dataFattura = consegne
    .filter((c) => c.data_fattura)
    .map((consegna) => new Date(consegna.data_fattura!).getTime());
  return new Date(Math.max(...dataFattura));
};

const giorniRitardo = (dataConsegna: Date, dataConsegnaPrevista: Date) => {
  const diff = dataConsegna.getTime() - dataConsegnaPrevista.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const columns: ColumnDef<RecordLavorazioneStatus>[] = [
  { accessorKey: "n_lotto_super", header: "N° Lotto" },
  { accessorKey: "articolo", header: "Articolo" },
  {
    id: "timeline",
    cell: ({ row }) => {
      const status = row.original.status;
      const progress = status === "PL" ? 0 : status === "IL" ? 1 : status === "L" ? 2 : status === "C" ? 3 : 4;
      const progressClass =
        status === "PL"
          ? "w-0"
          : status === "IL"
          ? "w-1/4"
          : status === "L"
          ? "w-1/2"
          : status === "C"
          ? "w-3/4"
          : "w-4/4";
      const dataConsegna = ultimaConsegna(row.original.consegne);
      const dataFattura = progress === 4 ? ultimaFattura(row.original.consegne) : null;
      const color = progress > 2 ? "green" : row.original.ritardo ? "red" : "blue";
      return (
        <div className="flex flex-col justify-between">
          <div className="flex items-center mt-[10px]">
            <div className="h-0.5 w-full bg-gray-700 rounded-full">
              <div className={`h-0.5 ${progressClass} bg-${color}-500 rounded-full relative`}>
                <div className={`rounded-full size-3 bg-${color}-600 absolute right-0 -top-[5px]`}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 mt-2">
            <span>
              {row.original.data_arrivo
                ? new Date(row.original.data_arrivo).toLocaleString("it-IT", { day: "2-digit", month: "long" })
                : ""}
            </span>
            <span className="text-center relative right-6">
              {row.original.data && progress > 0
                ? new Date(row.original.data).toLocaleString("it-IT", { day: "2-digit", month: "long" })
                : ""}
            </span>
            <span className="text-center relative right-2">
              {row.original.data && progress > 0
                ? new Date(row.original.data).toLocaleString("it-IT", { day: "2-digit", month: "long" })
                : ""}
            </span>
            <span className="text-right relative right-5">
              {dataConsegna ? dataConsegna.toLocaleString("it-IT", { day: "2-digit", month: "long" }) : ""}
            </span>
            <span className="text-right">
              {dataFattura ? dataFattura.toLocaleString("it-IT", { day: "2-digit", month: "long" }) : ""}
            </span>
          </div>
        </div>
      );
    },
    header: () => (
      <div className="flex justify-between">
        <span>
          Ricezione
        </span>
        <span className="relative right-4">
          In Lavorazione
        </span>
        <span className="relative right-2">
          Completato
        </span>
        <span>
          Consegnato
        </span>
        <span>
          Fatturato
        </span>
      </div>
    ),
  },
  {
    accessorKey: "data_consegna_prevista",
    cell: ({ row }) => {
      const status = row.original.status;
      const progress = status === "PL" ? 0 : status === "IL" ? 1 : status === "L" ? 2 : status === "C" ? 3 : 4;
      const ritardo =
        progress > 2 || !row.original.data_consegna_prevista
          ? ""
          : new Date(row.original.data_consegna_prevista) < new Date()
          ? giorniRitardo(new Date(), new Date(row.original.data_consegna_prevista))
          : "";
      const dataPrevista = row.original.data_consegna_prevista
        ? new Date(row.original.data_consegna_prevista).toLocaleString("it-IT", { day: "2-digit", month: "long" })
        : "";
      return (
        <div className="text-center">
          <div>{dataPrevista}</div>
          {ritardo ? (
            <div className="text-red-700 text-xs">
              {row.original.ritardo} giorn{row.original.ritardo === 1 ? "o" : "i"} di ritardo
            </div>
          ) : null}
        </div>
      );
    },
    header: () => <div className="text-center">Consegna Prevista</div>,
  },
  {
    accessorKey: "status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {accessorKey: "ritardo"}
];
