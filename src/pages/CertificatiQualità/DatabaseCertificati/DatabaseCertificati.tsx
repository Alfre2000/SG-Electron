import Wrapper from "@ui/wrapper/Wrapper";
import { PaginationData, RecordCertificato } from "@interfaces/global";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@components/shadcn/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Input } from "@components/shadcn/Input";
import { useQuery } from "react-query";
import { URLS } from "urls";
import React from "react";
import { Skeleton } from "@components/shadcn/Skeleton";
import { FetchDataOptions } from "@ui/data-table/DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/shadcn/Card";
import { Label } from "@components/shadcn/Label";
import NewSearchSelect from "@components/form-components/NewSearchSelect";
import { searchOptions } from "utils";
import { MESI, STATUS } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import RecordLavorazioneDialog from "features/record-lavorazione/record-lavorazione-dialog";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    // eslint-disable-line
    setDialog?: React.Dispatch<React.SetStateAction<RecordCertificato | null>>;
  }
}

const columns: ColumnDef<RecordCertificato>[] = [
  {
    accessorKey: "data",
    header: "Data",
    size: 15,
    cell: ({ row }) =>
      new Date(row.getValue("data")).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    size: 15,
  },
  {
    accessorKey: "articolo",
    header: "Articolo",
    size: 20,
  },
  {
    accessorKey: "n_lotto_super",
    header: "N° Lotto",
    size: 15,
    cell: ({ row }) => (
      <RecordLavorazioneDialog recordID={row.original.id} n_lotto_super={row.original.n_lotto_super} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 15,
    cell: ({ row }) => {
      return STATUS.find((s) => s.value === row.getValue("status"))?.label ?? "-";
    },
  },
  {
    accessorKey: "certificato",
    header: () => <div className="text-center">Certificato</div>,
    cell: ({ row }) => {
      const certificato = row.getValue("certificato");
      if (!certificato) return <div className="text-center">-</div>;
      return (
        <div className="text-center">
          <FontAwesomeIcon icon={faFilePdf} className="text-nav-blue text-lg" />
        </div>
      );
    },
    size: 10,
  },
];

function DatabaseCertificati() {
  const anni = Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2023 + i);
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 15 });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const clientiQuery = useQuery([URLS.CLIENTI]);

  const fetchOptions: FetchDataOptions = { page: pageIndex + 1, custom_page_size: pageSize };
  columnFilters.forEach((filter) => {
    if (filter.value) {
      fetchOptions[filter.id.split("__")[0]] = filter.value;
    }
  });
  const dataQuery = useQuery<PaginationData<RecordCertificato>>([URLS.RECORD_CERTIFICATI, fetchOptions], {
    keepPreviousData: true,
  });

  const defaultData = React.useMemo(() => [], []);
  const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);
  const table = useReactTable({
    data: dataQuery.data?.results ?? defaultData,
    columns,
    pageCount: dataQuery.data ? Math.ceil(dataQuery.data?.count / pageSize) : -1,
    state: {
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualFiltering: true,
    defaultColumn: {
      size: 90 / (columns.length - 1),
      minSize: 5,
      maxSize: 100,
    },
  });
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full mb-20">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Database Certificati</h2>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Filtra Risultati</CardTitle>
            <CardDescription>Seleziona i filtri per trovare i certificati richiesti.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-x-8 gap-y-4 mb-3">
            <NewSearchSelect
              options={searchOptions(clientiQuery.data, "nome")}
              label="Cliente"
              onChange={(e) => {
                table.getColumn("cliente")?.setFilterValue(e?.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
            <div>
              <Label className="mb-1.5">Articolo</Label>
              <Input
                value={(table.getColumn("articolo")?.getFilterValue() as string) ?? ""}
                onChange={(event) => {
                  table.getColumn("articolo")?.setFilterValue(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full h-8"
                style={{ borderColor: "#000000 !important" }}
              />
            </div>
            <div className="flex flex-col">
              <Label className="mb-1.5">Status</Label>
              <div className="text-left mt-1 w-full">
                <DataTableFacetedFilter
                  className="w-full justify-start"
                  column={table.getColumn("status")}
                  title="Status"
                  options={STATUS}
                  onChange={() => {
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  }}
                />
              </div>
            </div>
            <NewSearchSelect
              options={anni.map((a) => ({ label: a, value: a }))}
              label="Anno"
              onChange={(e) => {
                setColumnFilters((prev) => [...prev, { id: "anno", value: e?.value }]);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
            <NewSearchSelect
              options={MESI.map((a, idx) => ({ label: a, value: idx + 1 }))}
              label="Mese"
              onChange={(e) => {
                setColumnFilters((prev) => [...prev, { id: "mese", value: e?.value }]);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            />
            <div>
              <Label className="mb-1.5">N° Lotto</Label>
              <Input
                value={(table.getColumn("n_lotto_super")?.getFilterValue() as string) ?? ""}
                onChange={(event) => {
                  table.getColumn("n_lotto_super")?.setFilterValue(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full h-8"
                style={{ borderColor: "#000000 !important" }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="mb-4 min-h-[835px]">
          <CardHeader>
            <CardTitle>Database Certificati</CardTitle>
            <CardDescription>I risultati della ricerca effettuata.</CardDescription>
          </CardHeader>
          <CardContent className="mb-10">
            <div className="rounded-md border overflow-hidden block">
              <Table className="table-fixed">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-inherit rounded-t-sm">
                      {headerGroup.headers.map((header, i) => (
                        <TableHead key={header.id} style={{ width: `${header.getSize()}%` }}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {!dataQuery.isSuccess ? (
                    Array.from(Array(pageSize)).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell colSpan={columns.length} className="px-4 py-2">
                          <Skeleton className="w-full h-[22px] rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell, i) => (
                          <TableCell
                            key={cell.id}
                            className={`px-4 py-2 truncate ${
                              i === 1 || i === 2
                                ? "hover:overflow-visible hover:whitespace-[unset] hover:absolute hover:bg-[#f8fafc]"
                                : i === 6
                                ? "py-0"
                                : ""
                            }`}
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
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

export default DatabaseCertificati;
