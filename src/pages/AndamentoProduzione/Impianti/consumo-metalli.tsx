import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@components/shadcn/Card";
import { DataTable } from "@ui/query-data-table/data-table";
import { Cliente, RecordConsumo } from "@interfaces/global";
import { URLS } from "urls";
import { ColumnDef, Table as TableProps } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faInfoCircle,
  faMinus,
  faSearch,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@components/shadcn/Input";
import { DataTableFacetedFilter } from "@ui/full-data-table/data-table-faceted-filter";
import { Button } from "@components/shadcn/Button";
import { CaretDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/shadcn/Dialog";
import { Alert } from "@components/shadcn/Alert";
import { toEuro, toFormattedNumber } from "@utils/main";
import Fieldset from "@components/form/Fieldset";
import { durata, peso, round } from "@lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@components/shadcn/Collapsible";
import { PopoverBarra } from "./columns";
import { useQuery } from "react-query";
import { useState } from "react";
import { Label } from "@components/shadcn/Label";

export const columns: ColumnDef<RecordConsumo>[] = [
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
    accessorKey: "n_lotto_super",
    header: "Lotto",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    filterFn: (row, id, value: string[]) => {
      return value.some((word: string) => row.original.cliente.toLowerCase().includes(word.toLowerCase()));
    },
  },
  {
    accessorKey: "trattamenti",
    header: "Trattamento",
    cell: ({ row }) => {
      const trattamenti = row.original.trattamenti;
      if (trattamenti.includes("Doratura")) return "Doratura";
      if (trattamenti.includes("Argentatura")) return "Argentatura";
      return trattamenti;
    },
    filterFn: (row, id, value: string[]) => {
      return value.some((word: string) => row.original.trattamenti.toLowerCase().includes(word.toLowerCase()));
    },
  },
  {
    accessorKey: "prezzo",
    header: "Prezzo",
    cell: ({ row }) => {
      if (!row.original.prezzo) return "-";
      return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(row.original.prezzo);
    },
  },
  {
    accessorKey: "consumo_metalli",
    header: "Consumo Metalli",
    cell: ({ row }) => {
      if (!row.original.consumo_metalli) return "-";
      const prezzo = row.original.prezzo || 0;
      const costo = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(row.original.consumo_metalli);
      const loosing = prezzo < row.original.consumo_metalli;
      const textColor = loosing ? "text-red-600" : "text-foreground";
      return (
        <div>
          <span className={textColor}>{costo}</span>
          {loosing && <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 ml-2" />}
        </div>
      );
    },
  },
  {
    accessorKey: "margine",
    id: "margine",
    header: "Margine",
    cell: ({ row }) => {
      if (!row.original.consumo_metalli) return "-";
      const prezzo = row.original.prezzo || 0;
      const consumo = row.original.consumo_metalli;
      const marginePercentuale = (prezzo - consumo) / prezzo;
      let textColor = "text-foreground";
      if (marginePercentuale > 0) {
        textColor = "text-green-600";
      } else if (marginePercentuale < 0) {
        textColor = "text-red-600";
      } else if (marginePercentuale < 0.2) {
        textColor = "text-orange-600";
      }
      return (
        <span className={textColor}>
          {new Intl.NumberFormat("it-IT", {
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(marginePercentuale)}
        </span>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true;
      if (value.includes("none") && (!row.original.prezzo || !row.original.consumo_metalli)) return true;
      if (!row.original.prezzo || !row.original.consumo_metalli) return false;
      if (value.includes("positive") && row.original.prezzo > row.original.consumo_metalli) return true;
      if (value.includes("negative") && row.original.prezzo < row.original.consumo_metalli) return true;
      return false;
    },
  },
  {
    accessorKey: "barre",
    header: "Barre",
    cell: ({ row }) => {
      const prezzo = row.original.prezzo || 0;
      const consumo = row.original.consumo_metalli;
      const marginePercentuale = (prezzo - consumo) / prezzo;
      let textColor = "text-foreground";
      if (marginePercentuale > 0) {
        textColor = "text-green-600";
      } else if (marginePercentuale < 0) {
        textColor = "text-red-600";
      } else if (marginePercentuale < 0.2) {
        textColor = "text-orange-600";
      }
      const barre = row.original.barre.sort((a, b) => b.codice.localeCompare(a.codice));
      const hasMultipleLotti = barre.some((barra) => barra.record_lavorazione!.split(", ").length > 1);
      const mg_metallo = barre.reduce((acc, barra) => acc + barra.mg_metallo, 0);
      return (
        <Dialog>
          <DialogTrigger>
            <FontAwesomeIcon icon={faSearch} className="scale-x-[-1] ml-2" />
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-scroll">
            <DialogHeader>
              <DialogTitle>Lotto n° {row.original.n_lotto_super}</DialogTitle>
              <hr className="mt-2 mx-auto w-2/3" />
              <DialogDescription className="text-foreground mt-4 px-8 pb-2">
                {hasMultipleLotti && (
                  <Alert className="bg-orange-100/90 border-orange-200 py-3 mb-4">
                    <span className="text-orange-800">
                      I dati mostrati sono indicativi perchè in almeno una bagnata erano presenti più lotti
                      diversi.
                    </span>
                  </Alert>
                )}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-32 text-left">Cliente:</h4>
                      <span>{row.original.cliente}</span>
                    </div>
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-32 text-left">Articolo:</h4>
                      <span>{row.original.articolo}</span>
                    </div>
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-32 text-left">Trattamenti:</h4>
                      <span>{row.original.trattamenti}</span>
                    </div>
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-32 text-left">Quantità:</h4>
                      <span>
                        {toFormattedNumber(row.original.quantità)}
                        {row.original.um === "KG" ? <span> Kg</span> : <span> pz</span>}
                      </span>
                    </div>
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-32 text-left">Superficie Totale:</h4>
                      <span>
                        {row.original.superficie && row.original.um === "N"
                          ? toFormattedNumber(Math.round(row.original.superficie * row.original.quantità)) + " dm²"
                          : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-36 text-left">Data Lavorazione:</h4>
                      <span>
                        {new Date(row.original.data).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-36 text-left">Prezzo:</h4>
                      <span>{row.original.prezzo ? toEuro(row.original.prezzo) : "-"}</span>
                    </div>
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-36 text-left">Costo Metalli:</h4>
                      <span>{row.original.consumo_metalli ? toEuro(row.original.consumo_metalli) : "-"}</span>
                    </div>
                    <div className="flex justify-start items-center gap-x-2">
                      <h4 className="font-semibold w-36 text-left">Margine:</h4>
                      {row.original.consumo_metalli ? (
                        <span className={textColor}>
                          {new Intl.NumberFormat("it-IT", {
                            style: "percent",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(marginePercentuale)}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </div>
                {Object.keys(row.original.richieste).length > 0 && (
                  <div className="text-left mt-4">
                    <h4 className="font-semibold">Spessore Richiesto vs Spessore Effettivo</h4>
                    <div className="rounded-md border mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="h-8">Trattamento</TableHead>
                            <TableHead className="h-8">Spessore Minimo</TableHead>
                            <TableHead className="h-8">Spessore Massimo</TableHead>
                            <TableHead className="h-8">Spessore Effettivo</TableHead>
                            <TableHead className="h-8">Spessore Misurato</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(row.original.richieste).map(([trattamento, richiesta]) => {
                            const spessoreEffettivo =
                              mg_metallo / row.original.superficie / row.original.quantità / 193.2;
                            const colorSpessoreEffettivo =
                              spessoreEffettivo < (richiesta.spessore_minimo ?? 0)
                                ? "text-orange-600"
                                : spessoreEffettivo > (richiesta.spessore_massimo ?? 0)
                                ? "text-red-600"
                                : "text-green-600";
                            const colorSpessoreMisurato = !row.original.spessore_misurato
                              ? "text-foreground"
                              : row.original.spessore_misurato < (richiesta.spessore_minimo ?? 0)
                              ? "text-orange-600"
                              : row.original.spessore_misurato > (richiesta.spessore_massimo ?? 0)
                              ? "text-red-600"
                              : "text-green-600";
                            return (
                              <TableRow key={trattamento}>
                                <TableCell className="py-2">{trattamento}</TableCell>
                                <TableCell className="py-2">
                                  {richiesta.spessore_minimo
                                    ? toFormattedNumber(richiesta.spessore_minimo) + " µm"
                                    : "-"}
                                </TableCell>
                                <TableCell className="py-2">
                                  {richiesta.spessore_massimo
                                    ? toFormattedNumber(richiesta.spessore_massimo) + " µm"
                                    : "-"}
                                </TableCell>
                                <TableCell className="py-2">
                                  {row.original.superficie && mg_metallo > 0 && row.original.um === "N" ? (
                                    <span className={colorSpessoreEffettivo}>
                                      {toFormattedNumber(round(spessoreEffettivo, 2)) + " µm"}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                                <TableCell className="py-2">
                                  {row.original.superficie && mg_metallo > 0 && row.original.um === "N" ? (
                                    <span className={colorSpessoreMisurato}>
                                      {row.original.spessore_misurato
                                        ? toFormattedNumber(round(row.original.spessore_misurato, 2)) + " µm"
                                        : "-"}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  {barre.length === 0 ? (
                    <Alert className="bg-sky-100/90 border-sky-200 flex justify-center items-center gap-x-3">
                      <div>
                        <FontAwesomeIcon icon={faInfoCircle} className="text-sky-500" />
                      </div>
                      <span className="text-sky-800">Non ci sono barre associate a questo lotto</span>
                    </Alert>
                  ) : (
                    barre.map((barra, index) => (
                      <Fieldset
                        title={barra.codice.split("-").at(-1)!}
                        key={barra.codice}
                        className={`text-left pb-3 ${barra.valida ? "" : "striped-bg"}`}
                        legendClassName="text-base"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex justify-start items-center gap-x-2">
                              <h4 className="font-semibold w-16 text-left">Inizio:</h4>
                              <span>
                                {new Date(barra.inizio).toLocaleDateString("it-IT", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-start items-center gap-x-2">
                              <h4 className="font-semibold w-16 text-left">Fine:</h4>
                              <span>
                                {new Date(barra.fine).toLocaleDateString("it-IT", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-start items-center gap-x-2">
                              <h4 className="font-semibold w-16 text-left">Durata:</h4>
                              <span>{durata(new Date(barra.inizio), new Date(barra.fine))}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-start items-center gap-x-2">
                              <h4 className="font-semibold w-36 text-left">Lotti Lavorati:</h4>
                              <ul className="min-w-12">
                                {barra.record_lavorazione?.split(", ").map((record) => (
                                  <li>{record}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex justify-start items-center gap-x-2">
                              <h4 className="font-semibold w-36 text-left">Metallo Depositato:</h4>
                              <span className="min-w-12">{peso(barra.mg_metallo)}</span>
                            </div>
                            <div className="flex justify-start items-center gap-x-2">
                              <h4 className="font-semibold w-36 text-left">Costo Metallo:</h4>
                              <span className="min-w-12">{toEuro(barra.costo_metallo)}</span>
                            </div>
                          </div>
                        </div>
                        <Collapsible className="mt-2">
                          <CollapsibleTrigger className="hover:underline">
                            Mostra tutti gli step che ha fatto la barra
                            <CaretDownIcon className="size-6 relative -top-px inline text-gray-700" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <PopoverBarra codice={barra.codice} />
                          </CollapsibleContent>
                        </Collapsible>
                      </Fieldset>
                    ))
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

function DataTableHeader({ table, data }: { table: TableProps<RecordConsumo>; data: RecordConsumo[] }) {
  console.log(data);

  const impianto = (table.options.meta as any)?.impianto;
  const clientiQuery = useQuery<Cliente[]>([URLS.CLIENTI, { impianto: impianto }]);
  const clienti =
    clientiQuery.data?.map((cliente) => ({
      value: cliente.id,
      label: cliente.nome,
    })) ?? [];

  const trattamenti = [
    { value: "Doratura", label: "Doratura" },
    { value: "Argentatura", label: "Argentatura" },
    { value: "Altro", label: "Altro" },
  ];

  const margini = [
    { value: "positive", label: "Positivo", icon: <FontAwesomeIcon icon={faThumbsUp} /> },
    { value: "negative", label: "Negativo", icon: <FontAwesomeIcon icon={faThumbsDown} /> },
    { value: "none", label: "Indefinito", icon: <FontAwesomeIcon icon={faMinus} /> },
  ];
  return (
    <div className="flex items-center gap-x-4 mb-3 overflow-x-scroll">
      <Input
        placeholder="Cerca Lotto..."
        value={(table.getColumn("n_lotto_super")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.setPageIndex(0);
          table.getColumn("n_lotto_super")?.setFilterValue(event.target.value);
        }}
        className="max-w-sm w-40 h-8"
      />
      <DataTableFacetedFilter
        table={table}
        column={table.getColumn("cliente")}
        title="Cliente"
        options={clienti}
        sort
        width={370}
      />
      <DataTableFacetedFilter
        table={table}
        column={table.getColumn("margine")}
        title="Margine"
        options={margini}
        width={160}
      />
      <DataTableFacetedFilter
        table={table}
        column={table.getColumn("trattamenti")}
        title="Trattamenti"
        options={trattamenti}
        width={200}
        facetCount={false}
        sort
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

function ConsumoMetalli({ impiantoId }: { impiantoId: string }) {
  const [prezzoOro, setPrezzoOro] = useState(70.5);
  return (
    <Card className="col-span-3">
      <CardHeader className="space-y-0 pb-2 flex flex-row gap-x-16 justify-between">
        <div>
          <CardTitle>Consumo Metalli</CardTitle>
          <CardDescription className="mt-2 max-w-lg">
            Vengono visualizzati i lotti completati mettendo a confronto il prezzo con il costo del materiale
            prezioso utilizzato nella lavorazione.
          </CardDescription>
        </div>
        <div>
          <Label className="mb-2 ml-2">Prezzo Oro (€/g)</Label>
          <Input
            type="number"
            value={prezzoOro}
            onChange={(e) => setPrezzoOro(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <DataTable
          columns={columns}
          endpoint={URLS.CONSUMO_METALLI + `?impianto=${impiantoId}&prezzo_oro=${isNaN(prezzoOro) ? 70.5 : prezzoOro}`}
          Header={DataTableHeader}
          initialPageSize={5}
          meta={{ impianto: impiantoId }}
        />
      </CardContent>
    </Card>
  );
}

export default ConsumoMetalli;
