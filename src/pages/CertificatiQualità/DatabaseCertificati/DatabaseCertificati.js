import { Button, Card, Container, Placeholder, Table } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import Wrapper from "../Wrapper";
import SearchSelect from "../../../components/form-components/SearchSelect";
import Input from "../../../components/form-components/Input";
import { URLS } from "../../../urls";
import { useMutation, useQuery } from "react-query";
import { searchOptions } from "../../../utils";
import { MESI } from "../../../constants";
import PageContext, { usePageContext } from "../../../contexts/PageContext";
import RecordLavorazioneForm from "../../GestioneImpianto/RecordLavorazione/RecordLavorazioneForm";
import { useState } from "react";
import Paginator from "../../../components/Pagination/Paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilePdf, faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../../../components/shadcn/Dialog";
import { Button as ShadcnButton } from "../../../components/shadcn/Button";
import { Input as ShadcnInput } from "../../../components/shadcn/Input";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "../../../components/shadcn/Form";
import { toast } from "sonner";
import JSZip from "jszip";
import { apiUpdate } from "../../../api/apiV2";
import { getErrors } from "../../../api/utils";
import { useForm } from "react-hook-form";
const electron = window?.require ? window.require("electron") : null;

const dateOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

function DatabaseCertificati() {
  const [cliente, setCliente] = useState(null);
  const clientiQuery = useQuery([URLS.CLIENTI]);
  const articoliQuery = useQuery([URLS.ARTICOLI_NAMES]);
  const anni = Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2023 + i);
  const [filters, setFilters] = useState({});
  const flatFilters = [...Object.entries(filters).map(([k, v]) => ({ [k]: v }))].filter(
    (filter) => Object.values(filter)[0] !== ""
  );
  const articoli = articoliQuery.data?.filter((a) => !cliente?.value || a.cliente === cliente?.value);
  return (
    <PageContext
      getURL={URLS.RECORD_CERTIFICATI}
      postURL={URLS.RECORD_CERTIFICATI}
      FormComponent={RecordLavorazioneForm}
      impiantoFilter={false}
      defaultFilters={[...flatFilters]}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Database Certificati</PageTitle>
          <Card className="mt-10 max-w-3xl mx-auto mb-10">
            <Card.Header as="h6" className="font-semibold text-lg">
              Ricerca
            </Card.Header>
            <Card.Body className="px-5 mt-3 mb-1 ">
              <div className="grid grid-cols-2 gap-y-3 text-right">
                <SearchSelect
                  label="Cliente"
                  options={searchOptions(clientiQuery.data, "nome")}
                  inputProps={{
                    value: cliente,
                    onChange: (e) => setCliente(e) || setFilters((prev) => ({ ...prev, cliente: e?.value })),
                  }}
                />
                <SearchSelect
                  label="Articolo"
                  options={searchOptions(articoli, "nome")}
                  inputProps={{
                    onChange: (e) => setFilters((prev) => ({ ...prev, articolo_id: e?.value })),
                  }}
                />
                <SearchSelect
                  label="Anno"
                  options={anni.map((a) => ({ label: a, value: a }))}
                  inputProps={{
                    onChange: (e) => setFilters((prev) => ({ ...prev, anno: e?.value })),
                  }}
                />
                <SearchSelect
                  label="Mese"
                  options={MESI.map((a, idx) => ({ label: a, value: idx + 1 }))}
                  inputProps={{
                    onChange: (e) => setFilters((prev) => ({ ...prev, mese: e?.value })),
                  }}
                />
                <Input
                  label="N° Bolla"
                  inputProps={{ onChange: (e) => setFilters((prev) => ({ ...prev, n_bolla: e.target.value })) }}
                />
                <Input
                  label="N° Lotto"
                  inputProps={{
                    onChange: (e) => setFilters((prev) => ({ ...prev, n_lotto_super: e.target.value })),
                  }}
                />
              </div>
              <hr className="my-4 w-1/2 mx-auto" />
              <div>
                <DownloadButton />
              </div>
            </Card.Body>
          </Card>
          <Tabella />
        </Container>
      </Wrapper>
    </PageContext>
  );
}

export default DatabaseCertificati;

function Tabella() {
  const { queryKey, setPage } = usePageContext();
  const [recordOpen, setRecordOpen] = useState();
  const recordsQuery = useQuery({ queryKey: queryKey, keepPreviousData: true });
  const openCertificato = (record) => {
    console.log(record.certificato);
    electron.ipcRenderer.invoke("open-file", record.certificato);
  };
  const form = useForm();
  const handleSubmit = (event) => {
    event.preventDefault();
    const file = event.target.certificato.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("certificato", file);
      updateMutation.mutate(formData);
    }
  };
  const updateMutation = useMutation((data) => apiUpdate(URLS.RECORD_LAVORAZIONI + recordOpen.id + "/", data), {
    onSuccess: () => {
      setRecordOpen(null);
      recordsQuery.refetch();
      toast.success("Certificato aggiornato con successo");
    },
    onError: (error) => {
      const errors = getErrors(error);
      console.log(errors);
      toast.error("Si è verificato un errore.");
    },
  });
  return (
    <>
      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Modifica Certificato</DialogTitle>
                <DialogDescription>
                  Sostituisci il certificato di qualità per il lotto <b>{recordOpen?.n_lotto_super}</b>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-3">
                <FormField
                  control={form.control}
                  name="certificato"
                  render={({ field }) => (
                    <FormControl>
                      <FormItem>
                        <FormLabel className="relative left-1">PDF Certificato:</FormLabel>
                        <FormControl>
                          <ShadcnInput type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormControl>
                  )}
                />
              </div>
              <DialogFooter className="mt-4">
                <ShadcnButton type="submit">Carica</ShadcnButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Table className="table-fixed w-full align-middle text-center" striped bordered>
        <thead>
          <tr>
            <th className="w-[12%]">Data</th>
            <th className="w-[19%]">Cliente</th>
            <th className="w-[19%]">Articolo</th>
            <th className="w-[15%]">N° Lotto</th>
            <th className="w-[15%]">N° Bolla</th>
            <th className="w-[10%]">Certificato</th>
            <th className="w-[10%]">Sostituisci</th>
          </tr>
        </thead>
        <tbody>
          {recordsQuery.data?.results.map((record) => (
            <tr key={record.id}>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[12%]">
                {new Date(record.data).toLocaleString("it-IT", dateOptions)}
              </td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[19%]">{record.cliente}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[19%]">{record.articolo}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{record.n_lotto_super}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{record.n_bolla}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[10%]">
                {record.certificato === null ? (
                  "-"
                ) : (
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    className="text-nav-blue text-lg cursor-pointer"
                    onClick={() => openCertificato(record)}
                  />
                )}
              </td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[10%]">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-nav-blue text-lg cursor-pointer"
                  onClick={() => setRecordOpen(record)}
                />
              </td>
            </tr>
          ))}
          {recordsQuery.isSuccess && recordsQuery.data.results.length === 0 && (
            <tr>
              <td colSpan={7}>Nessun record presente</td>
            </tr>
          )}
          {recordsQuery.isLoading &&
            Array.from(Array(25)).map((_, idx) => (
              <tr key={idx}>
                <td colSpan={7}>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} className="rounded-md" />
                  </Placeholder>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Paginator data={recordsQuery.data} setPage={setPage} />
    </>
  );
}

function DownloadButton() {
  const { queryKey } = usePageContext();
  const recordsQuery = useQuery({ queryKey: queryKey, keepPreviousData: true });

  const download = async () => {
    const zip = new JSZip();
    const urls = recordsQuery.data.results.map((record) => record.certificato).filter((url) => url !== null);

    // Fetch each PDF and add it to the zip
    const pdfFetchPromises = urls.map(async (url, index) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      zip.file(url.split("/").at(-1), buffer);
    });

    // Wait for all fetches to complete
    await Promise.all(pdfFetchPromises);

    // Generate ZIP file and trigger download
    zip.generateAsync({ type: "nodebuffer" }).then((content) => {
      electron.ipcRenderer.invoke("save-zip", content, "certificati.zip");
    });
  };

  return (
    <Button className="bg-[#0d6efd]" onClick={download}>
      <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download Certificati
    </Button>
  );
}
