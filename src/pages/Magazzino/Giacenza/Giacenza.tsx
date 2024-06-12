import { Prodotto } from "@interfaces/global";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import { DataTable } from "./table-giacenza";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { columns } from "./columns-giacenza";
import Ordine from "./ordine";

function Giacenza() {
  const prodottiQuery = useQuery<Prodotto[]>([URLS.PRODOTTI, { order_by: "difference" }]);
  const [prodottiOrdine, setProdottiOrdine] = useState<string[]>([]);
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
          <CardHeader>
            <CardTitle>Gianceza Attuale del Magazzino</CardTitle>
            <CardDescription>
              Visualizza la giacenza attuale del magazzino e seleziona i prodotti da ordinare.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prodottiQuery.isLoading && <Loading />}
            {prodottiQuery.isError && <Error />}
            {prodottiQuery.isSuccess && <DataTable columns={columns} data={prodottiQuery.data} setProdottiOrdine={setProdottiOrdine} />}
          </CardContent>
        </Card>
    </div>
  );
}

export default Giacenza;
