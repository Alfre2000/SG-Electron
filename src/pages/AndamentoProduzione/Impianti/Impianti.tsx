import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import Wrapper from "@ui/wrapper/Wrapper";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@components/shadcn/Card";
import { Bar, Line } from "react-chartjs-2";
import { Tabs, TabsList, TabsTrigger } from "@components/shadcn/Tabs";
import { URLS } from "urls";
import { Barra, Impianto, PaginationData } from "@interfaces/global";
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
import { DataTable } from "@ui/base-data-table/data-table";
import { columns } from "./columns";
import { averageProductionPerHour, getGroupedProduction } from "./utils";
import { dateToDatePicker } from "utils";

const defaultImpianto = "Quattro Carri";

function Impianti() {
  const defaultPeriodo = { from: addDays(new Date(), -7), to: new Date() };
  const defaultHoursGroup = 1;
  const [hoursGroup, setHoursGroup] = React.useState(defaultHoursGroup);
  const [periodo, setPeriodo] = React.useState<DateRange | undefined>(defaultPeriodo);
  const [impianto, setImpianto] = useState("5");

  const inizio =
    periodo?.from && periodo.from > addDays(new Date(), -15) ? addDays(new Date(), -15) : periodo?.from;

  const barreQuery = useQuery<PaginationData<Barra>>(
    [
      URLS.BARRE,
      { impianto: impianto },
      { custom_page_size: 2000 },
      { inizio: dateToDatePicker(inizio) },
      { end: dateToDatePicker(addDays(periodo?.to || defaultPeriodo.to, 1)) },
    ],
    {
      keepPreviousData: true,
      select: (data) => {
        data.results = data.results.sort((a, b) => new Date(b.inizio).getTime() - new Date(a.inizio).getTime());
        return data;
      },
    }
  );

  const production = React.useMemo(() => {
    if (!barreQuery.data) return [];
    const start = periodo?.from || defaultPeriodo.from;
    const end = periodo?.to || defaultPeriodo.to;
    if (end > new Date()) end.setHours(new Date().getHours());
    return getGroupedProduction(barreQuery.data.results, start, end, hoursGroup);
  }, [barreQuery.data, hoursGroup, periodo, defaultPeriodo.from, defaultPeriodo.to]);

  const avgProduction = React.useMemo(() => {
    return averageProductionPerHour(barreQuery.data?.results || []);
  }, [barreQuery.data]);
  const avgTime = React.useMemo(() => {
    return { currentWeek: 60 / avgProduction.currentWeek, lastWeek: 60 / avgProduction.lastWeek };
  }, [avgProduction]);

  const impiantiQuery = useQuery<Impianto[]>(URLS.IMPIANTI, {
    select: (data) =>
      data
        .map((impianto) => ({
          ...impianto,
          nome: impianto.nome === "Statico 1.650 - Quattro Carri" ? "Quattro Carri" : impianto.nome,
        }))
        .filter((impianto) => impianto.nome !== "Statico 500")
        .sort((a, b) =>
          a.nome === defaultImpianto ? -1 : b.nome === defaultImpianto ? 1 : a.nome.localeCompare(b.nome)
        ),
  });

  const isSamePeriodo = (a: DateRange | undefined, b: DateRange | undefined) => {
    return a?.from?.getDate() === b?.from?.getDate() && a?.to?.getDate() === b?.to?.getDate();
  };
  const limitNewDate = new Date();
  limitNewDate.setHours(limitNewDate.getHours() - 7);

  const firstRedIndex = production.findIndex((d) => {
    return d.date > limitNewDate;
  });

  const datasets = [
    {
      label: "Telai - Blue",
      data: production.map((d) => d.nTelai),
      backgroundColor: "rgba(75, 192, 192, 0.4)",
      borderColor: "#007eb8",
      borderWidth: 1,
      pointBackgroundColor: "rgba(75, 192, 192, 0.4)",
      pointBorderColor: "#007eb8",
      fill: true,
    },
  ];

  const data = {
    labels: production.map((d) => d.date),
    datasets: datasets,
  };

  const barProduction = React.useMemo(() => {
    if (!barreQuery.data) return [];
    const start = periodo?.from || defaultPeriodo.from;
    const end = periodo?.to || defaultPeriodo.to;
    if (end > new Date()) end.setHours(new Date().getHours());
    return getGroupedProduction(barreQuery.data.results, start, end, 12);
  }, [barreQuery.data, periodo, defaultPeriodo.from, defaultPeriodo.to]);
  const barDatasets = [
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
  barProduction.forEach((d, idx) => {
    if (idx % 2 === 0) {
      barDatasets[0].data.push(d.nTelai);
    } else {
      barDatasets[1].data.push(d.nTelai);
    }
  });
  const barData = {
    labels: barProduction.filter((_, idx) => idx % 2 === 0).map((d) => d.date),
    datasets: barDatasets,
  };
  return (
    <Wrapper>
      <div className="my-8 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-3 min-w-96 w-full">
        <h2 className="text-left scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-800">
          Andamento Impianti
        </h2>
        <hr className="mt-3 text-gray-800 w-64 mr-auto relative -top-3" />
        <Tabs value={impianto} onValueChange={setImpianto} className="mb-3">
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
                <CardTitle className="font-medium">N° Telai all'ora</CardTitle>
                <FontAwesomeIcon icon={faBolt} className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {barreQuery.isError && <Error />}
              {barreQuery.isLoading && <Loading />}
              {barreQuery.isSuccess && (
                <>
                  <div className="text-2xl font-bold">
                    {toFormattedNumber(avgProduction.currentWeek.toFixed(2))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {addSign((avgProduction.currentWeek - avgProduction.lastWeek).toFixed(2))} rispetto ai{" "}
                    {toFormattedNumber(avgProduction.lastWeek.toFixed(2))} della settimana precedente
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="font-medium">Frequenza Telai</CardTitle>
                <FontAwesomeIcon icon={faBolt} className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {barreQuery.isError && <Error />}
              {barreQuery.isLoading && <Loading />}
              {barreQuery.isSuccess && (
                <>
                  <div className="text-2xl font-bold">
                    {toFormattedNumber(avgTime.currentWeek.toFixed())} minuti
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {addSign((avgTime.currentWeek - avgTime.lastWeek).toFixed())} rispetto ai{" "}
                    {toFormattedNumber(avgTime.lastWeek.toFixed())} della settimana precedente
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
                    I dati dalle 6 di mattina di Sabato alle 6 di mattina di Lunedì non vengono mostrati in quanto
                    sono orari non lavorativi.
                    <br />
                    L'area grigia rappresenta il periodo in cui la produzione è ancora incerta.
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
                            <SelectItem value="12">Turno</SelectItem>
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
              {barreQuery.isError && <Error />}
              {barreQuery.isLoading && <Loading className="m-auto relative top-28" />}
              {barreQuery.isSuccess && (
                <Line
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
                            title: function (tooltipItems: any) {
                              const date = new Date(tooltipItems[0].label);
                              let endHour = date.getHours() + hoursGroup;
                              if (endHour >= 24) endHour -= 24;
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
                            label: function (tooltipItem: any) {
                              return "N° di telai prodotti: " + toFormattedNumber(tooltipItem.formattedValue);
                            },
                          },
                          ...tooltipStyle,
                        },
                        annotation: {
                          annotations: [
                            ...production
                              .map((d) => {
                                const date = new Date(d.date);
                                if (date.getDay() === 1 && date.getHours() === 6) {
                                  return {
                                    type: "line",
                                    mode: "vertical",
                                    scaleID: "x",
                                    value: d.date,
                                    borderColor: "#123A73",
                                    borderWidth: 2,
                                    borderDash: [10, 5],
                                    label: {
                                      display: true,
                                      content: "Inizio Settimana",
                                      backgroundColor: "rgba(245, 246, 247, 0.9)",
                                      borderColor: "#123A73",
                                      borderWidth: 1,
                                      textAlign: "center",
                                      borderRadius: 4,
                                      yAdjust: 5,
                                      xAdjust: 55,
                                      padding: {
                                        y: 5,
                                        left: 8,
                                        right: 8,
                                      },
                                      position: "start",
                                      font: {
                                        size: 10,
                                        family: "Arial",
                                      },
                                      color: "rgba(1, 54, 145, 1)",
                                    },
                                  };
                                }
                                return null;
                              })
                              .filter((a) => a !== null),
                            {
                              type: "box",
                              xMin: production[firstRedIndex]?.date,
                              xMax: "now",
                              backgroundColor: "rgba(100, 100, 100, 0.2)",
                              borderWidth: 0,
                            },
                          ],
                        },
                      },
                    } as any
                  }
                />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle>Ultime barre</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              {barreQuery.isError && <Error />}
              {barreQuery.isLoading && <Loading />}
              {barreQuery.isSuccess && <DataTable data={barreQuery.data.results} columns={columns} />}
            </CardContent>
          </Card>
          <Card className="min-h-[70vh] col-span-3">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="font-medium pb-1.5">Andamento Produzione</CardTitle>
          </CardHeader>
          <CardContent>
            {barreQuery.isError && <Error />}
            {barreQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {barreQuery.isSuccess && (
              <Bar
                data={barData}
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
    </Wrapper>
  );
}

export default Impianti;
