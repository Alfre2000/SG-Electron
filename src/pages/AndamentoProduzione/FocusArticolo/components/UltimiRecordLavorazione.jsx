import React from "react";
import { Card, Table } from "react-bootstrap";
import Error from "../../../../components/Error/Error";
import Loading from "../../../../components/Loading/Loading";
import { URLS } from "../../../../urls";
import { useQuery } from "react-query";
import Paginator from "../../../../components/Pagination/Paginator";
import RecordLavorazioneForm from "../../../../pages/GestioneImpianto/RecordLavorazione/RecordLavorazioneForm";
import { findElementFromID } from "../../../../utils";
import RecordLavorazioneOssidoForm from "../../../GestioneImpianto/RecordLavorazioneOssido/RecordLavorazioneOssidoForm";
import MoreActions from "../../../../components/MoreActions/MoreActions";
import PageContext, { usePageContext } from "../../../../contexts/PageContext";
import { faCheck, faFilePdf, faScrewdriver, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const electron = window?.require ? window.require("electron") : null;


const dateOptions = {
  "day": "numeric",
  "month": "short",
  "hour": "numeric",
  "minute": "numeric"
}

function UltimiRecordLavorazione() {
  const { articoloId } = useParams();
  return (
    <PageContext 
      FormComponentFn={(r) =>  r.dati_aggiuntivi ? RecordLavorazioneOssidoForm : RecordLavorazioneForm}
      getURL={URLS.RECORD_LAVORAZIONI}
      defaultFilters={[{ custom_page_size: 8 }, { articolo_id: articoloId }]}
      impiantoFilter={false}
    >
      <Card className="text-center">
        <Card.Header>
          <FontAwesomeIcon icon={faScrewdriver} className="mr-4 text-lg text-slate-100" />
          Ultime Schede Controllo
        </Card.Header>
        <Card.Body className="flex flex-col">
          <LatestTable />
        </Card.Body>
      </Card>
    </PageContext>
  );
}

export default UltimiRecordLavorazione;



function LatestTable() {
  const { queryKey, setPage } = usePageContext();
  const recordsQuery = useQuery({ queryKey: queryKey, keepPreviousData: true });
  const operatoriQuery = useQuery({ queryKey: URLS.OPERATORI });
  const loading = recordsQuery.isLoading || operatoriQuery.isLoading
  const error = recordsQuery.isError || operatoriQuery.isError
  const openCertificato = (record) => {
    electron.ipcRenderer.invoke("open-file", record.certificato);
  }
  if (error) return <Error />;
  if (loading) return <Loading className="m-auto" />;
  return (
    <>
      <Table className="table-fixed w-full align-middle text-center" striped>
        <thead>
          <tr>
            <th className="w-[15%]">Ora</th>
            <th className="w-[15%]">Lotto</th>
            <th className="w-[15%]">Operatore</th>
            <th className="w-[10%]">Quantità</th>
            <th className="w-[10%]">Scarti</th>
            <th className="w-[15%]">Completata</th>
            <th className="w-[15%]">Certificato</th>
            <th className="w-[5%]"></th>
          </tr>
        </thead>
        <tbody>
          {recordsQuery.data?.results.map((record) => (
            <tr key={record.id}>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{new Date(record.data).toLocaleString("it-IT", dateOptions)}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{record.n_lotto_super || record.n_lotto_cliente}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{findElementFromID(record.operatore, operatoriQuery.data).nome}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{record.quantità}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[10%]">{record.scarti || 0}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[10%]">
                <FontAwesomeIcon className="border-0 bg-transparent" icon={record.completata === true ? faCheck : faXmark} />
              </td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">
                {record.certificato === null ? "-" : (
                  <FontAwesomeIcon icon={faFilePdf} className="text-nav-blue text-lg cursor-pointer" onClick={() => openCertificato(record)} />  
                )}
              </td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[5%]">
                <MoreActions 
                  record={record}
                  view={true} 
                  modify={true}
                  del={true}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginator data={recordsQuery.data} setPage={setPage}/>
   </>
  )
}
