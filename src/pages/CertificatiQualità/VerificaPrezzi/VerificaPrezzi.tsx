import React from "react";
import Wrapper from "@ui/wrapper/Wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/shadcn/Card";
import { Input } from "@components/shadcn/Input";
import { Button } from "@components/shadcn/Button";
import { CaretDownIcon, CheckIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { getEntireLottoInformation } from "@api/mago";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/shadcn/Table";
import { apiGet, apiPost } from "@api/api";
import { toEuro, toFormattedNumber } from "@utils/main";
import PrezzoSuggerito from "./PrezzoSuggerito";
import { Articolo, InfoPrezzi, RecordLavorazione } from "@interfaces/global";
import { prezzoSuggerito } from "@utils/prezzi";
import { round } from "@lib/utils";
import Loading from "@components/Loading/Loading";
import PrezziPreziosi from "@pages/AndamentoProduzione/FocusCliente/tabs/components/prezzi-preziosi";
import { Alert, AlertDescription, AlertTitle } from "@components/shadcn/Alert";
import AnagraficaArticolo from "./AnagraficaArticolo";
import { z } from "zod";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@components/shadcn/Collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/shadcn/Tooltip";

const electron = window?.require ? window.require("electron") : null;

type Lotto = {
  articolo: Articolo;
  record: RecordLavorazione;
  prezzoSuggerito?: number;
  differenza?: number;
}[];

const lottoSchema = z.string().regex(/^\d{2}\/\d{5}$/, "Inserire un numero di lotto valido");

function VerificaPrezzi() {
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [nLotto, setNLotto] = React.useState("");
  const [lotto, setLotto] = React.useState<Lotto | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const cliente = lotto?.[0]?.articolo?.cliente;

  const searchLotto = (nLotto: string) => {
    if (!validateNLotto(nLotto)) return;
    setLoading(true);
    getEntireLottoInformation(nLotto).then((res) => {
      apiPost(URLS.LOTTO_INFO, res).then((res) => {
        setLoading(false);
        setLotto(res);
      });
    });
  };

  const infoPrezziQuery = useQuery<InfoPrezzi>(URLS.INFO_PREZZI + cliente?.id + "/", { enabled: !!cliente?.id });
  const firstRecord = lotto?.[0]?.record?.id;

  React.useEffect(() => {
    if (!infoPrezziQuery.data) return;
    setLotto((prevLotto) => {
      const newLotto = [...(prevLotto || [])];
      newLotto.forEach((riga) => {
        riga.prezzoSuggerito = prezzoSuggerito(riga.record, riga.articolo, infoPrezziQuery.data) || undefined;
        console.log(riga.prezzoSuggerito, riga.record.prezzo, parseFloat(riga.record.prezzo!));
        riga.differenza =
          riga.prezzoSuggerito && riga.record.prezzo
            ? round(riga.prezzoSuggerito - parseFloat(riga.record.prezzo), 2)
            : undefined;
      });
      return newLotto;
    });
  }, [infoPrezziQuery.data, firstRecord]);

  const today = new Date();
  const lavorazioni = new Set();
  if (lotto) {
    lotto.forEach((riga) => riga.articolo.richieste.forEach((r) => lavorazioni.add(r.lavorazione.nome)));
  }
  const hasPreziosi = lavorazioni.has("Doratura") || lavorazioni.has("Argentatura");
  const needsUpdate =
    infoPrezziQuery.data &&
    (!infoPrezziQuery.data.prezzo_oro ||
      !infoPrezziQuery.data.prezzo_argento ||
      infoPrezziQuery.data.scadenza_prezzo_oro === null ||
      infoPrezziQuery.data.scadenza_prezzo_argento === null ||
      new Date(infoPrezziQuery.data.scadenza_prezzo_oro) < today ||
      new Date(infoPrezziQuery.data.scadenza_prezzo_argento) < today);

  const updateArticolo = (articolo: Articolo) => {
    setLotto((prevLotto) => {
      const newLotto = [...(prevLotto || [])];
      newLotto.forEach((riga) => {
        if (riga.articolo.id === articolo.id) {
          riga.articolo = articolo;
        }
      });
      if (infoPrezziQuery.data) {
        newLotto.forEach((riga) => {
          riga.prezzoSuggerito = prezzoSuggerito(riga.record, riga.articolo, infoPrezziQuery.data) || undefined;
          riga.differenza =
            riga.prezzoSuggerito && riga.record.prezzo
              ? round(riga.prezzoSuggerito - parseFloat(riga.record.prezzo), 2)
              : undefined;
        });
      }
      return newLotto;
    });
  };
  const validateNLotto = (nLotto: string) => {
    try {
      lottoSchema.parse(nLotto);
      setError("");
      return true;
    } catch (e) {
      const error = e as z.ZodError;
      setError(error.errors[0].message);
      setTimeout(() => setError(""), 3000);
      return false;
    }
  };
  const downloadPDF = () => {
    apiGet(`${URLS.VERIFICA_PREZZI_PDF}?n_lotto=${nLotto}`).then((res) => {
      electron.ipcRenderer.invoke("save-pdf", res, `verifica_prezzi_${nLotto.replace('/', '_')}.pdf`);
    });
  };
  const printPDF = () => {
    apiGet(`${URLS.VERIFICA_PREZZI_PDF}?n_lotto=${nLotto}`).then((res) => {
      electron.ipcRenderer.invoke("print-pdf", res);
    });
  };
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full mb-20">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Verifica Prezzi</h2>
          {infoPrezziQuery.data && lotto && (
            <PrezziPreziosi data={infoPrezziQuery.data} clienteID={cliente?.id}>
              <Button variant="outline" className="relative -right-2">
                Prezzi Preziosi - {cliente?.nome}
              </Button>
            </PrezziPreziosi>
          )}
        </div>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <Card className="mb-8 max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex justify-between items-center relative">
              Ricerca Lotto SuperGalvanica
              <MagnifyingGlassIcon className="w-6 h-6 absolute right-0" />
            </CardTitle>
            <CardDescription>Inserisci il numero del lotto per verificare i prezzi dell'ordine.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-x-4">
              <Input
                autoFocus
                placeholder="N° lotto"
                value={nLotto}
                onChange={(e) => setNLotto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    searchLotto(nLotto);
                  }
                }}
              />
              <Button onClick={() => searchLotto(nLotto)}>Cerca</Button>
            </div>
            <div className="h-3">
              <span className="text-red-600 text-xs">{error}</span>
            </div>
          </CardContent>
        </Card>
        {hasPreziosi && needsUpdate && (
          <Alert variant="destructive" className="col-span-4 bg-card shadow border-red-600 mb-4">
            <ExclamationTriangleIcon className="h-4 w-4 mt-2.5" />
            <div className="flex pt-1">
              <div className="text-red-700">
                <AlertTitle className="font-semibold">Aggiorna il prezzo dei metalli preziosi</AlertTitle>
                <AlertDescription>
                  Inserisci i prezzi dei metalli preziosi per poter calcolare automaticamente i prezzi degli
                  articoli
                </AlertDescription>
              </div>
              {infoPrezziQuery.data && <PrezziPreziosi data={infoPrezziQuery.data} clienteID={cliente?.id} />}
            </div>
          </Alert>
        )}
        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="flex justify-between items-center relative">
              <div>Riepilogo Ordine</div>
              {lotto && lotto.length > 0 && (
                <div className="flex gap-x-3 absolute right-2 top-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" className="px-3" onClick={printPDF}>
                          <FontAwesomeIcon icon={faPrint} size="lg" className="text-slate-700" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Stampa</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" className="px-3" onClick={downloadPDF}>
                          <FontAwesomeIcon icon={faDownload} size="lg" className="text-slate-700" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Salva PDF</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                <CollapsibleTrigger className="hover:underline">
                  Come interpretare la tabella{" "}
                  <CaretDownIcon
                    className={`h-4 w-4 inline text-gray-700 transition-transform duration-500 ${
                      isInfoOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  Tabella riepilogativa dell'ordine con il confronto tra i prezzi inseriti e i prezzi suggeriti dal
                  programma.
                  <br /> - In caso di <CheckIcon className="h-5 w-5 text-green-700 inline" /> il prezzo suggerito
                  corrisponde al prezzo dell'ordine.
                  <br /> - In caso di differenza negativa <span className="text-green-700">(colore verde)</span> il
                  prezzo suggerito è inferiore al prezzo dell'ordine.
                  <br /> - In caso di differenza positiva <span className="text-red-700">(colore rosso)</span> il
                  prezzo suggerito è maggiore al prezzo dell'ordine. Verificare il motivo della discrepanza.
                </CollapsibleContent>
              </Collapsible>
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-10 min-h-64 flex justify-center items-center">
            {(loading || infoPrezziQuery.isLoading) && <Loading className="my-auto" />}
            {!infoPrezziQuery.data && (lotto?.length === 0 || !lotto) && !loading && (
              <span className="text-muted italic">Nessun Lotto Selezionato</span>
            )}
            {infoPrezziQuery.data && lotto && !loading && (
              <Table className="mt-3 text-center border">
                <TableCaption>Elenco righe del lotto {nLotto} con i rispettivi prezzi</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="border text-center">Riga</TableHead>
                    <TableHead className="border text-center">Articolo</TableHead>
                    <TableHead className="border text-center">Prezzo Unitario</TableHead>
                    <TableHead className="border text-center">Quantità</TableHead>
                    <TableHead className="border text-center">Totale</TableHead>
                    <TableHead className="border text-center">Totale Suggerito</TableHead>
                    <TableHead className="border text-center">Differenza</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lotto.map((riga) => (
                    <TableRow key={riga.record.id}>
                      <TableCell className="border">{riga.record.n_lotto_super.split(".").at(-1)}</TableCell>
                      <TableCell className="border">
                        <AnagraficaArticolo articolo={riga.articolo} updateArticolo={updateArticolo} />
                      </TableCell>
                      <TableCell className="border">
                        {riga.record.prezzo_unitario ? toEuro(riga.record.prezzo_unitario, 4) : "-"}
                      </TableCell>
                      <TableCell className="border">
                        {toFormattedNumber(riga.record.quantità)} {riga.record.um === "KG" && <> Kg</>}
                      </TableCell>
                      <TableCell className="border">
                        {riga.record.prezzo ? toEuro(riga.record.prezzo) : "-"}
                      </TableCell>
                      <TableCell className="border">
                        <PrezzoSuggerito
                          articolo={riga.articolo}
                          record={riga.record}
                          infoPrezzi={infoPrezziQuery.data}
                        />
                      </TableCell>
                      <TableCell className="font-semibold border">
                        {riga.differenza !== undefined ? (
                          riga.differenza === 0 ? (
                            <CheckIcon className="h-5 w-5 text-green-700 mx-auto" />
                          ) : riga.differenza > 0 ? (
                            <span className="text-red-700">+{toEuro(riga.differenza)}</span>
                          ) : riga.differenza < 0 ? (
                            <span className="text-green-700">{toEuro(riga.differenza)}</span>
                          ) : null
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

export default VerificaPrezzi;
