import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { PaginationData, RecordLavorazioneStatus } from "@interfaces/global";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { URLS } from "urls";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function Magazzino() {
  const { cliente } = useParams();
  const recordQuery = useQuery<PaginationData<RecordLavorazioneStatus>>([
    URLS.RECORD_LAVORAZIONI_STATUS,
    // { consegnato: "false" },
    { cliente: cliente },
    { data__gt: "2024-01-01" },
    { custom_page_size: 500 },
  ]);
  return (
    <div className="mb-20 mt-2">
      {recordQuery.isError && <Error />}
      {recordQuery.isLoading && <Loading className="m-auto relative top-60" />}
      {recordQuery.isSuccess && <DataTable columns={columns} data={recordQuery.data.results} />}
    </div>
  );
}

export default Magazzino;
