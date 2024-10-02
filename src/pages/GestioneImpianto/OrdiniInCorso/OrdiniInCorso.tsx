import { DataTable } from "@ui/query-data-table/data-table";
import React from "react";
import { URLS } from "urls";
import { ColumnDef, Table as TableProps } from "@tanstack/react-table";
import { Cliente, RecordLavorazioneStatus } from "@interfaces/global";
import { Button } from "@components/shadcn/Button";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import { STATUS } from "../../../constants";
import { useQuery } from "react-query";
import { useImpianto } from "@contexts/UserContext";

export const columns: ColumnDef<RecordLavorazioneStatus>[] = [
  {
    accessorKey: "data_arrivo",
    header: "Data Ordine",
    cell: ({ row }) =>
      new Date(row.original.data_arrivo).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "n_lotto_super",
    header: "N° Lotto",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    accessorKey: "articolo",
    header: "Articolo",
  },
  {
    accessorKey: "quantità",
    header: "Quantità",
    cell: ({ row }) => (
      <>
        {new Intl.NumberFormat("it-IT").format(row.original.quantità)}
        {row.original.um === "KG" ? <span> Kg</span> : <span> pz</span>}
      </>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = STATUS.find((s) => s.value === row.original.status);
      return (
        <div className="flex items-center gap-x-2">
          {status?.icon} {status?.label}
        </div>
      );
    },
  },
  {
    id: "urgenza",
    header: "Note",
    cell: ({ row }) => {
      if (row.original.urgente && row.original.completata === false) {
        return (
          <div className="flex items-center gap-x-2">
            <span className="text-red-500 font-semibold">Urgente <span className="font-bold">!</span></span>
          </div>
        );
      }
    },
  },
];

function DataTableHeader({
  table,
  data,
}: {
  table: TableProps<RecordLavorazioneStatus>;
  data: RecordLavorazioneStatus[];
}) {
  const impianto = useImpianto();
  const clientiQuery = useQuery<Cliente[]>(`${URLS.CLIENTI}?impianto=${impianto}`);
  const clienti = (clientiQuery.data || [])
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map((c) => ({ value: c.id, label: c.nome }));
  return (
    <div className="flex items-center gap-x-4 mb-3 overflow-x-scroll p-1">
      <DataTableFacetedFilter
        table={table}
        column={table.getColumn("status")}
        title="Status"
        options={STATUS.slice(0, 3)}
        className="h-10 min-w-[180px] text-left justify-start shadow-none"
        sort
        width={180}
      />
      <DataTableFacetedFilter
        table={table}
        column={table.getColumn("cliente")}
        title="Cliente"
        options={clienti}
        className="h-10 min-w-40 text-left justify-start shadow-none"
        sort
        width={370}
      />
      {table.getState().columnFilters.length > 0 && (
        <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-10 px-2 lg:px-3">
          Cancella
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function OrdiniInCorso() {
  const impianto = useImpianto();
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Ordini In Corso</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <DataTable
        columns={columns}
        endpoint={`${URLS.RECORD_LAVORAZIONI_STATUS}?impianto=${impianto}&consegnato=false&ordering=-urgente,data_arrivo`}
        containerClassName="bg-white"
        Header={DataTableHeader}
      />
    </div>
  );
}

export default OrdiniInCorso;
