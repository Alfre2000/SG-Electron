import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/shadcn/Dialog";
import { useQuery } from "react-query";
import { URLS } from "../../../../../urls";
import Error from "../../../../../components/Error/Error";
import Loading from "../../../../../components/Loading/Loading";
import { Line } from "react-chartjs-2";
import { ArticoloPrice } from "./columns";

type AndamentoPrezziPopoverProps<TData> = {
  id: string;
  data: TData[];
  setShow: (show: string | undefined) => void;
};

type AndamentoPrezzi = {
  andamento_prezzo: {
    date: string;
    prezzo_unitario_calc: number;
  }[];
};

function AndamentoPrezziPopover<TData>({ id, data, setShow }: AndamentoPrezziPopoverProps<TData>) {
  const [open, setOpen] = useState(true);
  const prezziQuery = useQuery<AndamentoPrezzi>(`${URLS.ARTICOLI}${id}/andamento-prezzo/`);
  const finalData = (data as ArticoloPrice[]).find((d) => d.articolo_id === id)!;
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setShow(undefined);
      }}
    >
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-4xl h-[32rem]">
        <DialogHeader>
          <DialogTitle>Andamento Prezzo - {finalData.codice} </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {prezziQuery.isError && <Error />}
        {prezziQuery.isLoading && <Loading />}
        {prezziQuery.isSuccess && (
          <Line
            options={{
              responsive: true,
              borderColor: "#007eb8",
              scales: {
                x: {
                  type: "time",
                },
                y: {
                  grace: "5%",
                  title: {
                    display: true,
                    text: "Prezzo in €",
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
                      const date = new Date(tooltipItems[0].parsed.x);
                      return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });                      
                    },
                    label: function (context) {
                      var label = context.dataset.label || "";
                      if (label) {
                        label += ": ";
                      }
                      if (context.parsed.y !== null) {
                        label += context.parsed.y.toFixed(4).toLocaleString();
                      }
                      return label + " €";
                    },
                  },
                  backgroundColor: "rgba(245, 246, 247, 0.9)",
                  titleColor: "rgba(1, 54, 145, 1)",
                  bodyColor: "rgba(1, 54, 145, 1)",
                  footerColor: "rgba(1, 54, 145, 1)",
                  borderColor: "rgb(0, 46, 92)",
                  borderWidth: 1,
                  padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 20,
                  },
                  displayColors: false,
                  titleFont: {
                    size: 13,
                  },
                  bodyFont: {
                    size: 13,
                  },
                  footerFont: {
                    size: 13,
                    weight: "normal",
                  },
                  footerMarginTop: 4,
                  cornerRadius: 4,
                  titleMarginBottom: 5,
                },
              },
            }}
            data={{
              labels: prezziQuery.data.andamento_prezzo.map((r) => r.date),
              datasets: [
                {
                  data: prezziQuery.data.andamento_prezzo.map((r) => r.prezzo_unitario_calc.toFixed(4)),
                  label: "Prezzo",
                  fill: false,
                  tension: 0.1,
                },
              ],
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AndamentoPrezziPopover;
