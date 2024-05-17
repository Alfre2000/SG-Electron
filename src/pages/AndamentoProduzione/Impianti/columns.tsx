import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Barra } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { URLS } from "urls";

const PopoverBarra = ({ codice }: { codice: string }) => {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {barra.data?.steps.map((step, index) => (
            <TableRow key={step.ingresso}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{step.posizione}</TableCell>
              <TableCell>
                {step.ingresso
                  ? new Date(step.ingresso).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                {step.uscita
                  ? new Date(step.uscita).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "-"}
              </TableCell>
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
          <PopoverTrigger>{row.original.codice}</PopoverTrigger>
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
      return row.original.record_lavorazione || "-";
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
