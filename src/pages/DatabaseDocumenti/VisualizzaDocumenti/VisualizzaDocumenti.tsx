import React from "react";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@components/shadcn/Table";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@components/shadcn/BreadCrumb";
import { SlashIcon } from "@radix-ui/react-icons";
import { fileIcon, findAdjacentDirectories } from "@utils/main";
import { Documento } from "@interfaces/global";
import { Input } from "@components/shadcn/Input";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
const electron = window?.require ? window.require("electron") : null;

type DocumentiProps = {
  directory?: string;
};

function VisualizzaDocumenti({ directory = "" }: DocumentiProps) {
  const [filter, setFilter] = React.useState("");
  const [path, setPath] = React.useState(directory);
  const queryString = directory ? `?path=${directory}` : "";
  const schedeQuery = useQuery<Documento[]>(URLS.DOCUMENTI + queryString);
  React.useEffect(() => {
    setPath(directory);
  }, [directory]);
  let completePath = path.split("/").filter((p) => p !== "");
  if (!directory) completePath.unshift("Database Documenti");
  const directories = schedeQuery.data
    ? [
        ...findAdjacentDirectories(
          path,
          schedeQuery.data.map((doc) => doc.path)
        ),
      ].filter((d) => d !== "")
    : [];
  const filteredDocumenti = schedeQuery.data?.filter(
    (documento) => documento.path === path && documento.nome.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">
          {directory || "Database Documenti"}
        </h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      {schedeQuery.isLoading && <Loading className="mt-40" />}
      {schedeQuery.isError && <Error />}
      {schedeQuery.isSuccess && filteredDocumenti && (
        <>
          <div className={`flex items-center justify-between ${path ? "cursor-pointer" : ""}`}>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faFolder} className="text-xl text-amber-500 mr-3" />
              <Breadcrumb>
                <BreadcrumbList>
                  {completePath.map((directory, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="#"
                          className={`${index === completePath.length - 1 ? "text-foreground" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (index !== completePath.length - 1) {
                              setPath(
                                path
                                  .split("/")
                                  .slice(0, index + 1)
                                  .join("/")
                              );
                            }
                          }}
                        >
                          {directory}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < completePath.length - 1 && (
                        <BreadcrumbSeparator>
                          <SlashIcon />
                        </BreadcrumbSeparator>
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div>
              <Input
                placeholder="Cerca..."
                className="w-48 py-1 h-6 rounded-sm relative bottom-1"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-start justify-start">
            <div
              className="relative"
              style={{
                height: Math.max(0, filteredDocumenti.length + directories.length) * 31 + 21 + "px",
                width: "1px",
                left: "8px",
                background: "#bfc2c7",
              }}
            ></div>
            <div className="flex-grow">
              <Table className="ml-8 mt-[11px] w-[96%] overflow-visible">
                <TableHeader className="p-0">
                  <TableRow className="p-0 text-xs text-muted font-normal">
                    <TableHead className="py-1 pl-3 h-6">
                      <span className="ml-[19px]">
                        Nome File{" "}
                        {filteredDocumenti.length ? (
                          <span className="text-[10px] relative bottom-px left-1">
                            ({filteredDocumenti.length}{" "}
                            {filteredDocumenti.length === 1 ? "documento" : "documenti"})
                          </span>
                        ) : null}
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocumenti.length === 0 && directories.length === 0 && (
                    <TableRow>
                      <TableCell className="border border-gray-50 py-1 pl-3">
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        Nessun documento trovato
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredDocumenti.map((documento) => (
                    <TableRow key={documento.id}>
                      <TableCell
                        className="border border-gray-50 py-1 pl-3 relative cursor-pointer hover:underline"
                        onClick={() => electron.ipcRenderer.invoke("open-file", documento.file, false)}
                      >
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        <div className="flex items-center h-[22px]">
                          <FontAwesomeIcon icon={fileIcon(documento.file)} className="mr-3 text-slate-400 w-5" />
                          {documento.nome}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {[...directories].map((directory) => (
                    <TableRow key={directory}>
                      <TableCell
                        className="border border-gray-50 py-1 pl-3 relative cursor-pointer"
                        onClick={() => setPath(path === "" ? directory : path + "/" + directory)}
                      >
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        <div className="h-[22px]">
                          <FontAwesomeIcon icon={faFolder} className="text-amber-500 mr-2" />
                          {directory}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VisualizzaDocumenti;
