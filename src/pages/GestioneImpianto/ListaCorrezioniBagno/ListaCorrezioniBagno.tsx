import React from "react";
import { URLS } from "../../../urls";
import Wrapper from "@ui/wrapper/Wrapper";
import { DataTable } from "@ui/base-data-table/data-table";
import useImpiantoQuery from "@hooks/useImpiantoQuery/useImpiantoQuery";
import Loading from "@components/Loading/Loading";
import Error from "@components/Error/Error";

import { ColumnDef } from "@tanstack/react-table";

type Aggiunta = {
  quantità: string;
  prodotto: string;
  data_completamento: string;
  vasca: string;
  operatore: number;
};

export const columns: ColumnDef<Aggiunta>[] = [
  {
    accessorKey: "data_completamento",
    header: "Data Completamento",
    cell: ({ row }) => {
      return new Date(row.original.data_completamento).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  { accessorKey: "vasca", header: "Vasca" },
  { accessorKey: "prodotto", header: "Prodotto" },
  { accessorKey: "quantità", header: "Quantità" },
];

function ListaCorrezioniBagno() {
  const correzioniQuery: any = useImpiantoQuery(
    {
      queryKey: [URLS.RICHIESTE_CORREZIONE_BAGNO, { eseguita: true }],
    },
    {
      select: (data: any) => {
        const aggiunte: Aggiunta[] = [];
        data.results.forEach((richiesta: any) => {
          richiesta.richieste_prodotto.forEach((riga: any) => {
            aggiunte.push({
              quantità: riga.quantità,
              prodotto: riga.prodotto,
              vasca: riga.vasca,
              data_completamento: richiesta.data_completamento,
              operatore: richiesta.operatore,
            });
          });
        });
        return aggiunte;
      },
    }
  );
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full relative">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">
            Richiesta Correzione Bagno
          </h2>
        </div>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <div className="grid gap-4">
          {correzioniQuery.isLoading && <Loading className="my-auto" />}
          {correzioniQuery.isError && <Error />}
          {correzioniQuery.isSuccess && <DataTable columns={columns} data={correzioniQuery.data} />}
        </div>
      </div>
    </Wrapper>
  );
}

export default ListaCorrezioniBagno;
