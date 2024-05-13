import { Barra } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Barra>[] = [
  {
    accessorKey: "codice",
    header: "ID",
  },
  {
    accessorKey: "inizio",
    header: "Data Inizio",
    cell: ({ row }) => {
      return new Date(row.original.inizio).toLocaleString("it-IT", {
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
      if (!row.original.fine) return "";
      return new Date(row.original.fine).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "articolo",
    header: "Codice Trattamento",
  },
  {
    accessorKey: "ciclo",
    header: "Ciclo",
  },
];
