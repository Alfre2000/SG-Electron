import { Tabs, TabsList, TabsTrigger } from "@components/shadcn/Tabs";
import { Impianto, PaginationData, RecordLavorazione } from "@interfaces/global";
import Wrapper from "@ui/wrapper/Wrapper";
import { addDays } from "date-fns";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@components/shadcn/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { DataTable } from "@ui/full-data-table/data-table";
import { columns } from "./columns";
import { dateToDatePicker } from "utils";

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
  const start = addDays(new Date(), -7);
  start.setHours(0, 0, 0, 0);
  const recordsQuery = useQuery<PaginationData<RecordLavorazione>>([
    URLS.RECORD_LAVORAZIONI,
    { consegnato: true },
    { impianto },
    { data_consegna__gt: dateToDatePicker(start) },
    { custom_page_size: 1000 },
  ]);
  const { inseriti, totale, misurazioni } = useMemo(() => {
    if (!recordsQuery.data) return { inseriti: 0, totale: 0 };
    const totale = recordsQuery.data.results.length;
    const inseriti = recordsQuery.data.results.filter((record) => !record.data.includes("T00:00:00")).length;
    let misurazioni = 0;
    recordsQuery.data.results.forEach((record) => {
      record.record_controlli.forEach((controllo) => {
        misurazioni += controllo.misurazioni.filter((misurazione) => !!misurazione.manuale).length;
      });
    });
    return { inseriti, totale, misurazioni };
  }, [recordsQuery.data]);
  const percentuale = inseriti / totale * 100
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
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="font-medium">Percentuale Record Inseriti</CardTitle>
                <FontAwesomeIcon icon={faBolt} className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {recordsQuery.isError && <Error />}
              {recordsQuery.isLoading && <Loading />}
              {recordsQuery.isSuccess && (
                <div className="text-2xl font-bold">
                  {totale ? (percentuale).toFixed(0) : 100} % <span className="text-sm ml-2 font-normal tracking-widest">({inseriti}/{totale})</span>
                  {percentuale < 90 && <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-600 size-5 ml-3" />}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="font-medium">Numero di misurazioni effettuate</CardTitle>
                <FontAwesomeIcon icon={faBolt} className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {recordsQuery.isError && <Error />}
              {recordsQuery.isLoading && <Loading />}
              {recordsQuery.isSuccess && <div className="text-2xl font-bold">{misurazioni}</div>}
            </CardContent>
          </Card>
          <Card className="col-span-3 min-h-[500px]">
            <CardHeader>
              <CardTitle>Lotti</CardTitle>
              <CardDescription>Dati relativi ai lotti che sono stati consegnati negli ultimi 7 giorni.</CardDescription>
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
