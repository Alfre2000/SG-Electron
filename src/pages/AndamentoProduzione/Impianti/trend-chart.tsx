import { tooltipStyle } from "@charts/barOptions";
import { colors } from "@charts/utils";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Button } from "@components/shadcn/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/shadcn/Card";
import { Input } from "@components/shadcn/Input";
import { Label } from "@components/shadcn/Label";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { URLS } from "urls";

type BarreTrendChart = Record<
  string,
  {
    label: string;
    value: number;
  }[]
>;

type Timeframe = "day" | "week" | "month";
type Metrica = "barre_ora" | "n_barre";
type Turni = Array<[string, string]>;

function TrendChart({ impianto }: { impianto: string }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("week");
  const [metrica, setMetrica] = useState<Metrica>("barre_ora");
  const [turni, setTurni] = useState<Turni>([
    ["06:00", "18:00"],
    ["18:00", "06:00"],
    ["", ""],
  ]);
  const turniValidi = turni.filter(([inizio, fine]) => inizio !== "" && fine !== "");
  const turniString = turniValidi.map(([inizio, fine]) => `${inizio}-${fine}`).join(",");

  const changeTurno = (index: number, subIndex: number, value: string) => {
    setTurni((prev) => {
      const newTurni = [...prev];
      newTurni[index][subIndex] = value;
      return newTurni;
    });
  };

  const trendQuery = useQuery<BarreTrendChart>(
    [URLS.BARRE_TREND_CHART, { impianto }, { timeframe }, { metrica }, { turni: turniString }],
    {
      keepPreviousData: true,
    }
  );
  const shifts = Object.keys(trendQuery.data || {}).sort((a, b) => a.localeCompare(b));
  const barData = {
    labels: trendQuery.data?.[shifts[0]]?.map((item) => item.label) || [],
    datasets: shifts.map((shift, idx) => ({
      label: shifts.length === 1 ? "Barre Prodotte" : shift,
      data: trendQuery.data?.[shift]?.map((item) => item.value) || [],
      backgroundColor: colors[idx],
      borderColor: colors[idx],
      borderWidth: 1,
    })),
  };
  return (
    <Card className="min-h-[70vh] col-span-3">
      <CardHeader className="space-y-0 pb-2 flex justify-between items-start flex-row mb-4">
        <CardTitle className="font-medium pb-1.5 block">Trend Produzione</CardTitle>
        <div className="flex justify-end gap-6">
          <div>
            <Label className="mb-2 ml-1">Timeframe</Label>
            <Select defaultValue="week" onValueChange={(value) => setTimeframe(value as Timeframe)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Giorno</SelectItem>
                <SelectItem value="week">Settimana</SelectItem>
                <SelectItem value="month">Mese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 ml-1">Metrica</Label>
            <Select defaultValue="barre_ora" onValueChange={(value) => setMetrica(value as Metrica)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Metrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="barre_ora">Barre/ora</SelectItem>
                <SelectItem value="n_barre">N° barre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 ml-1">Turni</Label>
            <Popover>
              <PopoverTrigger className="flex">
                <Button className="w-[180px] justify-start" variant="outline">
                  {turniValidi.length === 1 ? "1 Turno" : `${turniValidi.length} Turni`}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid grid-cols-2 gap-x-5">
                  <Label className="mb-2 ml-1">Inizio</Label>
                  <Label className="mb-2 ml-1">Fine</Label>
                  <Input type="time" value={turni[0][0]} onChange={(e) => changeTurno(0, 0, e.target.value)} />
                  <Input type="time" value={turni[0][1]} onChange={(e) => changeTurno(0, 1, e.target.value)} />
                  <Input
                    type="time"
                    className="mt-3"
                    value={turni[1][0]}
                    onChange={(e) => changeTurno(1, 0, e.target.value)}
                  />
                  <Input
                    type="time"
                    className="mt-3"
                    value={turni[1][1]}
                    onChange={(e) => changeTurno(1, 1, e.target.value)}
                  />
                  <Input
                    type="time"
                    className="mt-3"
                    value={turni[2][0]}
                    onChange={(e) => changeTurno(2, 0, e.target.value)}
                  />
                  <Input
                    type="time"
                    className="mt-3"
                    value={turni[2][1]}
                    onChange={(e) => changeTurno(2, 1, e.target.value)}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trendQuery.isError && <Error />}
        {trendQuery.isLoading && <Loading className="m-auto relative top-28" />}
        {trendQuery.isSuccess && (
          <Bar
            data={barData}
            options={
              {
                maintainAspectRatio: true,
                responsive: true,
                scales: {
                  x: {
                    stacked: metrica === "barre_ora" ? false : false,
                  },
                  y: {
                    grace: "5%",
                    beginAtZero: true,
                    stacked: metrica === "barre_ora" ? false : false,
                    title: {
                      display: true,
                      text: metrica === "barre_ora" ? "Barre all'ora prodotte" : "N° barre prodotte",
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
                        return tooltipItems[0].label.replace("Wk.", "Settimana");
                      },
                      label: function (tooltipItem: any) {
                        let value = parseFloat(tooltipItem.raw);
                        const stringValue = value.toLocaleString("it-IT", { maximumFractionDigits: 2 });

                        if (metrica === "barre_ora") {
                          return "Barre all'ora: " + stringValue;
                        } else {
                          return "N° barre prodotte: " + stringValue;
                        }
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
  );
}

export default TrendChart;
