import { Checkbox } from "@components/shadcn/Checkbox";
import { Prodotto } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";


export const columns: ColumnDef<Prodotto>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="size-6"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="size-6"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "prodotti_fornitori",
    filterFn: (row, id, value) => {
      const fornitori = row.original.prodotti_fornitori.map((pf) => pf.fornitore.nome).join(", ");
      return fornitori.includes(value);
    },
    header: "Fornitori",
    cell: ({ row }) => {
      return row.original.prodotti_fornitori.map((pf) => pf.fornitore.nome).join(", ");
    }
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "scorta_minima",
    header: "Scorta Minima",
    cell: ({ row }) => {
      const scorta_minima = row.original.scorta_minima;
      const dimensioni_unitarie = row.original.dimensioni_unitarie;
      return `${(scorta_minima / dimensioni_unitarie).toFixed(0)}`;
    }
  },
  {
    accessorKey: "scorta_magazzino",
    header: "Scorta Magazzino",
    cell: ({ row }) => {
      const scorta_magazzino = row.original.scorta_magazzino;
      const scorta_ordinata = row.original.scorta_ordinata;
      const scorta_minima = row.original.scorta_minima;
      const color = scorta_magazzino + scorta_ordinata < scorta_minima ? "text-red-500" : "";
      const dimensioni_unitarie = row.original.dimensioni_unitarie;
      return <span className={color}>{`${(scorta_magazzino / dimensioni_unitarie).toFixed(0)}`}</span>;
    }
  },
  {
    accessorKey: "scorta_ordinata",
    header: "Scorta Ordinata",
    cell: ({ row }) => {
      const scorta_ordinata = row.original.scorta_ordinata;
      const dimensioni_unitarie = row.original.dimensioni_unitarie;
      if (scorta_ordinata === 0) {
        return "-"
      }
      return `${(scorta_ordinata / dimensioni_unitarie).toFixed(0)}`;
    }
  },
];
