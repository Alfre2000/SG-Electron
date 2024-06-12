import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Button } from "@components/shadcn/Button";
import { Input } from "@components/shadcn/Input";
import { Operatore, Ordine } from "@interfaces/global";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ColumnDef, Table } from "@tanstack/react-table";
import { DataTable } from "@ui/full-data-table/data-table";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { URLS } from "urls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/shadcn/Dialog";
import { Label } from "@components/shadcn/Label";
import { useState } from "react";
import { apiUpdate } from "@api/apiV2";
import { toast } from "sonner";
import { getErrors } from "@api/utils";
import { Checkbox } from "@components/shadcn/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";

export const columns: ColumnDef<Ordine>[] = [
  {
    accessorKey: "data_ordine",
    header: "Data Ordine",
    cell: ({ row }) =>
      new Date(row.original.data_ordine).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "fornitore",
    header: "Fornitore",
    cell: ({ row }) => row.original.fornitore.nome,
    filterFn: (row, id, value) => {
      return row.original.fornitore.nome.includes(value);
    },
  },
  {
    accessorKey: "prodotto",
    header: "Descrizione",
    cell: ({ row }) => row.original.prodotto.nome,
    filterFn: (row, id, value) => {
      return row.original.prodotto.nome.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "quantità_testo",
    header: "Prodotto",
    cell: ({ row }) => {
      if (!row.original.quantità_testo.includes("travaso")) {
        return `${row.original.quantità_testo.replace("Nr. ", "")} da ${
          row.original.prodotto.dimensioni_unitarie
        } ${row.original.prodotto.unità_misura}`;
      }
      return row.original.quantità_testo;
    },
  },
  {
    id: "arrivato",
    header: "Arrivato ?",
    cell: ({ table, row }) => {
      return <InserimentoForm ordine={row.original} />;
    },
  },
];

function InserimentoForm({ ordine }: { ordine: Ordine }) {
  const [operatore, setOperatore] = useState<number | undefined>();
  const queryClient = useQueryClient();
  const today = new Date().toISOString();
  const mutation = useMutation(
    (data: any) =>
      apiUpdate(URLS.ORDINI + "/" + data.id + "/", {
        data_consegna: today,
        attestato: data.attestato,
        controllo_qualità: data.controllo_qualità,
        operatore: data.operatore,
      }),
    {
      onSuccess: (_, variables: any) => {
        queryClient.setQueryData<Ordine[]>(
          [URLS.ORDINI, { in_sospeso: true }],
          (data) => data?.filter((o) => o.id !== parseInt(variables.id)) || []
        );
        queryClient.invalidateQueries([URLS.PRODOTTI]);
        queryClient.invalidateQueries([URLS.MOVIMENTI]);
        toast.success("Ordine aggiornato con successo");
        setDialogOpen(false);
        setOperatore(undefined);
      },
      onError: (error) => {
        const errors = getErrors(error);
        console.log(errors);
        toast.error("Errore nell'aggiornamento dell'ordine");
      },
    }
  );
  const operatoriQuery = useQuery<Operatore[]>([URLS.OPERATORI, { can_magazzino: true }]);
  const hasDensità = ordine.prodotto.densità_minima || ordine.prodotto.densità_massima;
  const hasPh = ordine.prodotto.ph_minimo || ordine.prodotto.ph_massimo;
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="transition duration-700 ease-in-out hover:bg-green-600 hover:text-white h-7 py-1.5 px-2"
        >
          Arrivato
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ordine Consegnato</DialogTitle>
          <DialogDescription>
            Controlla che le informazioni siano corrette e conferma l'arrivo dell'ordine.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="text-sm">
            <p>
              Fornitore:<span className="font-semibold"> {ordine.fornitore.nome}</span>
            </p>
            <p>
              Prodotto:<span className="font-semibold"> {ordine.prodotto.nome}</span>
            </p>
            <p>
              Quantità:<span className="font-semibold"> {ordine.quantità_testo}</span>
            </p>
            <div className="mt-3">
              <span>Caratteristiche del prodotto:</span>
            </div>
            <ul className="list-disc list-inside">
              <li>
                Aspetto:<span className="font-semibold"> {ordine.prodotto.aspetto}</span>
              </li>
              <li>
                Colore:<span className="font-semibold"> {ordine.prodotto.colore}</span>
              </li>
              {hasDensità && (
                <li>
                  Densità:{" "}
                  <span className="font-semibold">
                    {ordine.prodotto.densità_minima} - {ordine.prodotto.densità_massima} g/cm³
                  </span>
                </li>
              )}
              {hasPh && (
                <li>
                  Ph:
                  <span className="font-semibold">
                    {" "}
                    {ordine.prodotto.ph_minimo} - {ordine.prodotto.ph_massimo}
                  </span>
                </li>
              )}
            </ul>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between items-center mr-5">
                È stato ricevuto l'Attestato di Controllo Qualità ?{" "}
                <Checkbox id="attestato" className="text-lg w-6 h-6" />
              </div>
              <div className="flex justify-between items-center mr-5">
                Nostro controllo qualità effettuato ?{" "}
                <Checkbox id="controllo_qualità" className="text-lg w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-x-2 mt-3">
            <Label className="font-normal text-sm">Operatore</Label>
            <div className="mr-5">
              <Select value={operatore?.toString()} onValueChange={(value) => setOperatore(parseInt(value))}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operatoriQuery.data?.map((op) => (
                    <SelectItem key={op.id} value={op.id.toString()}>
                      {op.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-center mt-4">
            <Button
              onClick={() => {
                const attestato =
                  document.querySelector<HTMLButtonElement>('button[id="attestato"]')?.dataset.state === "checked";
                const controllo_qualità =
                  document.querySelector<HTMLButtonElement>('button[id="controllo_qualità"]')?.dataset.state === "checked";
                const data = {
                  id: ordine.id,
                  attestato,
                  controllo_qualità,
                  operatore,
                };
                mutation.mutate(data);
              }}
            >
              Conferma
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TableHeader({ table, data }: { table: Table<Ordine>; data: Ordine[] }) {
  const fornitori = Array.from(new Set(data.map((o) => o.fornitore.nome)));
  return (
    <div className="flex items-center gap-x-4 mb-3">
      <Input
        placeholder="Cerca prodotti..."
        value={(table.getColumn("prodotto")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("prodotto")?.setFilterValue(event.target.value)}
        className="max-w-sm w-80 h-8"
      />
      <DataTableFacetedFilter
        column={table.getColumn("fornitore")}
        title="Fornitore"
        options={fornitori.map((f) => ({ value: f, label: f }))}
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

function InSospeso() {
  const ordiniQuery = useQuery<Ordine[]>([URLS.ORDINI, { in_sospeso: true }], {
    select: (data) => data.sort((a, b) => new Date(a.data_ordine).getTime() - new Date(b.data_ordine).getTime()),
  });

  if (ordiniQuery.isError) return <Error />;
  if (ordiniQuery.isLoading || !ordiniQuery.data) return <Loading />;
  return (
    <DataTable
      columns={columns}
      data={ordiniQuery.data}
      Header={TableHeader}
      initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
      containerClassName="min-h-[355px]"
    />
  );
}

export default InSospeso;
