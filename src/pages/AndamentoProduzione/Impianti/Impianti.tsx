import { avgTelai, getProduction } from "@api/isa";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import Wrapper from "@ui/wrapper/Wrapper";
import React from "react";
import { useQuery } from "react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@components/shadcn/Card";
import { Line } from "react-chartjs-2";
import { Tabs, TabsList, TabsTrigger } from "@components/shadcn/Tabs";
import { URLS } from "urls";
import { Impianto } from "@interfaces/global";
import { tooltipStyle } from "@charts/barOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { addSign, toFormattedNumber, toTitle } from "@utils/main";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";
import { Label } from "@components/shadcn/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import { Button } from "@components/shadcn/Button";
import { DatePickerWithRange } from "@components/shadcn/DatePicker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Cross2Icon } from "@radix-ui/react-icons";

const defaultImpianto = "Quattro Carri";

function Impianti() {
  const defaultPeriodo = { from: addDays(new Date(), -7), to: new Date() };
  const defaultHoursGroup = 1;
  const [hoursGroup, setHoursGroup] = React.useState(defaultHoursGroup);
  const [periodo, setPeriodo] = React.useState<DateRange | undefined>(defaultPeriodo);
  const impiantiQuery = useQuery<Impianto[]>(URLS.IMPIANTI, {
    select: (data) =>
      data
        .map((impianto) => ({
          ...impianto,
          nome: impianto.nome === "Statico 1.650 - Quattro Carri" ? "Quattro Carri" : impianto.nome,
        }))
        .sort((a, b) =>
          a.nome === defaultImpianto ? -1 : b.nome === defaultImpianto ? 1 : a.nome.localeCompare(b.nome)
        ),
  });
  const prodQuery = useQuery(
    ["getProduction", hoursGroup, periodo?.from, periodo?.to],
    () => getProduction(hoursGroup, periodo?.from, periodo?.to),
    {
      keepPreviousData: true,
      select: (data) => {
        return data.map((d) => {
          const res = { ...d, date: new Date(d.date) };
          res.date.setHours(d.hour);
          return res;
        });
      },
    }
  );
  const avgTelaiQuery = useQuery("avgTelai", avgTelai);

  const isSamePeriodo = (a: DateRange | undefined, b: DateRange | undefined) => {
    return a?.from?.getDate() === b?.from?.getDate() && a?.to?.getDate() === b?.to?.getDate();
  };
  return (
    <Wrapper>
      <div className="my-8 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-3 min-w-96 w-full">
        <h2 className="text-left scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
          Andamento Impianti
        </h2>
        <hr className="mt-3 text-gray-800 w-64 mr-auto relative -top-3" />
        <Tabs defaultValue={defaultImpianto} className="mb-3">
          <TabsList>
            {impiantiQuery.data &&
              impiantiQuery.data.map((impianto) => (
                <TabsTrigger disabled={impianto.nome !== defaultImpianto} value={impianto.nome} key={impianto.id}>
                  {impianto.nome}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="font-medium">N° Telai all'ora</CardTitle>
                <FontAwesomeIcon icon={faBolt} className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {avgTelaiQuery.isError && <Error />}
              {avgTelaiQuery.isLoading && <Loading />}
              {avgTelaiQuery.isSuccess && (
                <>
                  <div className="text-2xl font-bold">
                    {toFormattedNumber(avgTelaiQuery.data[0].avgTelai.toFixed(2))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {addSign((avgTelaiQuery.data[0].avgTelai - avgTelaiQuery.data[1].avgTelai).toFixed(2))}{" "}
                    rispetto ai {toFormattedNumber(avgTelaiQuery.data[1].avgTelai.toFixed(2))} dei 7 giorni
                    precedenti
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="min-h-[70vh] col-span-3">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-medium pb-1.5">Produzione Telai</CardTitle>
                  <CardDescription className="text-xs">
                    I dati dalle 7 di mattina di Sabato alle 7 di mattina di Lunedì non vengono mostrati in quanto
                    sono orari non lavorativi.
                  </CardDescription>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="outline">
                      Opzioni
                      <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="left" className="w-96">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center relative">
                        <h4 className="font-medium leading-none">Opzioni Grafico</h4>
                        {(hoursGroup !== defaultHoursGroup || !isSamePeriodo(periodo, defaultPeriodo)) && (
                          <Button
                            variant="ghost"
                            className="absolute -top-3 -right-3"
                            onClick={() => {
                              setHoursGroup(defaultHoursGroup);
                              setPeriodo(defaultPeriodo);
                            }}
                          >
                            Reset <Cross2Icon className="ml-2" />
                          </Button>
                        )}
                      </div>
                      <hr className="mt-2 mb-3 w-1/3" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-1">
                        <Label className="mb-1.5">Raggruppa dati ogni:</Label>
                        <Select
                          value={hoursGroup.toString()}
                          onValueChange={(value) => setHoursGroup(parseInt(value))}
                          defaultValue={hoursGroup.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Ora</SelectItem>
                            <SelectItem value="2">2 Ore</SelectItem>
                            <SelectItem value="3">3 Ore</SelectItem>
                            <SelectItem value="4">4 Ore</SelectItem>
                            <SelectItem value="8">8 Ore</SelectItem>
                            <SelectItem value="24">24 Ore</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label className="mb-1.5">Periodo da considerare:</Label>
                        <DatePickerWithRange
                          value={periodo}
                          onChange={(value) => setPeriodo(value)}
                          disabled={(date) => date > new Date()}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              {prodQuery.isError && <Error />}
              {prodQuery.isLoading && <Loading className="m-auto relative top-28" />}
              {prodQuery.isSuccess && (
                <Line
                  data={{
                    labels: prodQuery.data?.map((d) => d.date),
                    datasets: [
                      {
                        label: "Telai",
                        data: prodQuery.data?.map((d) => d.nTelai),
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "#007eb8",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: true,
                    responsive: true,
                    borderColor: "#007eb8",
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
                          callback: function (value: any, index) {
                            const val: any = this.getLabelForValue(value);
                            return index % 2 === 0
                              ? val.toLocaleString("it-IT", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  hour: "numeric",
                                })
                              : "";
                          },
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          title: function (tooltipItems) {
                            const date = new Date(tooltipItems[0].label);
                            const endHour = date.getHours() + hoursGroup;
                            return (
                              toTitle(
                                date.toLocaleString("it-IT", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  hour: "numeric",
                                })
                              ) +
                              " - " +
                              endHour
                            );
                          },
                          label: function (tooltipItem) {
                            return "N° di telai prodotti: " + toFormattedNumber(tooltipItem.formattedValue);
                          },
                        },
                        ...tooltipStyle,
                      },
                    },
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

export default Impianti;
