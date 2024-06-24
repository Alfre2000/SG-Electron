import { useImpianto } from "@contexts/UserContext";
import { Barra, PaginationData } from "@interfaces/global";
import { addDays } from "date-fns";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { dateToDatePicker } from "utils";
import { Card, CardHeader, CardTitle, CardContent } from "@components/shadcn/Card";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Bar } from "react-chartjs-2";
import { getGroupedProduction } from "@pages/AndamentoProduzione/Impianti/utils";
import { toFormattedNumber, toTitle } from "@utils/main";
import { tooltipStyle } from "@charts/barOptions";

function Produzione() {
  const impianto = useImpianto();
  const barreQuery = useQuery<PaginationData<Barra>>([
    URLS.BARRE,
    { impianto: impianto },
    { custom_page_size: 2000 },
    { inizio: dateToDatePicker(addDays(new Date(), -15)) },
    { end: dateToDatePicker(addDays(new Date(), 0)) },
  ]);
  const production = getGroupedProduction(
    barreQuery.data?.results || [],
    addDays(new Date(), -15),
    new Date(),
    12
  );
  console.log(production);

  const datasets = [
    {
      label: "1° Turno",
      data: [] as number[],
      backgroundColor: ["rgba(75, 192, 192, 0.5)"],
      borderColor: "#007eb8",
      borderWidth: 1,
    },
    {
      label: "2° Turno",
      data: [] as number[],
      backgroundColor: ["rgba(54, 162, 235, 0.5)"],
      borderColor: "#007eb8",
      borderWidth: 1,
    },
  ];
  production.forEach((d, idx) => {
    if (idx % 2 === 0) {
      datasets[0].data.push(d.nTelai);
    } else {
      datasets[1].data.push(d.nTelai);
    }
  });
  const data = {
    labels: production.filter((_, idx) => idx % 2 === 0).map((d) => d.date),
    datasets: datasets,
  };
  return (
    <div className="">
      <h2 className="text-left scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
        Andamento Produzione
      </h2>
      <hr className="mt-3 text-gray-800 w-64 mr-auto relative -top-3" />
      <div className="grid grid-cols-3 gap-3 mt-8">
        <Card className="min-h-[70vh] col-span-3">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="font-medium pb-1.5">Andamento Produzione</CardTitle>
          </CardHeader>
          <CardContent>
            {barreQuery.isError && <Error />}
            {barreQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {barreQuery.isSuccess && (
              <Bar
                data={data}
                options={
                  {
                    maintainAspectRatio: true,
                    responsive: true,
                    scales: {
                      y: {
                        grace: "5%",
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "N° telai prodotti",
                        },
                      },
                      x: {
                        ticks: {
                          callback: function (value: any, index: any) {
                            const val: any = (this as any).getLabelForValue(value);
                            return val.toLocaleString("it-IT", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            });
                          },
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          title: function (tooltipItems: any) {
                            const date = new Date(tooltipItems[0].label);
                            let endHour = date.getHours() + 12;
                            if (endHour >= 24) endHour -= 24;
                            return (
                              toTitle(
                                date.toLocaleString("it-IT", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                })
                              ) +
                              ", " +
                              tooltipItems[0].dataset.label
                            );
                          },
                          label: function (tooltipItem: any) {
                            return "N° di telai prodotti: " + toFormattedNumber(tooltipItem.formattedValue);
                          },
                        },
                        ...tooltipStyle,
                      },
                    },
                  } as any
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Produzione;
