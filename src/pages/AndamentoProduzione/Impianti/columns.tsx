import { RecordTelaio } from "@interfaces/isa";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<RecordTelaio>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dataInizio",
    header: "Data Inizio",
    cell: ({ row }) => {
      return new Date(row.original.dataInizio).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "dataFine",
    header: "Data Fine",
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === "N" || status === "U") return ''
      return new Date(row.original.dataFine).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "PartNumber",
    header: "Codice Trattamento",
  },
  {
    accessorKey: "Pieces",
    header: "N° Pezzi",
  },
];
