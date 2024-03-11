import { getProduction } from "@api/isa";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import Wrapper from "@ui/wrapper/Wrapper";
import React from "react";
import { useQuery } from "react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/shadcn/Card";
import { Line } from "react-chartjs-2";

type Production = {
  date: string;
  hour: number;
  nTelai: number;
}[];

function Impianti() {
  const prodQuery = useQuery("getProduction", getProduction, {
    select: (data: any) => {
      data.forEach((d: any) => {
        d.date = new Date(d.date);
        d.date.setHours(d.hour, 0, 0, 0);
      })
      return data;
    },
  });
  const data = prodQuery.data as unknown as any;
  
  return (
    <Wrapper>
      <div className="my-8 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-8 min-w-96 w-full">
        <h2 className="text-left scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
          Andamento Impianti
        </h2>
        <hr className="mb-2 text-gray-800 w-64 mr-auto relative -top-3" />
        <Card className="min-h-[70vh]">
          <CardHeader>
            <CardTitle>Statico 1.650</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prodQuery.isError && <Error />}
            {prodQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {prodQuery.isSuccess && (
              <Line
                data={{
                  labels: data?.map((d: any) => d.date.toLocaleDateString()),
                  datasets: [
                    {
                      label: "Telai",
                      data: data?.map((d: any) => d.nTelai),
                      backgroundColor: "rgba(75,192,192,0.4)",
                      borderColor: "rgba(75,192,192,1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

export default Impianti;
