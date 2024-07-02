"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  PaginationState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { DataTablePagination } from "@ui/full-data-table/data-table-pagination";
import { Input } from "@components/shadcn/Input";
import { Button } from "@components/shadcn/Button";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toTitle } from "@utils/main";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setProdottiOrdine: React.Dispatch<React.SetStateAction<string[]>>;
  setFornitore: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLuogo: React.Dispatch<React.SetStateAction<string | undefined>>;
}
function findCommonSuppliers(arrays: any) {
  let commonSuppliers = arrays[0];
  arrays.slice(1).forEach((array: any) => {
    commonSuppliers = commonSuppliers.filter((supplier: any) => array.includes(supplier));
  });
  return commonSuppliers;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setProdottiOrdine,
  setFornitore,
  setLuogo,
}: DataTableProps<TData, TValue>) {
  const [error, setError] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    luogo: false
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const fornitoriSet = new Set();
  data.forEach((prodotto: any) => {
    for (const prodotto_fornitore of prodotto.prodotti_fornitori) {
      fornitoriSet.add(prodotto_fornitore.fornitore.nome_semplice);
    }
  });
  const fornitori: any = Array.from(fornitoriSet).map((fornitore) => ({ value: fornitore, label: fornitore }));
  const magazziniSet = new Set<any>();
  data.forEach((prodotto: any) => {
    magazziniSet.add(prodotto.luogo);
  });
  const magazzini: any = Array.from(magazziniSet).map((magazzino) => ({ value: magazzino, label: toTitle(magazzino) }));
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });
  return (
    <div>
      <div className="flex items-center pb-4 justify-between">
        <div className="flex gap-x-4">
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
            onChange={(value) => setFornitore(value[0])}
          />
          <DataTableFacetedFilter
            column={table.getColumn("luogo")}
            title="Magazzino"
            options={magazzini}
            onChange={(value) => setLuogo(value[0])}
          />
          {table.getState().columnFilters.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                setFornitore(undefined);
                setLuogo(undefined);
              }}
              className="h-8 px-2 lg:px-3"
            >
              Cancella
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        {table.getFilteredSelectedRowModel().rows.length ? (
          <div className="flex flex-col justify-between items-end">
            <Button
              variant="secondary"
              onClick={() => {
                let fornitori: any = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.getValue("prodotti_fornitori"));
                fornitori = fornitori.map((prodotti_fornitori: any) =>
                  prodotti_fornitori.map((f: any) => f.fornitore.nome_semplice)
                );
                const common = findCommonSuppliers(fornitori);
                if (!common.length) {
                  setError("I prodotti selezionati devono avere lo stesso fornitore.");
                  setTimeout(() => setError(""), 3000);
                  return;
                }
                const names: string[] = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.getValue("nome"));
                setProdottiOrdine(names);
              }}
              className="h-8"
            >
              Ordina Prodotti
            </Button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </div>
        ) : null}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-[11px] h-10">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nessun Risultato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex mt-4 justify-between items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} di {table.getFilteredRowModel().rows.length} righe
          selezionate.
        </div>
        <div>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
