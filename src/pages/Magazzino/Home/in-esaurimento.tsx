import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Button } from "@components/shadcn/Button";
import { Input } from "@components/shadcn/Input";
import { Prodotto } from "@interfaces/global";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ColumnDef, Table } from "@tanstack/react-table";
import { DataTable } from "@ui/full-data-table/data-table";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import React from "react";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import PopoverProdotto from "../Giacenza/popover-prodotto";

export const columns: ColumnDef<Prodotto>[] = [
  {
    accessorKey: "prodotti_fornitori",
    filterFn: (row, id, value) => {
      const fornitori = row.original.prodotti_fornitori.map((pf) => pf.fornitore.nome_semplice).join(", ");
      return fornitori.includes(value);
    },
    header: "Fornitori",
    cell: ({ row }) => {
      return row.original.prodotti_fornitori.map((pf) => pf.fornitore.nome_semplice).join(", ");
    },
  },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      return (
        <Popover>
          <PopoverTrigger className="hover:underline">{row.original.nome}</PopoverTrigger>
          <PopoverContent className="w-[600px]">
            <PopoverProdotto prodottoId={row.original.id} />
          </PopoverContent>
        </Popover>
      );
    },
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

function TableHeader({ table, data }: { table: Table<Prodotto>; data: Prodotto[] }) {
  const fornitoriSet = new Set();
  data.forEach((prodotto: any) => {
    for (const prodotto_fornitore of prodotto.prodotti_fornitori) {
      fornitoriSet.add(prodotto_fornitore.fornitore.nome_semplice);
    }
  });
  const fornitori: any = Array.from(fornitoriSet).map((fornitore) => ({ value: fornitore, label: fornitore }));
  return (
    <div className="flex items-center gap-x-4 mb-3">
      <Input
        placeholder="Cerca prodotti..."
        value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("nome")?.setFilterValue(event.target.value)}
        className="max-w-sm w-80 h-8"
      />
      <DataTableFacetedFilter
        column={table.getColumn("prodotti_fornitori")}
        title="Fornitore"
        options={fornitori}
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

function InEsaurimento() {
  const prodottiQuery = useQuery<Prodotto[]>([URLS.PRODOTTI, { in_esaurimento: true }]);
  if (prodottiQuery.isError) return <Error />;
  if (prodottiQuery.isLoading || !prodottiQuery.data) return <Loading />;
  return (
    <DataTable
      columns={columns}
      data={prodottiQuery.data}
      Header={TableHeader}
      initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
      containerClassName="min-h-[315px]"
    />
  );
}

export default InEsaurimento;
