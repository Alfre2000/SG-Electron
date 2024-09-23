import { Tabs, TabsList, TabsTrigger } from "@components/shadcn/Tabs";
import { Impianto, PaginationData, RecordInserimentoLotti } from "@interfaces/global";
import Wrapper from "@ui/wrapper/Wrapper";
import { useState } from "react";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@components/shadcn/Card";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { DataTable } from "@ui/full-data-table/data-table";
import { columns } from "./columns";

function InserimentoLotti() {
  const [impianto, setImpianto] = useState<number>(2);
  const impiantiQuery = useQuery<Impianto[]>(URLS.IMPIANTI, {
    select: (data) =>
      data
        .map((impianto) => ({
          ...impianto,
          nome: impianto.nome === "Statico 1.650 - Quattro Carri" ? "Quattro Carri" : impianto.nome,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome)),
  });
  const recordsQuery = useQuery<PaginationData<RecordInserimentoLotti>>([
    URLS.INSERIMENTO_LOTTI,
    { impianto },
    { custom_page_size: 1000 },
  ]);
  return (
    <Wrapper>
      <div className="my-8 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-3 min-w-96 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-left scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
            Inserimento Lotti
          </h2>
          <p className="text-muted text-sm relative top-3">Dati relativi ai 7 giorni precedenti</p>
        </div>
        <hr className="mt-3 text-gray-800 w-64 mr-auto relative -top-3" />
        <Tabs value={impianto.toString()} onValueChange={(value) => setImpianto(parseInt(value))} className="mb-3">
          <TabsList>
            {impiantiQuery.data &&
              impiantiQuery.data.map((impianto) => (
                <TabsTrigger value={impianto.id.toString()} key={impianto.id}>
                  {impianto.nome}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-3 gap-3">
          <Card className="col-span-3 min-h-[500px]">
            <CardHeader>
              <CardTitle>Lotti</CardTitle>
              <CardDescription>
                Dati relativi ai lotti che sono stati consegnati negli ultimi 7 giorni.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recordsQuery.isError && <Error />}
              {recordsQuery.isLoading && <Loading className="mt-10" />}
              {recordsQuery.isSuccess && <DataTable data={recordsQuery.data?.results || []} columns={columns} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default InserimentoLotti;
