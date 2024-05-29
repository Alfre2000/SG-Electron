import { Movimento } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";


export const columns: ColumnDef<Movimento>[] = [
  {
    accessorKey: "data",
    cell: ({ row }) => new Date(row.original.data).toLocaleString("it-IT", { day: "2-digit", month: "long", year: "numeric" }),
    header: "Data",
  },
  {
    accessorKey: "prodotto.nome",
    header: "Prodotto",
  },
  {
    accessorKey: "quantità",
    header: "Quantità",
  },
  {
    accessorKey: "operatore.nome",
    header: "Operatore",
  },
  {
    accessorKey: "destinazione.nome",
    header: "Destinazione",
  }
];
