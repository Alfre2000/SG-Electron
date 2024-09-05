"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  Table as TableType,
  PaginationState,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@components/shadcn/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";
import { Skeleton } from "@components/shadcn/Skeleton";
import { useQuery } from "react-query";
import { PaginationData } from "@interfaces/global";
import { FetchDataOptions } from "@ui/data-table/DataTable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  endpoint: string;
  meta?: any;
  Header?: React.ComponentType<{ table: TableType<TData>; data: TData[] }>;
  initialPageSize?: number;
  containerClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  endpoint,
  meta,
  Header,
  initialPageSize=15,
  containerClassName,
}: DataTableProps<TData, TValue>) {
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: initialPageSize });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const sortQuery = sorting.length > 0 ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}` : null;

  const fetchDataOptions: FetchDataOptions = {
    page: pageIndex + 1,
    custom_page_size: pageSize,
    ordering: sortQuery,
  };
  columnFilters.forEach((filter) => {
    if (filter.value) {
      fetchDataOptions[filter.id.split("__")[0]] = filter.value;
    }
  });

  const dataQuery = useQuery<PaginationData<TData>>([endpoint, fetchDataOptions], {
    keepPreviousData: true,
  });

  const ready = dataQuery.isSuccess;

  const defaultData = React.useMemo(() => [], []);

  const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);
  const table = useReactTable({
    data: dataQuery.data?.results ?? defaultData,
    columns,
    pageCount: dataQuery.data ? Math.ceil(dataQuery.data?.count / pageSize) : -1,
    meta: meta,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
  });
  return (
    <div>
      {Header && ready && <Header table={table} data={dataQuery.data.results} />}
      <div className={`${containerClassName || ""}`}>
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
              {!ready ? (
                Array.from(Array(pageSize)).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={columns.length} className="h-18 text-center py-[11px]">
                      <Skeleton className="w-full h-[22px] rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
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
      </div>
      <div className="flex items-center justify-end px-2 mt-3">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Righe per pagina</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[130px] items-center justify-center text-sm font-medium">
            Pagina {table.getState().pagination.pageIndex + 1} di {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
