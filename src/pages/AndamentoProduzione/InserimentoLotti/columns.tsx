import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecordLavorazione } from "@interfaces/global";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@ui/full-data-table/data-table-column-header";

export const columns: ColumnDef<RecordLavorazione>[] = [
  {
    accessorKey: "n_lotto_super",
    header: "N° Lotto Super",
  },
  {
    accessorKey: "data_arrivo",
    header: "Data Ordine",
    cell: ({ row }) => {
      return new Date(row.original.data_arrivo).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "data",
    header: "Data Lavorazione",
    cell: ({ row }) => {
      const data = new Date(row.original.data);
      if (data.getHours() === 0 && data.getMinutes() === 0 && data.getSeconds() === 0) {
        return "-";
      }
      return data.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },
  },
  {
    id: "inserito",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inserito" />,
    cell: ({ row }) => {
      const icon = row.original.data.includes("T00:00:00") ? faTimes : faCheck;
      const color = row.original.data.includes("T00:00:00") ? "text-red-600" : "text-green-600";
      return <FontAwesomeIcon icon={icon} className={`${color}`} />;
    },
  },
  {
    id: "misurazioni",
    header: "Misurazioni",
    cell: ({ row }) => {
      let n = 0;
      row.original.record_controlli.forEach((controllo) => {
        n += controllo.misurazioni.filter((misurazione) => !!misurazione.manuale).length;
      });
      return n;
    },
  },
  {
    accessorKey: "status",
    header: "Stato",
    cell: ({ row }) => {
      const text = row.original.status === "C" ? "Consegnato" : row.original.status === "F" ? "Fatturato" : "";
      return <span>{text}</span>;
    },
  },
];
