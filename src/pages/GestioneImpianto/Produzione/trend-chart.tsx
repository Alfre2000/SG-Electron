import { tooltipStyle } from "@charts/barOptions";
import { colors } from "@charts/utils";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@components/shadcn/Card";
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

function TrendChart({ impianto }: { impianto: string }) {
  const trendQuery = useQuery<BarreTrendChart>([
    URLS.BARRE_TREND_CHART,
    { impianto },
    { timeframe: "month" },
    { metrica: "barre_ora" },
    { turni: "06:00-18:00,18:00-06:00" },
  ]);
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
                    stacked: false,
                  },
                  y: {
                    grace: "5%",
                    beginAtZero: true,
                    stacked: false,
                    title: {
                      display: true,
                      text: "Barre all'ora prodotte",
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
                        return "Barre all'ora: " + stringValue;
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
