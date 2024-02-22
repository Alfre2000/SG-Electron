import { ColumnDef } from "@tanstack/react-table";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../../../../components/shadcn/Tooltip";
import { Button } from "../../../../../components/shadcn/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/shadcn/DropdownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faEllipsis, faTriangleExclamation, faWrench } from "@fortawesome/free-solid-svg-icons";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../../../../components/shadcn/HoverCard";

export type Articolo = {
  superficie: number | null;
  peso: number | null;
  costo_manodopera: number | null;
  richieste: {
    id: string;
    articolo: string;
    punto: number;
    spessore_massimo: number;
    spessore_minimo: number;
    lavorazione: {
      id: number;
      nome: string;
      norma: string;
      metallo: number;
      impianti: number[];
    };
  }[];
};

export type ArticoloPrice = {
  articolo_id: string;
  nome: string;
  codice: string;
  ultimo_prezzo: number | null;
  um: "N" | "KG";
  prezzo_suggerito: number | null;
  articolo: Articolo;
};

export const columns: ColumnDef<ArticoloPrice>[] = [
  {
    accessorKey: "codice",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Articolo
          <CaretSortIcon className="h-4 w-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const codice: string = row.getValue("codice");
      const nome: string = row.original.nome;
      return (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="cursor-help">{codice}</div>
              </TooltipTrigger>
              <TooltipContent>{nome}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "ultimo_prezzo",
    header: "Ultimo Prezzo",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("ultimo_prezzo"));
      if (isNaN(amount) || amount === null) {
        return <div className="font-medium pl-2">-</div>;
      }
      const formatted = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "prezzo_suggerito",
    header: "Prezzo Suggerito",
    cell: ({ table, row }) => {
      const errors: string[] = [];
      const cliente = table.options?.meta!.cliente;
      const prezzoOro =
        cliente?.scadenza_prezzo_oro && new Date(cliente?.scadenza_prezzo_oro) > new Date()
          ? cliente?.prezzo_oro
          : null;
      const prezzoArgento =
        cliente?.scadenza_prezzo_argento && new Date(cliente?.scadenza_prezzo_argento) > new Date()
          ? cliente?.prezzo_argento
          : null;
      const superficie = row.original.articolo.superficie;
      const peso = row.original.articolo.peso;
      const costo_manodopera = row.original.articolo.costo_manodopera;
      const um = row.original.um;
      const richieste = row.original.articolo.richieste
        .filter((r) => r.lavorazione.nome === "Argentatura" || r.lavorazione.nome === "Doratura")
        .map((r) => {
          if (r.lavorazione.nome === "Argentatura" && prezzoArgento === null) {
            errors.push("Prezzo Argento");
          } else if (r.lavorazione.nome === "Doratura" && prezzoOro === null) {
            errors.push("Prezzo Oro");
          }
          if (r.spessore_massimo === null) {
            errors.push("Spessore Massimo " + r.lavorazione.nome);
          }
          return {
            lavorazione: r.lavorazione.nome,
            spessore: r.spessore_massimo,
            prezzoMetallo: r.lavorazione.nome === "Argentatura" ? prezzoArgento! / 1000 : prezzoOro,
            densità: r.lavorazione.nome === "Argentatura" ? 10.49 : 19.32,
          };
        });
      const hasArgentatura = richieste.some((r) => r.lavorazione === "Argentatura");
      const hasDoratura = richieste.some((r) => r.lavorazione === "Doratura");

      if (superficie === null) {
        errors.push("Superficie");
      }
      if (um === "KG" && peso === null) {
        errors.push("Peso");
      }
      if (costo_manodopera === null) {
        errors.push("Costo della manodopera");
      }

      if (errors.length > 0) {
        return (
          <div>
            <HoverCard>
              <HoverCardTrigger>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="hover:underline cursor-help text-red-700"
                />
              </HoverCardTrigger>
              <HoverCardContent className="py-3 pb-4 px-6">
                <h4 className="text-red-700 text-center mb-3 font-medium">Dati Mancanti</h4>
                <ul className="text-xs ml-2">
                  {errors.map((error, index) => (
                    <li key={index} className="list-decimal pl-1">
                      {error}
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          </div>
        );
      }

      if (richieste.length === 0) {
        return <div className="font-medium">Non Prezioso</div>;
      }

      let amount = costo_manodopera!;
      richieste.forEach((r) => {
        let increase = r.prezzoMetallo! * (superficie! * 100) * (r.spessore / 10000) * r.densità;
        if (um === "KG") {
          increase = increase / peso!;
        }
        amount += increase;
      });

      let formatted = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(amount);

      if (um === "KG") {
        formatted += " / kg";
      }

      return (
        <div>
          <HoverCard>
            <HoverCardTrigger className="font-medium">
              <div className="hover:underline cursor-help">{formatted}</div>
            </HoverCardTrigger>
            <HoverCardContent className="py-3 pb-4 px-6 w-[28rem]">
              <h4 className="text-center mb-3 font-semibold">Calcolo Eseguito</h4>
              <div className="text-xs space-y-2">
                <div className="grid grid-cols-2">
                  <span>
                    <span className="font-semibold">Superficie:</span> {superficie} dm²
                  </span>
                  {um === "KG" && (
                    <span>
                      <span className="font-semibold">Peso:</span> {peso} kg
                    </span>
                  )}
                </div>
                {hasArgentatura && (
                  <div>
                    <span className="font-semibold">Argento:</span> {prezzoArgento} €/kg -{" "}
                    <span className="font-semibold">Densità:</span> 10.49 g/cm³
                  </div>
                )}
                {hasDoratura && (
                  <div>
                    <span className="font-semibold">Oro:</span> {prezzoOro} €/g -{" "}
                    <span className="font-semibold">Densità:</span> 19.32 g/cm³
                  </div>
                )}
                <ol className="ml-3">
                  {richieste.map((r, index) => (
                    <li key={index} className="list-decimal">
                      <span className="font-semibold">{r.lavorazione}:</span> {r.spessore} µm
                    </li>
                  ))}
                </ol>
                <hr className="w-2/3 my-3 mx-auto" />
                {richieste.map((r) => (
                  <>
                    <div>
                      <span className="font-semibold">Volume {r.lavorazione}:</span> {superficie} dm² * 100 *{" "}
                      {r.spessore} µm / 10000 = {(superficie! * 100 * (r.spessore / 10000)).toFixed(4)} cm³
                    </div>
                    <div>
                      <span className="font-semibold">Prezzo {r.lavorazione}:</span>{" "}
                      {(superficie! * 100 * (r.spessore / 10000)).toFixed(4)} cm³ * {r.densità} g/cm³ *{" "}
                      {r.prezzoMetallo} €/g ={" "}
                      {(superficie! * 100 * (r.spessore / 10000) * r.densità * r.prezzoMetallo!).toFixed(4)} €
                    </div>
                  </>
                ))}
                <div>
                  <span className="font-semibold">Costo Manodopera:</span> {costo_manodopera} €/{um}
                </div>
                <hr className="w-2/3 my-3 mx-auto" />
                <div>
                  <span className="font-semibold">Prezzo Suggerito:</span> {amount.toFixed(4)} €{" "}
                  {um === "KG" && "/ kg"}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ table, row }) => {
      const id = row.original.articolo_id;
      const setAnagraficaPopover = table.options?.meta!.setAnagraficaPopover || (() => {});
      const setAndamentoPopover = table.options?.meta!.setAndamentoPopover || (() => {});
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <FontAwesomeIcon icon={faEllipsis} className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="ml-6">Azioni</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAnagraficaPopover(id)}>
              <FontAwesomeIcon icon={faWrench} className="mr-2" />
              Modifica Informazioni
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAndamentoPopover(id)}>
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Andamento Prezzo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
