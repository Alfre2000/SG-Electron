import { Button } from "@components/shadcn/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { useQuery } from "react-query";
import Actions from "./Actions";
import { PaginationData, WithID } from "@interfaces/global";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Skeleton } from "@components/shadcn/Skeleton";
import { findNestedElement } from "@pages/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import useCustomQueries from "@hooks/useCustomQueries/useCustomQueries";
import { useImpianto } from "@contexts/UserContext";
import { findElementFromID } from "utils";

export interface ExtendedColumn<TData, TValue> extends Column<TData, TValue> {
  columnDef: ExtendedColumnDef<TData, TValue>;
}

export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  accessorKey?: string;
  label?: string;
  type?: "string" | "number" | "date" | "datetime" | "boolean";
  query?: string;
};

interface DataTableProps<TData, TValue> {
  columns: ExtendedColumnDef<TData, TValue>[];
  endpoint: string;
  options?: {
    onSuccess?: (data?: TData[]) => void;
    extraFetchOptions?: {
      [key: string]: string;
    };
    impiantoFilter?: boolean;
    canCopy?: boolean;
    canDelete?: boolean;
    azioni?: boolean;
  };
}

export interface FetchDataOptions {
  page: number;
  custom_page_size: number;
  ordering?: string | null;
  [key: string]: any;
}

function DataTable<TData extends WithID, TValue>({
  columns,
  endpoint,
  options = {},
}: DataTableProps<TData, TValue>) {
  if (!options.extraFetchOptions) options.extraFetchOptions = {};
  if (!options.impiantoFilter === undefined) options.impiantoFilter = false;
  if (options.canCopy === undefined) options.canCopy = true;
  if (options.canDelete === undefined) options.canDelete = true;
  if (options.azioni === undefined) options.azioni = true;

  columns = columns.map((column) => {
    const header = column.label ?? column.accessorKey ?? "";
    column.header = ({ column, table }: any) => (
      <DataTableColumnHeader table={table} column={column} title={header} />
    );
    if (!column.cell) {
      column.cell = ({ row, table, cell }) => {
        let value = findNestedElement(row.original, column.accessorKey ?? "");
        if (column.accessorKey && column.accessorKey.split("__").length === 2) {
          const foreignKey = column.accessorKey.split("__")[0];
          const foreignField = column.accessorKey.split("__")[1];
          const auxData = table.options?.meta?.auxQueries?.[foreignKey]?.data;
          value = findElementFromID((row.original as any)[foreignKey], auxData)[foreignField];
        }
        if (value === null || value === undefined || value === "") return "-";
        if (column.type === "date") {
          return new Date(value).toLocaleDateString();
        } else if (column.type === "datetime") {
          const date = new Date(value);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${day}/${month}/${year}, ${hours}:${minutes}`;
        } else if (column.type === "boolean") {
          return <FontAwesomeIcon className="border-0 bg-transparent" icon={value === true ? faCheck : faXmark} />;
        }
        if (typeof value === "number") {
          const finalValue = parseFloat(value.toString());
          return new Intl.NumberFormat("it-IT").format(finalValue);
        }
        if (typeof value === "string") {
          return value;
        }
        return value;
      };
    }
    return column;
  });
  if (options.azioni) {
    columns.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Actions
          record={row.original}
          view={true}
          modify={true}
          del={options.canDelete}
          copy={options.canCopy}
          endpoint={endpoint}
          onSuccess={options.onSuccess}
        />
      ),
      size: 10,
    });
  }
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 15 });
  const impianto = useImpianto();

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
  if (options.impiantoFilter === true && impianto) {
    fetchDataOptions.impianto = impianto.toString();
  }

  let queries: Record<string, string> = {};
  columns.forEach((column) => {
    if (column.query && column.accessorKey) {
      queries[column.accessorKey.split("__")[0]] = column.query;
    }
  });

  const auxQueries = useCustomQueries(queries, options.impiantoFilter) as Record<
    string,
    ReturnType<typeof useQuery>
  >;
  const dataQuery = useQuery<PaginationData<TData>>([endpoint, fetchDataOptions], {
    keepPreviousData: true,
  });

  const ready = dataQuery.isSuccess && Object.values(auxQueries).every((query) => query.isSuccess);
  console.log(dataQuery.data?.results);

  const defaultData = React.useMemo(() => [], []);

  const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  const table = useReactTable({
    data: dataQuery.data?.results ?? defaultData,
    columns,
    pageCount: dataQuery.data ? Math.ceil(dataQuery.data?.count / pageSize) : -1,
    meta: {
      auxQueries,
    },
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
    defaultColumn: {
      size: 90 / (columns.length - 1),
      minSize: 5,
      maxSize: 100,
    },
  });
  return (
    <div>
      <div className="rounded-sm text-foreground border-slate-400 border w-full">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-inherit rounded-t-sm">
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    key={header.id}
                    className={`text-center h-[41px] font-semibold hover:bg-slate-50 text-foreground text-base capitalize py-1.5 ${
                      i !== 0 && "border-l"
                    } ${
                      i !== headerGroup.headers.length - 1 ? "border-r " : ""
                    } bg-slate-50 border-b border-b-slate-400`}
                    style={{ width: `${header.getSize()}%` }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${index % 2 !== 0 ? "hover:bg-gray-50 bg-gray-50" : "hover:bg-onherit"}`}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={cell.id}
                      className={`pr-2 pl-3 text-[1rem] py-1.5 whitespace-nowrap overflow-hidden text-ellipsis text-foreground font-normal text-center ${
                        i !== 0 && "border-l"
                      } ${
                        i !== row.getVisibleCells().length - 1 ? "border-r" : "text-center px-2"
                      } hover:bg-inherit`}
                      style={{ width: `${table.getFlatHeaders()[i].getSize()}%` }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-18 text-center">
                  Nessun risultato.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                {[10, 15, 20, 30, 40, 50].map((pageSize) => (
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

export default DataTable;
