import { Movimento } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";
import { PLURALS } from "../utils";

export const columns: ColumnDef<Movimento>[] = [
  {
    accessorKey: "data",
    cell: ({ row }) =>
      new Date(row.original.data).toLocaleString("it-IT", { day: "2-digit", month: "long", year: "numeric" }),
    header: "Data",
  },
  {
    accessorKey: "prodotto.nome",
    header: "Prodotto",
  },
  {
    accessorKey: "quantità",
    header: "Quantità",
    cell: ({ row }) => {
      const quantità = row.original.quantità;
      const dimensioni_unitarie = row.original.prodotto.dimensioni_unitarie;
      const quantitàUnitaria = quantità / dimensioni_unitarie;
      let unità;
      if (quantitàUnitaria !== 1) {
        const nome = row.original.prodotto.nome_unità.toLowerCase()
        unità = PLURALS[nome] || nome;
      } else {
        unità = row.original.prodotto.nome_unità;
      }
      unità = unità.charAt(0).toUpperCase() + unità.slice(1);
      return `${quantitàUnitaria} ${unità}`;
    },
  },
  {
    accessorKey: "operatore",
    header: "Operatore",
  },
  {
    accessorKey: "destinazione",
    header: "Destinazione",
  },
];
