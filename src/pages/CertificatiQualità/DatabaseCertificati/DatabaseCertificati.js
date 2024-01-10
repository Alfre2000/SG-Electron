import { Card, Container, Placeholder, Table } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import Wrapper from "../Wrapper";
import SearchSelect from "../../../components/form-components/SearchSelect";
import Input from "../../../components/form-components/Input";
import { URLS } from "../../../urls";
import { useQuery } from "react-query";
import { searchOptions } from "../../../utils";
import { MESI } from "../../../constants";
import PageContext, { usePageContext } from "../../../contexts/PageContext";
import RecordLavorazioneForm from "../../GestioneImpianto/RecordLavorazione/RecordLavorazioneForm";
import { useState } from "react";
import Paginator from "../../../components/Pagination/Paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
const electron = window?.require ? window.require("electron") : null;

const dateOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

function DatabaseCertificati() {
  const [cliente, setCliente] = useState(null)
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
      defaultFilters={[...flatFilters, { custom_page_size: 10 }]}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
          <PageTitle>Database Certificati</PageTitle>
          <Card className="mt-10 max-w-3xl mx-auto mb-10">
            <Card.Header as="h6" className="font-semibold text-lg">
              Ricerca
            </Card.Header>
            <Card.Body className="px-5 grid grid-cols-2 gap-y-3 mt-3 mb-1 text-right">
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
                options={MESI.map((a, idx) => ({ label: a, value: idx+1 }))}
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
                inputProps={{ onChange: (e) => setFilters((prev) => ({ ...prev, n_lotto_super: e.target.value })) }}
              />
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
  const recordsQuery = useQuery({ queryKey: queryKey, keepPreviousData: true });
  const openCertificato = (record) => {
    electron.ipcRenderer.invoke("open-file", record.certificato);
  };
  return (
    <>
      <Table className="table-fixed w-full align-middle text-center" striped bordered>
        <thead>
          <tr>
            <th className="w-[15%]">Ora</th>
            <th className="w-[20%]">Cliente</th>
            <th className="w-[20%]">Articolo</th>
            <th className="w-[15%]">N° Lotto</th>
            <th className="w-[15%]">N° Bolla</th>
            <th className="w-[15%]">Certificato</th>
          </tr>
        </thead>
        <tbody>
          {recordsQuery.data?.results.map((record) => (
            <tr key={record.id}>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">
                {new Date(record.data).toLocaleString("it-IT", dateOptions)}
              </td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[20%]">{record.cliente}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[20%]">{record.articolo}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{record.n_lotto_super}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{record.n_bolla}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">
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
            </tr>
          ))}
          {recordsQuery.isSuccess && recordsQuery.data.results.length === 0 && (
            <tr>
              <td colSpan={6}>Nessun record presente</td>
            </tr>
          )}
          {recordsQuery.isLoading && Array.from(Array(25)).map((_, idx) => (
            <tr key={idx}>
              <td colSpan={6}>
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
