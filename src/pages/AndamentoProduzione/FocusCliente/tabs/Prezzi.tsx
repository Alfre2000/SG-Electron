import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import { DataTable } from "./components/data-table";
import { ArticoloPrice, columns } from "./components/columns";
import Loading from "@components/Loading/Loading";
import Error from "@components/Error/Error";
import { URLS } from "../../../../urls";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Alert, AlertDescription, AlertTitle } from "@components/shadcn/Alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import PrezziPreziosi from "./components/prezzi-preziosi";
import { InfoPrezzi } from "@interfaces/global";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@components/shadcn/Button";

function Prezzi() {
  const today = new Date();
  today.setHours(0);
  const [domReady, setDomReady] = useState(false);
  const { cliente } = useParams();
  const prezziQuery = useQuery<ArticoloPrice[]>(`${URLS.CLIENTI}${cliente}/prezzi`);
  const infoPrezziQuery = useQuery<InfoPrezzi>(`${URLS.INFO_PREZZI}${cliente}/`);
  const lavorazioni = useMemo(() => {
    const res = new Set<string>();
    prezziQuery.data?.forEach((p) => {
      p.articolo.richieste.forEach((r) => {
        if (r.lavorazione) {
          res.add(r.lavorazione?.nome);
        }
      });
    });
    return Array.from(res);
  }, [prezziQuery.data]);
  const hasPreziosi = lavorazioni.includes("Doratura") || lavorazioni.includes("Argentatura");
  const needsUpdate =
    infoPrezziQuery.data &&
    (!infoPrezziQuery.data.prezzo_oro ||
      !infoPrezziQuery.data.prezzo_argento ||
      infoPrezziQuery.data.scadenza_prezzo_oro === null ||
      infoPrezziQuery.data.scadenza_prezzo_argento === null ||
      new Date(infoPrezziQuery.data.scadenza_prezzo_oro) < today ||
      new Date(infoPrezziQuery.data.scadenza_prezzo_argento) < today);

  useEffect(() => {
    setDomReady(true);
  }, []);
  return (
    <div className="grid gap-4 grid-cols-4 py-3">
      {hasPreziosi && needsUpdate && (
        <Alert variant="destructive" className="col-span-4 bg-card shadow border-red-600">
          <ExclamationTriangleIcon className="h-4 w-4 mt-2.5" />
          <div className="flex pt-1">
            <div className="text-red-700">
              <AlertTitle className="font-semibold">Aggiorna il prezzo dei metalli preziosi</AlertTitle>
              <AlertDescription>
                Inserisci i prezzi dei metalli preziosi per poter calcolare automaticamente i prezzi degli articoli
              </AlertDescription>
            </div>
            {infoPrezziQuery.data && <PrezziPreziosi data={infoPrezziQuery.data} />}
          </div>
        </Alert>
      )}
      {hasPreziosi &&
        !needsUpdate &&
        domReady &&
        infoPrezziQuery.data &&
        createPortal(
          <PrezziPreziosi data={infoPrezziQuery.data}>
            <Button variant="outline" className="relative -right-2">
              Prezzi Preziosi
            </Button>
          </PrezziPreziosi>,
          document.getElementById("tabs-side")!
        )}
      <Card className="col-span-4 min-h-[736px]">
        <CardHeader>
          <CardTitle>Prezzi per articolo</CardTitle>
          <CardDescription>Informazioni relative al prezzo di ciascun articolo del cliente</CardDescription>
        </CardHeader>
        <CardContent>
          {prezziQuery.isError && <Error />}
          {prezziQuery.isLoading && <Loading className="m-auto relative top-60" />}
          {prezziQuery.isSuccess && infoPrezziQuery.isSuccess && (
            <DataTable columns={columns} data={prezziQuery.data} cliente={infoPrezziQuery.data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Prezzi;
