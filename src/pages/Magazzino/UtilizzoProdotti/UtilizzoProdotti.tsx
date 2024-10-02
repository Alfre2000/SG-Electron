import { DatePickerWithRange } from "@components/shadcn/DatePicker";
import { Label } from "@components/shadcn/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";
import { Impianto, Movimento } from "@interfaces/global";
import { addDays } from "date-fns";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { dateToDatePicker } from "utils";
import PieChartConsumi from "./pie-chart-consumi";
import ReportMovimentiProdotti from "./report-movimenti-prodotti";

function UtilizzoProdotti() {
  const defaultPeriodo = { from: addDays(new Date(), -30), to: new Date() };
  const impiantiQuery = useQuery<Impianto[]>(URLS.IMPIANTI);
  const [impianto, setImpianto] = useState<string | undefined>(undefined);
  const [periodo, setPeriodo] = React.useState<DateRange | undefined>(defaultPeriodo);
  const [timeframe, setTimeframe] = useState<string>("empty");
  const movimentiQuery = useQuery<Movimento[]>(
    [
      URLS.UTILIZZO_PRODOTTI,
      { tipo: "scarico" },
      { impianto },
      { data_before: dateToDatePicker(periodo?.to) },
      { data_after: dateToDatePicker(periodo?.from) },
    ],
    { enabled: !!impianto && !!periodo, keepPreviousData: true }
  );
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Utilizzo Prodotti</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <div className="flex gap-x-6 justify-start">
        <div>
          <Label className="mb-2 ml-1">Impianto</Label>
          <Select value={impianto} onValueChange={(value) => setImpianto(value)}>
            <SelectTrigger className="w-[250px] bg-white">
              <SelectValue placeholder="Seleziona un impianto" />
            </SelectTrigger>
            <SelectContent>
              {impiantiQuery.data?.map((impianto) => (
                <SelectItem key={impianto.id} value={impianto.id.toString()}>
                  {impianto.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 ml-1">Inizio - Fine</Label>
          <DatePickerWithRange
            value={periodo}
            onChange={(value) => {
              setTimeframe("empty");
              setPeriodo(value);
            }}
          />
        </div>
        <div>
          <Label className="mb-2 ml-1">Timeframe</Label>
          <Select
            value={timeframe}
            onValueChange={(value) => {
              setTimeframe(value);
              if (value === "settimana") {
                setPeriodo({ from: addDays(new Date(), -7), to: new Date() });
              } else if (value === "mese") {
                setPeriodo({ from: addDays(new Date(), -30), to: new Date() });
              } else if (value === "trimestre") {
                setPeriodo({ from: addDays(new Date(), -90), to: new Date() });
              } else if (value === "semestre") {
                setPeriodo({ from: addDays(new Date(), -180), to: new Date() });
              } else if (value === "anno") {
                setPeriodo({ from: addDays(new Date(), -365), to: new Date() });
              }
            }}
          >
            <SelectTrigger className="w-[250px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empty">--------</SelectItem>
              <SelectItem value="settimana">Ultima Settimana</SelectItem>
              <SelectItem value="mese">Ultimo Mese</SelectItem>
              <SelectItem value="trimestre">Ultimi 3 Mesi</SelectItem>
              <SelectItem value="semestre">Ultimi 6 Mesi</SelectItem>
              <SelectItem value="anno">Ultimo Anno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-8">
        <ReportMovimentiProdotti movimenti={movimentiQuery.data || []} />
        <PieChartConsumi movimenti={movimentiQuery.data || []} />
      </div>
    </div>
  );
}

export default UtilizzoProdotti;
