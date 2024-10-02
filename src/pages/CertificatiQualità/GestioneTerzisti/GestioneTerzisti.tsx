import { Fornitore, LavorazioneEsterna } from "@interfaces/global";
import { DataTable } from "@ui/query-data-table/data-table";
import { URLS } from "urls";
import { ColumnDef, Table as TableProps } from "@tanstack/react-table";
import RecordLavorazioneDialog from "features/record-lavorazione/record-lavorazione-dialog";
import { DebouncedInput } from "@components/shadcn/Input";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import { Button } from "@components/shadcn/Button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "react-query";
import { apiUpdate } from "@api/apiV2";
import { toast } from "sonner";

export const columns: ColumnDef<LavorazioneEsterna>[] = [
  {
    accessorKey: "data_ordine",
    header: "Data Ordine",
    cell: ({ row }) =>
      new Date(row.original.data_ordine).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "galvanica",
    header: "Galvanica",
    cell: ({ row }) => {
      const galvanica = row.original.galvanica;
      if (galvanica.includes("GALVANELETTRONICA")) {
        return "GALVANELETTRONICA";
      } else {
        return galvanica;
      }
    },
  },
  {
    id: "n_lotto_super",
    accessorKey: "record_lavorazione.n_lotto_super",
    header: "N° Lotto",
    cell: ({ row }) => {
      const recordID = row.original.record_lavorazione.id;
      const n_lotto = row.original.record_lavorazione.n_lotto_super;
      return <RecordLavorazioneDialog recordID={recordID} n_lotto_super={n_lotto} />;
    },
    filterFn: (row, id, value: string) => {
      return row.original.record_lavorazione.n_lotto_super.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "record_lavorazione.articolo",
    header: "Articolo",
    cell: ({ row }) => row.original.record_lavorazione.articolo,
  },
  {
    accessorKey: "quantità",
    header: "Quantità",
    cell: ({ row }) => (
      <>
        {new Intl.NumberFormat("it-IT").format(row.original.quantità)}
        {row.original.record_lavorazione.um === "KG" ? <span> Kg</span> : <span> pz</span>}
      </>
    ),
  },
  {
    id: "riconsegnato",
    header: "Riconsegnato ?",
    cell: ({ row, table }) => {
      const queryClient = (table.options.meta as any)?.queryClient;
      const n_lotto = row.original.record_lavorazione.n_lotto_super;
      const updateRiconsegnato = () =>
        apiUpdate(`${URLS.LAVORAZIONI_ESTERNE}${row.original.id}/`, { data_riconsegna: new Date().toISOString() }).then(
          () => {
            queryClient.invalidateQueries([URLS.LAVORAZIONI_ESTERNE + "?riconsegnato=false"]);
            toast.success(`${n_lotto} riconsegnato`, {
              duration: 7000,
              cancel: {
                label: "Annulla",
                onClick: () => {
                  apiUpdate(`${URLS.LAVORAZIONI_ESTERNE}${row.original.id}/`, { data_riconsegna: null }).then(() => {
                    queryClient.invalidateQueries([URLS.LAVORAZIONI_ESTERNE + "?riconsegnato=false"]);
                  });
                },
              },
            });
          }
        ).catch(() => {
          toast.error("Errore durante il salvataggio");
        }
      );
      return (
        <Button variant="outline" size="sm" onClick={updateRiconsegnato} className="shadow-none">
          Riconsegnato
        </Button>
      );
    },
  },
];

function DataTableHeader({ table, data }: { table: TableProps<LavorazioneEsterna>; data: LavorazioneEsterna[] }) {
  const galvanicheQuery = useQuery<Fornitore[]>([URLS.ALL_FORNITORI, { galvanica: true }]);
  const galvaniche =
    galvanicheQuery.data?.map((galvanica) => ({
      value: galvanica.id,
      label: galvanica.nome,
    })) ?? [];
  return (
    <div className="flex items-center gap-x-4 mb-3 overflow-x-scroll p-1">
      <DebouncedInput
        placeholder="Cerca Lotto..."
        value={(table.getColumn("n_lotto_super")?.getFilterValue() as string) ?? ""}
        onChange={(value) => {
          table.setPageIndex(0);
          table.getColumn("n_lotto_super")?.setFilterValue(value);
        }}
        className="max-w-sm w-40 h-10"
      />
      <DataTableFacetedFilter
        table={table}
        column={table.getColumn("galvanica")}
        title="Galvanica"
        options={galvaniche as any}
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

function GestioneTerzisti() {
  const queryClient = useQueryClient();
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Lavorazioni all'Esterno</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <DataTable
        columns={columns}
        endpoint={URLS.LAVORAZIONI_ESTERNE + "?riconsegnato=false"}
        containerClassName="bg-white"
        Header={DataTableHeader}
        meta={{ queryClient }}
      />
    </div>
  );
}

export default GestioneTerzisti;
