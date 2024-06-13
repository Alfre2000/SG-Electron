import { Prodotto } from "@interfaces/global";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { URLS } from "urls";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import { DataTable } from "./table-giacenza";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { columns } from "./columns-giacenza";
import Ordine from "./ordine";
import { Button } from "@components/shadcn/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { apiGet } from "@api/api";
import { toast } from "sonner";
import OverlayLoader from "@components/OverlayLoader/OverlayLoader";
const electron = window?.require ? window.require("electron") : null;

function Giacenza() {
  const prodottiQuery = useQuery<Prodotto[]>([URLS.PRODOTTI]);
  const [prodottiOrdine, setProdottiOrdine] = useState<string[]>([]);
  const [fornitore, setFornitore] = useState<string | undefined>();
  const endpoint = fornitore ? `${URLS.DOCX_GIACENZA}?fornitore=${fornitore}` : URLS.DOCX_GIACENZA;
  const mutation = useMutation(() => apiGet(endpoint), {
    onSuccess: (res) => {
      electron.ipcRenderer.invoke("save-open-docx", res.docx);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Errore durante il download del report");
    },
  });
  if (prodottiOrdine.length > 0) {
    return <Ordine prodotti={prodottiOrdine} setProdotti={setProdottiOrdine} />;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Report Giacenza Magazzino</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <Card>
        <div className="flex justify-between items-center">
          <CardHeader>
            <CardTitle>Gianceza Attuale del Magazzino</CardTitle>
            <CardDescription>
              Visualizza la giacenza attuale del magazzino e seleziona i prodotti da ordinare.
            </CardDescription>
          </CardHeader>
          <Button variant="outline" className="mr-5" onClick={() => mutation.mutate()}>
            Scarica Report <FontAwesomeIcon icon={faDownload} className="ml-2 text-gray-500 relative bottom-px" />
          </Button>
        </div>
        <CardContent>
          {prodottiQuery.isLoading && <Loading />}
          {prodottiQuery.isError && <Error />}
          {prodottiQuery.isSuccess && (
            <DataTable columns={columns} data={prodottiQuery.data} setProdottiOrdine={setProdottiOrdine} setFornitore={setFornitore} />
          )}
        </CardContent>
      </Card>
      {mutation.isLoading && <OverlayLoader message="Generazione report in corso..." />}
    </div>
  );
}

export default Giacenza;
