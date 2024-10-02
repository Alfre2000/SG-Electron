import { Movimento } from "@interfaces/global";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import PopoverProdotto from "../Giacenza/popover-prodotto";
import { PLURALS } from "../utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@components/shadcn/Card";
import { DataTable } from "@ui/full-data-table/data-table";
import { Button } from "@components/shadcn/Button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";

export const columns: ColumnDef<Movimento>[] = [
  {
    accessorKey: "data",
    cell: ({ row }) =>
      new Date(row.original.data).toLocaleString("it-IT", { day: "2-digit", month: "long", year: "numeric" }),
    header: "Data",
    filterFn: (row, id, value) => {
      const data = new Date(row.original.data).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return data.toLowerCase().includes(value.toLowerCase());
    },
    footer: "Totale",
  },
  {
    accessorKey: "prodotto.nome",
    id: "prodotto.nome",
    header: "Prodotto",
    cell: ({ row }) => {
      return (
        <Popover>
          <PopoverTrigger className="hover:underline">{row.original.prodotto.nome}</PopoverTrigger>
          <PopoverContent className="w-[600px]">
            <PopoverProdotto prodottoId={row.original.prodotto.id} />
          </PopoverContent>
        </Popover>
      );
    },
    filterFn: (row, id, value) => {
      const prodotto = row.original.prodotto.nome.toLowerCase();
      return value.map((v: any) => v.toLowerCase()).includes(prodotto);
    },
    footer: "Totale",
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
        const nome = row.original.prodotto.nome_unità.toLowerCase();
        unità = PLURALS[nome] || nome;
      } else {
        unità = row.original.prodotto.nome_unità;
      }
      unità = unità.charAt(0).toUpperCase() + unità.slice(1);
      return `${quantitàUnitaria} ${unità}`;
    },
    footer: "Totale",
  },
  {
    accessorKey: "prezzo",
    header: "Prezzo",
    cell: ({ row }) => {
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(row.original.prezzo);
    },
    footer: "Totale",
  },
];

function TableHeader({ table, data }: { table: Table<Movimento>; data: Movimento[] }) {
  const prodottiSet = new Set(data.map((movimento) => movimento.prodotto.nome));
  const prodotti = Array.from(prodottiSet).map((prodotto) => ({ label: prodotto, value: prodotto }));
  return (
    <div className="flex items-center gap-x-4 mb-3">
      <DataTableFacetedFilter column={table.getColumn("prodotto.nome")} title="Prodotto" options={prodotti} />
      {table.getState().columnFilters.length > 0 && (
        <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
          Cancella
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

type Props = {
  movimenti: Movimento[];
};

function ReportMovimentiProdotti({ movimenti }: Props) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Report Movimenti Prodotti</CardTitle>
        <CardDescription>Lista delle movimentazioni dei prodotti in magazzino.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={movimenti}
          Header={TableHeader}
          initialState={{
            pagination: {
              pageSize: 5,
              pageIndex: 0,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default ReportMovimentiProdotti;
