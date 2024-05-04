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
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Input } from "@components/shadcn/Input";
import { DataTablePagination } from "@ui/full-data-table/data-table-pagination";
import { Button } from "@components/shadcn/Button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "@ui/full-data-table/data-table-view-options";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import {
  faEuro,
  faFlagCheckered,
  faIndustry,
  faRightToBracket,
  faTruckArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const statuses = [
  {
    value: "PL",
    label: "Ricezione",
    icon: <FontAwesomeIcon icon={faRightToBracket} />,
  },
  {
    value: "IL",
    label: "In Lavorazione",
    icon: <FontAwesomeIcon icon={faIndustry} />,
  },
  {
    value: "L",
    label: "Completato",
    icon: <FontAwesomeIcon icon={faFlagCheckered} />,
  },
  {
    value: "C",
    label: "Consegnato",
    icon: <FontAwesomeIcon icon={faTruckArrowRight} />,
  },
  {
    value: "F",
    label: "Fatturato",
    icon: <FontAwesomeIcon icon={faEuro} />,
  },
];

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "ritardo",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    ritardo: false,
    status: false,
    articolo: true,
    data_consegna_prevista: true,
  });
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
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <div className="w-96 space-y-4">
          <Input
            placeholder="Cerca lotto..."
            value={(table.getColumn("n_lotto_super")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("n_lotto_super")?.setFilterValue(event.target.value)}
            className="max-w-sm h-8"
          />
          <Input
            placeholder="Cerca articolo..."
            value={(table.getColumn("articolo")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("articolo")?.setFilterValue(event.target.value)}
            className="max-w-sm h-8"
          />
        </div>
        <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statuses} />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Resetta
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {/* <DataTableViewOptions table={table} /> */}
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
                    <TableCell key={cell.id}>
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
      <div className="mt-5">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
