import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Button } from "@components/shadcn/Button";
import { Input } from "@components/shadcn/Input";
import { Movimento, PaginationData } from "@interfaces/global";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ColumnDef, Table } from "@tanstack/react-table";
import { DataTable } from "@ui/full-data-table/data-table";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { PLURALS } from "../utils";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import PopoverProdotto from "../Giacenza/popover-prodotto";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";

export const columns: ColumnDef<Movimento>[] = [
  {
    accessorKey: "data",
    header: "Data",
    cell: ({ row }) =>
      new Date(row.original.data).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  },
  {
    id: "prodotto.nome",
    accessorKey: "prodotto.nome",
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
      const icon = row.original.tipo === "scarico" ? "↓" : "↑";
      const color = row.original.tipo === "scarico" ? "text-red-600" : "text-green-600";
      return <div>
        <span className={`mr-2 font-bold ${color}`}>{icon}</span>
        {quantitàUnitaria} {unità}
      </div>
    },
  },
  {
    accessorKey: "operatore",
    header: "Operatore",
    cell: ({ row }) => {
      return row.original.operatore || "-";
    },
  },
  {
    accessorKey: "destinazione",
    header: "Destinazione",
    cell: ({ row }) => {
      return row.original.destinazione || "-";
    },
    filterFn: (row, id, value) => {
      return row.original.destinazione?.includes(value) ?? false;
    }
  },
];

function TableHeader({ table, data }: { table: Table<Movimento>; data: Movimento[] }) {
  const destinazioniSet = new Set();
  data.forEach((movimento) => {
    if (!movimento.destinazione) return;
    destinazioniSet.add(movimento.destinazione);
  });
  const destinazioni: any = Array.from(destinazioniSet).map((destinazione) => ({ value: destinazione, label: destinazione }));
  destinazioni.sort((a: any, b: any) => a.value.localeCompare(b.value));
  return (
    <div className="flex items-center gap-x-4 mb-3">
      <Input
        placeholder="Cerca prodotti..."
        value={(table.getColumn("prodotto.nome")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("prodotto.nome")?.setFilterValue(event.target.value)}
        className="max-w-sm w-80 h-8"
      />
      <DataTableFacetedFilter
        column={table.getColumn("destinazione")}
        title="Destinazione"
        options={destinazioni}
      />
      {table.getState().columnFilters.length > 0 && (
        <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
          Cancella
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function UltimiMovimenti() {
  const movimentiQuery = useQuery<PaginationData<Movimento>>([URLS.MOVIMENTI, {custom_page_size: 1000}]);

  if (movimentiQuery.isError) return <Error />;
  if (movimentiQuery.isLoading || !movimentiQuery.data) return <Loading />;
  return (
    <DataTable
      columns={columns}
      data={movimentiQuery.data.results}
      Header={TableHeader}
      initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
      containerClassName="min-h-[315px]"
    />
  );
}

export default UltimiMovimenti;
