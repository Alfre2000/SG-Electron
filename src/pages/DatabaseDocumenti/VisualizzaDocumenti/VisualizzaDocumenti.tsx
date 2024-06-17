import React, { useMemo } from "react";
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
import { fileIcon } from "@utils/main";
import { Input } from "@components/shadcn/Input";
import Error from "@components/Error/Error";
const fs = window.require("fs");
const path = window.require("path");
const electron = window?.require ? window.require("electron") : null;

const BASE_PATH = localStorage.getItem("BoxPath");

type DocumentiProps = {
  directory?: string;
};

type Documento = { nome: string; isDirectory: boolean };

const listFiles = (dir: string): Documento[] => {
  if (!BASE_PATH) return [];
  const fullPath = path.join(BASE_PATH, dir);

  try {
    const files = fs.readdirSync(fullPath);
    return files.map((file: string) => {
      const filePath = path.join(fullPath, file);
      const stats = fs.statSync(filePath);
      return {
        nome: file,
        isDirectory: stats.isDirectory(),
      };
    });
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
};

function VisualizzaDocumenti({ directory = "" }: DocumentiProps) {
  const [filter, setFilter] = React.useState("");
  const [currentPath, setCurrentPath] = React.useState(directory);

  React.useEffect(() => {
    setCurrentPath(directory);
  }, [directory]);

  const files = useMemo(() => listFiles(currentPath), [currentPath]);
  const filteredDocumenti = useMemo(
    () =>
      files.filter(
        (documento) =>
          documento.nome.toLowerCase().includes(filter.toLowerCase()) && !documento.nome.startsWith(".")
      ),
    [files, filter]
  );

  const handleClick = (documento: Documento) => {
    if (documento.isDirectory) {
      const newPath = currentPath === "" ? documento.nome : path.join(currentPath, documento.nome);
      setCurrentPath(newPath);
    } else {
      const finalPath = path.join(BASE_PATH, currentPath, documento.nome);
      electron.ipcRenderer.invoke("open-local-file", finalPath).catch((error: string) => {
        console.error("Failed to open file:", error);
      });
    }
  };
  const pathList = ["Database Documenti", ...path.normalize(currentPath).split(path.sep)].filter(
    (p) => p !== "."
  );
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">
          {directory || "Database Documenti"}
        </h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      {BASE_PATH ? (
        <>
          <div className={`flex items-center justify-between ${currentPath ? "cursor-pointer" : ""}`}>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faFolder} className="text-xl text-amber-500 mr-3" />
              <Breadcrumb>
                <BreadcrumbList>
                  {pathList.map((directory, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="#"
                          className={`${index === pathList.length - 1 ? "text-foreground" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (index === 0) {
                              setCurrentPath("");
                            } else if (index !== pathList.length - 1) {
                              setCurrentPath(path.join(...pathList.slice(1, index + 1)));
                            }
                          }}
                        >
                          {directory}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < pathList.length - 1 && (
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
                height: Math.max(0, filteredDocumenti.length) * 31 + 21 + "px",
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
                  {filteredDocumenti.length === 0 && (
                    <TableRow>
                      <TableCell className="border border-gray-50 py-1 pl-3">
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        Nessun documento trovato
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredDocumenti.map((documento) => (
                    <TableRow key={documento.nome}>
                      <TableCell
                        className="border border-gray-50 py-1 pl-3 relative cursor-pointer hover:underline"
                        onClick={() => handleClick(documento)}
                      >
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        <div className="flex items-center h-[22px]">
                          {documento.isDirectory ? (
                            <FontAwesomeIcon icon={faFolder} className="text-amber-500 mr-3.5 ml-0.5" />
                          ) : (
                            <FontAwesomeIcon icon={fileIcon(documento.nome)} className="mr-3 text-slate-400 w-5" />
                          )}

                          {documento.nome}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-foreground mt-40">
          <Error message="Il percorso dei documenti non è stato impostato" />
        </div>
      )}
    </div>
  );
}

export default VisualizzaDocumenti;
