import { RecordLavorazioneStatus } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";

const giorniRitardo = (dataConsegna: Date, dataConsegnaPrevista: Date) => {
  const diff = dataConsegna.getTime() - dataConsegnaPrevista.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const columns: ColumnDef<RecordLavorazioneStatus>[] = [
  {
    accessorKey: "data_arrivo",
    header: "Data Arrivo",
    cell: ({ row }) => new Date(row.original.data_arrivo).toLocaleString("it-IT", { day: "2-digit", month: "long", year: "numeric" }),
  },
  { accessorKey: "n_lotto_super", header: "N° Lotto" },
  { accessorKey: "cliente", header: "Cliente" },
  { accessorKey: "impianto", header: "Impianto" },
  // { accessorKey: "lavorazione", header: "Lavorazioni" },
  { accessorKey: "articolo", header: "Articolo" },
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
  { accessorKey: "ritardo" },
];
