import { options4 } from "@charts/barOptions";
import Wrapper from "@ui/wrapper/Wrapper";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/shadcn/Card";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { URLS } from "urls";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";


function Utilizzo() {
  const utilizziQuery = useQuery<any>(URLS.UTILIZZI);
  console.log(utilizziQuery.data);
  
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full relative">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Utilizzo Features</h2>
        </div>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <div className="grid gap-4 grid-cols-3">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Record Lavorazione</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
            {utilizziQuery.isError && <Error />}
            {utilizziQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {utilizziQuery.isSuccess && (
              <Bar
                options={options4}
                data={{
                  labels: utilizziQuery.data.record_lavorazione.map((item: any) =>
                    new Date(item.giorno).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  ),
                  datasets: [
                    {
                      data: utilizziQuery.data.record_lavorazione.map((item: any) => item.count),
                      backgroundColor: "#212163",
                      borderColor: "#212163",
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Certificati</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
            {utilizziQuery.isError && <Error />}
            {utilizziQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {utilizziQuery.isSuccess && (
              <Bar
                options={options4}
                data={{
                  labels: utilizziQuery.data.certificati.map((item: any) =>
                    new Date(item.data_certificato).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  ),
                  datasets: [
                    {
                      data: utilizziQuery.data.certificati.map((item: any) => item.count),
                      backgroundColor: "#212163",
                      borderColor: "#212163",
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Richieste correzione bagno</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
            {utilizziQuery.isError && <Error />}
            {utilizziQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {utilizziQuery.isSuccess && (
              <Bar
                options={options4}
                data={{
                  labels: utilizziQuery.data.correzioni_bagni.map((item: any) =>
                    new Date(item.giorno).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  ),
                  datasets: [
                    {
                      data: utilizziQuery.data.correzioni_bagni.map((item: any) => item.count),
                      backgroundColor: "#212163",
                      borderColor: "#212163",
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            )}
          </CardContent>
        </Card>
        
        </div>
      </div>
    </Wrapper>
  );
}

export default Utilizzo;
