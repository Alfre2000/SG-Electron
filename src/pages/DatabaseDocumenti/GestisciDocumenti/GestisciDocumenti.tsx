import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { URLS } from "urls";
import { Documento as Doc } from "@interfaces/global";
import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faFolder, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@components/shadcn/Table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/shadcn/Form";
import { Input } from "@components/shadcn/Input";
import { apiDelete, apiUpdate } from "@api/apiV2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { Button } from "@components/shadcn/Button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { fileIcon, findAdjacentDirectories } from "@utils/main";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@components/shadcn/BreadCrumb";
import { SlashIcon } from "@radix-ui/react-icons";
import Draggable from "@pages/DatabaseDocumenti/GestisciDocumenti/Draggable";
import InputNome from "./InputNome";
const electron = window?.require ? window.require("electron") : null;

function GestisciDocumenti() {
  const [filter, setFilter] = useState("");
  const [path, setPath] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState("");
  const [documentoModify, setDocumentoModify] = useState<string | null>(null);
  const documentiQuery = useQuery<Doc[]>(URLS.DOCUMENTI);
  const filteredDocumenti = documentiQuery.data?.filter(
    (documento) => documento.path === path && documento.nome.toLowerCase().includes(filter.toLowerCase())
  );
  const directories = documentiQuery.data
    ? [
        ...findAdjacentDirectories(
          path,
          documentiQuery.data.map((doc) => doc.path)
        ),
      ].filter((d) => d !== "")
    : [];

  const open = (documento: Doc) => {
    electron.ipcRenderer.invoke("open-file", documento.file);
  };
  const deleteMutation = useMutation(() => apiDelete(URLS.DOCUMENTI + isDeleteOpen + "/"), {
    onSuccess: () => {
      if (filteredDocumenti?.length === 1) {
        setPath(path.split("/").slice(0, -1).join("/"));
      }
      setIsDeleteOpen("");
      documentiQuery.refetch();
      toast.success("Documento eliminato con successo!");
    },
    onError: () => {
      setIsDeleteOpen("");
      toast.error("Errore durante l'eliminazione del documento");
    },
  });
  const form = useForm();
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const file = event.target.file.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      updateMutation.mutate(formData);
    }
  };
  const updateMutation = useMutation(
    (data: FormData) => apiUpdate(URLS.UPDATE_DOCUMENTO + documentoModify + "/", data),
    {
      onSuccess: () => {
        setDocumentoModify(null);
        documentiQuery.refetch();
        toast.success("Documento sostituito con successo");
      },
      onError: (error) => {
        toast.error("Si è verificato un errore.");
      },
    }
  );
  const completePath = ["Database Documenti", ...path.split("/").filter((p) => p !== "")];
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Database Documenti</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      {documentiQuery.isLoading && <Loading className="mt-40" />}
      {documentiQuery.isError && <Error />}
      {documentiQuery.isSuccess && filteredDocumenti && (
        <Draggable className="relative my-3 min-h-[70vh]" path={path}>
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
                              setPath(path.split("/").slice(0, index).join("/"));
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
                    <TableHead className="py-1 pl-3 h-6">Ultima Modifica</TableHead>
                    <TableHead className="py-1 text-center h-6">Visualizza</TableHead>
                    <TableHead className="py-1 text-center h-6">Sostituisci</TableHead>
                    <TableHead className="py-1 text-center h-6">Elimina</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocumenti.length === 0 && directories.length === 0 && (
                    <TableRow>
                      <TableCell className="border border-gray-50 py-1 pl-3" colSpan={5}>
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        Nessun documento trovato
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredDocumenti.map((documento) => (
                    <TableRow key={documento.id}>
                      <TableCell className="border border-gray-50 py-1 pl-3 relative w-1/3">
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={fileIcon(documento.file)} className="mr-3 text-slate-400" />
                          <InputNome documento={documento} />
                        </div>
                      </TableCell>
                      <TableCell className="border border-gray-50 py-1 pl-3 text-muted text-xs w-1/4">
                        {new Date(documento.ultima_modifica).toLocaleDateString("it-IT", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell
                        className="py-1 border border-gray-50 text-center cursor-pointer"
                        onClick={() => open(documento)}
                      >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" className="text-slate-400" />
                      </TableCell>
                      <TableCell
                        className="py-1 border border-gray-50 text-center cursor-pointer"
                        onClick={() => setDocumentoModify(documento.id)}
                      >
                        <FontAwesomeIcon icon={faUpload} size="sm" className="text-slate-400" />
                      </TableCell>
                      <TableCell
                        className="py-1 border border-gray-50 text-center cursor-pointer"
                        onClick={() => setIsDeleteOpen(documento.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} size="sm" className="text-red-800/70" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {[...directories].map((directory) => (
                    <TableRow key={directory}>
                      <TableCell
                        className="border border-gray-50 py-1 pl-3 relative w-1/2 cursor-pointer"
                        onClick={() => setPath(path === "" ? directory : path + "/" + directory)}
                      >
                        <hr className="absolute top-[15px] w-[25px] left-[-25px]" />
                        <div className="h-[22px]">
                          <FontAwesomeIcon icon={faFolder} className="text-amber-500 mr-2" />
                          {directory}
                        </div>
                      </TableCell>
                      <TableCell className="border border-gray-50 py-1 pl-3 w-1/3"></TableCell>
                      <TableCell className="border border-gray-50 py-1 pl-3"></TableCell>
                      <TableCell className="border border-gray-50 py-1 pl-3"></TableCell>
                      <TableCell className="border border-gray-50 py-1 pl-3"></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Draggable>
      )}
      <Dialog open={!!isDeleteOpen} onOpenChange={() => setIsDeleteOpen("")}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="font-semibold text-xl">Sei sicuro di volerlo eliminare ?</DialogTitle>
            <DialogDescription>
              Questa azione non può essere annullata.
              <br /> Una volta eliminato il documento non sarà più recuperabile.
            </DialogDescription>
          </DialogHeader>
          <hr />
          <DialogFooter>
            <Button variant="destructive" onClick={() => deleteMutation.mutate()}>
              Elimina
            </Button>
            <DialogClose asChild>
              <Button>Annulla</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!documentoModify} onOpenChange={() => setDocumentoModify(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Sostituisci il Documento</DialogTitle>
              </DialogHeader>
              <div className="mt-3">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => {
                    const { value, ...fieldProps } = field;
                    return (
                      <FormControl>
                        <FormItem>
                          <FormLabel className="relative left-1">Nuovo File:</FormLabel>
                          <FormControl>
                            <Input required type="file" {...fieldProps} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    );
                  }}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">Carica</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GestisciDocumenti;
