import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/shadcn/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/shadcn/Table";
import { faBox, faEuroSign, faPercent } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { URLS } from "../../../../urls";
import { useParams } from "react-router-dom";
import { options3 } from "../../../../charts/barOptions";
import { toEuro, toPercentage } from "../../../../utils";
import Error from "../../../../components/Error/Error";
import Loading from "../../../../components/Loading/Loading";
import { createPortal } from "react-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/shadcn/Select";

function Panoramica() {
  const [domReady, setDomReady] = React.useState(false);
  const [timeframe, setTimeframe] = useState("180");
  const { cliente } = useParams();
  const panoramicaQuery = useQuery([`${URLS.CLIENTI}${cliente}/panoramica/?timeframe=${timeframe}`]);
  const months = timeframe === "180" ? 6 : timeframe === "90" ? 3 : 1;

  useEffect(() => {
    setDomReady(true);
  }, []);
  return (
    <>
      {domReady &&
        createPortal(
          <Select onValueChange={(value) => setTimeframe(value)} defaultValue={timeframe} className="min-w-60">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="180">Ultimi 6 Mesi</SelectItem>
              <SelectItem value="90">Ultimi 3 Mesi</SelectItem>
              <SelectItem value="30">Ultimo Mese</SelectItem>
            </SelectContent>
          </Select>,
          document.getElementById("tabs-side")
        )}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatturato Ultimi {months} Mesi</CardTitle>
            <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toEuro(panoramicaQuery.data?.fatturato_current_6_months)}</div>
            <p className="text-xs text-muted-foreground">
              {toPercentage(panoramicaQuery.data?.fatturato_vs_last_6_months, true, 1)} rispetto ai {months} mesi
              precedenti
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quota Fatturato Ultimi {months} Mesi</CardTitle>
            <FontAwesomeIcon icon={faPercent} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPercentage(panoramicaQuery.data?.share_current_6_months, false)}
            </div>
            <p className="text-xs text-muted-foreground">
              {toPercentage(panoramicaQuery.data?.share_vs_last_6_months, true, 1)} rispetto ai {months} mesi
              precedenti
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">N° Lotti Ultimi {months} Mesi</CardTitle>
            <FontAwesomeIcon icon={faBox} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{panoramicaQuery.data?.lotti_current_6_months}</div>
            <p className="text-xs text-muted-foreground">
              {toPercentage(panoramicaQuery.data?.lotti_vs_last_6_months, true, 1)} rispetto ai {months} mesi
              precedenti
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fatturato</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
            {panoramicaQuery.isError && <Error />}
            {panoramicaQuery.isLoading && <Loading className="m-auto relative top-28" />}
            {panoramicaQuery.isSuccess && (
              <Bar
                options={options3}
                data={{
                  labels: panoramicaQuery.data.fatturato_over_time.map((item) =>
                    new Date(item[0]).toLocaleDateString("it-IT", {
                      month: "short",
                      year: "numeric",
                    })
                  ),
                  datasets: [
                    {
                      data: panoramicaQuery.data.fatturato_over_time.map((item) => item[1]),
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
            <CardTitle>Fatturato per Impianto</CardTitle>
            <CardDescription>Ripartizione del fatturato relativo al cliente tra gli impianti</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Table>
              <TableHeader className="text-left">
                <TableRow>
                  <TableHead className="h-8">Impianto</TableHead>
                  <TableHead className="h-8">Fatturato</TableHead>
                  <TableHead className="h-8">Quota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {panoramicaQuery.data?.fatturato_impianti.map((impianto) => (
                  <TableRow key={impianto.nome}>
                    <TableCell className="px-4">{impianto["nome"]}</TableCell>
                    <TableCell className="px-4">{toEuro(impianto["totale"])}</TableCell>
                    <TableCell className="px-4">{toPercentage(impianto["share"] * 100, false)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Panoramica;
