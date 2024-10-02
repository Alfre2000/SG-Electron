import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Barra } from "@interfaces/global";
import { durata } from "@lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { toEuro } from "@utils/main";
import RecordLavorazioneDialog from "features/record-lavorazione/record-lavorazione-dialog";
import { useQuery } from "react-query";
import { URLS } from "urls";

export const PopoverBarra = ({ codice, costo = true }: { codice: string; costo?: boolean }) => {
  const barra = useQuery<Barra>(URLS.BARRE + codice + "/", {
    select: (data) => {
      data.steps = data.steps.sort((a, b) => {
        return new Date(a.ingresso).getTime() - new Date(b.ingresso).getTime();
      });
      return data;
    },
  });
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <strong>Step</strong>
            </TableHead>
            <TableHead>
              <strong>Posizione</strong>
            </TableHead>
            <TableHead>
              <strong>Ingresso</strong>
            </TableHead>
            <TableHead>
              <strong>Uscita</strong>
            </TableHead>
            <TableHead>
              <strong>Durata</strong>
            </TableHead>
            {costo && (
              <TableHead>
                <strong>Costo</strong>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {barra.data?.steps.map((step, index) => (
            <TableRow key={step.ingresso}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{step.posizione}</TableCell>
              <TableCell>
                {step.ingresso
                  ? new Date(step.ingresso).toLocaleTimeString("it-IT", {
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                {step.uscita
                  ? new Date(step.uscita).toLocaleTimeString("it-IT", {
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                {!step.ingresso || !step.uscita ? "-" : durata(new Date(step.ingresso), new Date(step.uscita))}
              </TableCell>
              {costo && <TableCell>{step.costo_metallo > 0 ? toEuro(step.costo_metallo) : "-"}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const columns: ColumnDef<Barra>[] = [
  {
    accessorKey: "codice",
    header: "ID",
    cell: ({ row }) => {
      return (
        <Popover>
          <PopoverTrigger>{row.original.codice.split("-").at(-1)!}</PopoverTrigger>
          <PopoverContent className="max-h-[450px] overflow-scroll w-[700px]">
            <PopoverBarra codice={row.original.codice} />
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "record_lavorazione",
    header: "Record Lavorazione",
    cell: ({ row }) => {
      if (!row.original.record_lavorazione) return "-";
      const n_lotti = row.original.record_lavorazione.split(",");
      const ids = row.original.record_ids?.split(",");
      return (
        <div>
          {n_lotti.map((n_lotto, index) => (
            <>
              <RecordLavorazioneDialog key={n_lotto.trim()} recordID={ids![index]} n_lotto_super={n_lotto.trim()} />
              {index < n_lotti.length - 1 && <span>,</span>}
            </>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "inizio",
    header: "Data Inizio",
    cell: ({ row }) => {
      return new Date(row.original.inizio).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "dataFine",
    header: "Data Fine",
    cell: ({ row }) => {
      if (!row.original.fine) return "";
      return new Date(row.original.fine).toLocaleString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "articolo",
    header: "Codice Trattamento",
  },
  {
    accessorKey: "n_steps",
    header: "N° di step",
  },
];
