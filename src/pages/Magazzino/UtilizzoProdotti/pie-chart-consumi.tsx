import { Movimento } from "@interfaces/global";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@components/shadcn/Card";
import { Pie } from "react-chartjs-2";
import { useMemo } from "react";
import { getColors } from "@charts/utils";
import { tooltipStyle } from "@charts/barOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign } from "@fortawesome/free-solid-svg-icons";

type Props = {
  movimenti: Movimento[];
};

function PieChartConsumi({ movimenti }: Props) {
  const [groupedMovimenti, colors] = useMemo(() => {
    const grouped = movimenti.reduce((acc, movimento) => {
      if (!acc[movimento.prodotto.nome]) {
        acc[movimento.prodotto.nome] = 0;
      }
      acc[movimento.prodotto.nome] += movimento.prezzo;
      return acc;
    }, {} as Record<string, number>);
    const totale = Object.values(grouped).reduce((acc, value) => acc + value, 0);
    Object.keys(grouped).forEach((key) => {
      if (grouped[key] / totale < 0.01) {
        delete grouped[key];
      }
    });
    const colors = getColors(Object.keys(grouped).length, "0.6");
    return [grouped, colors];
  }, [movimenti]);
  const spesaTotale = Object.values(groupedMovimenti).reduce((acc, value) => acc + value, 0);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spesa Totale nel Periodo Selezionato</CardTitle>
          <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {spesaTotale.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Consumi</CardTitle>
          <CardDescription>
            Consumi suddivisi per prodotto. I prodotti che influiscono per meno dell'1% del totale non vengono
            mostrati.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Pie
              plugins={[]}
              data={{
                labels: Object.keys(groupedMovimenti),
                datasets: [
                  {
                    data: Object.values(groupedMovimenti),
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1,
                  },
                ],
              }}
              options={
                {
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    datalabels: {
                      font: {
                        size: window.innerWidth >= 769 ? 12 : 10,
                      },
                      color: "black",
                      align: "center",
                      formatter: function (value: any, context: any) {
                        return value.label;
                      },
                    },
                    tooltip: {
                      callbacks: {
                        title: function (tooltipItems: any) {
                          return tooltipItems[0].label;
                        },
                        label: function (tooltipItem: any) {
                          return (
                            "Prezzo: " +
                            tooltipItem.raw.toLocaleString("it-IT", { style: "currency", currency: "EUR" })
                          );
                        },
                      },
                      ...tooltipStyle,
                    },
                  },
                } as any
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PieChartConsumi;
