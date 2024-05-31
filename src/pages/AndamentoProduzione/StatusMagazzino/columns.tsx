import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecordLavorazioneStatus } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<RecordLavorazioneStatus>[] = [
  {
    accessorKey: "data_arrivo",
    header: "Data Arrivo",
    cell: ({ row }) =>
      new Date(row.original.data_arrivo).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  { accessorKey: "n_lotto_super", header: "N° Lotto" },
  { accessorKey: "cliente", header: "Cliente" },
  { accessorKey: "impianto", header: "Impianto" },
  { accessorKey: "articolo", header: "Articolo" },
  {
    accessorKey: "completata",
    header: "Completata",
    cell: ({ row }) => (
      <FontAwesomeIcon
        icon={row.original.completata ? faCheck : faTimes}
        className={`${row.original.completata ? "text-green-500" : "text-red-500"} text-lg relative left-6`}
      />
    ),
  },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "ritardo", header: "Ritardo" },
  {
    accessorKey: "status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  { accessorKey: "ritardo" },
];
