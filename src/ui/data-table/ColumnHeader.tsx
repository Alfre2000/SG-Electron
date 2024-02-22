import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/Select";
import { Button } from "@components/shadcn/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/shadcn/DropdownMenu";
import { cn } from "@lib/utils";
import { SearchInput } from "@components/shadcn/Input";
import React from "react";
import { capitalize } from "utils";
import { ExtendedColumn } from "./DataTable";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  column: ExtendedColumn<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  table,
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  title = title.split("__")[0].replace(/_/g, " ");
  const [search, setSearch] = React.useState<string>(
    (table.getColumn(column.id)?.getFilterValue() as string) ?? ""
  );
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }
  const toggleSorting = (desc: boolean) => {
    const hasChanged =
      (column.getIsSorted() === "asc" && desc) ||
      column.getIsSorted() === false ||
      (column.getIsSorted() === "desc" && !desc);

    column.toggleSorting(desc);

    // Reset page index when the sorting order changes
    if (hasChanged) {
      table.setPageIndex(0);
    }
  };
  const size = column.getSize();
  const auxQueries = table.options?.meta?.auxQueries;
  const options = auxQueries && auxQueries[column.id.split("__")[0]];
  const isBoolean = column.columnDef.type === "boolean";
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 ${size <= 20 ? "ml-1 hover:bg-inherit" : "ml-3 data-[state=open]:bg-accent"}`}
          >
            <span className="capitalize text-base text-medium font-semibold">{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="flex items-center mb-1 -mr-5">
            {!!options || isBoolean ? (
              <Select
                value={table.getColumn(column.id)?.getFilterValue() as string}
                onValueChange={(value) => {
                  setTimeout(() => {
                    table.getColumn(column.id)?.setFilterValue(value);
                  }, 100);
                }}
              >
                <SelectTrigger className="h-8 w-44 pl-2 pr-2 shadow-none border-none mr-5">
                  <div className="flex items-center gap-2 text-muted truncate">
                    <MagnifyingGlassIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                    <SelectValue placeholder={`${capitalize(title)}...`} />
                  </div>
                </SelectTrigger>
                <SelectContent side="top">
                  {!!options ? options.data?.map((option: any) => (
                    <SelectItem key={option.id} value={`${option.id}`}>
                      {option.nome}
                    </SelectItem>
                  )) : (
                    <>
                      <SelectItem value="true">Si</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </>
                  
                  )}
                </SelectContent>
              </Select>
            ) : (
              <>
                <SearchInput
                  type="text"
                  placeholder="Cerca..."
                  className="py-1 h-8 max-w-32"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      table.getColumn(column.id)?.setFilterValue(search);
                    }
                  }}
                />
                <div
                  className="p-1.5 relative -left-6 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => table.getColumn(column.id)?.setFilterValue(search)}
                >
                  <PaperPlaneIcon className="h-3.5 w-3.5 text-muted-foreground/70 " />
                </div>
              </>
            )}
          </div>
          <DropdownMenuItem onClick={() => toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Crescente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Decrescente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
