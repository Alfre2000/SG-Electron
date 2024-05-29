import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { PaginationData, RecordLavorazioneStatus } from "@interfaces/global";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function StatusMagazzino() {
  const recordQuery = useQuery<PaginationData<RecordLavorazioneStatus>>([
    URLS.RECORD_LAVORAZIONI_STATUS,
    { consegnato: "false" },
    { data_arrivo__gt: "2024-01-01" },
    { n_lotto_super: "/" },
    { custom_page_size: 200 },
    { ordering: "data_arrivo" },
  ]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Status Magazzino</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <div className="grid gap-4 select-text">
        <p className="text-muted text-sm">I lotti sono mostrati dal più vecchio al più recente.</p>
        {recordQuery.isError && <Error />}
        {recordQuery.isLoading && <Loading className="m-auto relative top-60" />}
        {recordQuery.isSuccess && <DataTable columns={columns} data={recordQuery.data.results} />}
      </div>
    </div>
  );
}

export default StatusMagazzino;
