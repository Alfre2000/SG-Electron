import React from "react";
import { Card, Table } from "react-bootstrap";
import Error from "../../../../../components/Error/Error";
import Loading from "../../../../../components/Loading/Loading";
import { URLS } from "../../../../../urls";
import { useQuery } from "react-query";
import Paginator from "../../../../../components/Pagination/Paginator";
import RecordLavorazioneForm from "../../../../../pages/GestioneImpianto/RecordLavorazione/RecordLavorazioneForm";
import { findElementFromID } from "../../../../../utils";
import RecordLavorazioneOssidoForm from "../../../../GestioneImpianto/RecordLavorazioneOssido/RecordLavorazioneOssidoForm";
import MoreActions from "../../../../../components/MoreActions/MoreActions";
import PageContext, { usePageContext } from "../../../../../contexts/PageContext";
import { faBinoculars } from "@fortawesome/free-solid-svg-icons";


const dateOptions = {
  "day": "numeric",
  "month": "short",
  "hour": "numeric",
  "minute": "numeric"
}

function LatestSchedeControllo() {
  return (
    <PageContext 
      FormComponentFn={(r) =>  r.dati_aggiuntivi ? RecordLavorazioneOssidoForm : RecordLavorazioneForm}
      getURL={URLS.RECORD_LAVORAZIONI}
      defaultFilters={[{ custom_page_size: 8 }]}
      impiantoFilter={false}
    >
      <Card className="text-center min-h-[400px]">
        <Card.Header>Ultime Schede Controllo</Card.Header>
        <Card.Body className="flex flex-col">
          <LatestTable />
        </Card.Body>
      </Card>
    </PageContext>
  );
}

export default LatestSchedeControllo;



function LatestTable() {
  const { queryKey, setPage } = usePageContext();
  const recordsQuery = useQuery({ queryKey: queryKey, keepPreviousData: true });
  const impiantiQuery = useQuery({ queryKey: URLS.IMPIANTI });
  const articoliQuery = useQuery({ queryKey: URLS.ARTICOLI });
  const loading = recordsQuery.isLoading || impiantiQuery.isLoading || articoliQuery.isLoading
  const error = recordsQuery.isError || impiantiQuery.isError || articoliQuery.isError
  if (error) return <Error />;
  if (loading) return <Loading className="m-auto" />;
  return (
    <>
      <Table className="table-fixed w-full align-middle text-left" striped>
        <thead>
          <tr>
            <th className="w-[15%]">Ora</th>
            <th className="w-[20%]">Impianto</th>
            <th className="w-[30%]">Cliente</th>
            <th className="w-[30%]">Articolo</th>
            <th className="w-[5%]"></th>
          </tr>
        </thead>
        <tbody>
          {recordsQuery.data?.results.map((record) => (
            <tr key={record.id}>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[15%]">{new Date(record.data).toLocaleString("it-IT", dateOptions)}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[20%]">{findElementFromID(record.impianto, impiantiQuery.data).nome}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[30%]">{findElementFromID(record.articolo, articoliQuery.data).cliente}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[30%]">{findElementFromID(record.articolo, articoliQuery.data).nome}</td>
              <td className="whitespace-nowrap overflow-hidden text-ellipsis w-[5%]">
                <MoreActions 
                  record={record}
                  view={true} 
                  modify={true}
                  del={true}
                  otherActions={[
                    {
                      label: "Focus Articolo",
                      icon: faBinoculars,
                      link: `/andamento-produzione/focus-articolo/${record.articolo}`
                    }
                  ]}
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
