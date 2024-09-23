import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecordInserimentoLotti } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";
import RecordLavorazioneDialog from "features/record-lavorazione/record-lavorazione-dialog";

export const columns: ColumnDef<RecordInserimentoLotti>[] = [
  {
    accessorKey: "n_lotto_super",
    header: "N° Lotto Super",
    cell: ({ row }) => (
      <RecordLavorazioneDialog recordID={row.original.id} n_lotto_super={row.original.n_lotto_super} />
    ),
  },
  {
    accessorKey: "data_arrivo",
    header: "Data Ordine",
    cell: ({ row }) => {
      return new Date(row.original.data_arrivo).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "data",
    header: "Data Completamento",
    cell: ({ row }) => {
      const data = new Date(row.original.data);
      if (data.getHours() === 0 && data.getMinutes() === 0 && data.getSeconds() === 0) {
        return "-";
      }
      return data.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },
  },
  {
    accessorKey: "commento.ok",
    header: "Va bene ?",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.original.commento.ok ? (
            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
          ) : (
            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "commento.message",
    header: "Commento",
  },
];
