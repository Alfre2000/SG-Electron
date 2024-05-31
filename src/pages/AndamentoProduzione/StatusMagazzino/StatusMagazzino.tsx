import Error from "@components/Error/Error";
import Loading from "@components/Loading/Loading";
import { PaginationData, RecordLavorazioneStatus } from "@interfaces/global";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { apiGet } from "@api/api";
import { Button } from "@components/shadcn/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Input } from "@components/shadcn/Input";
import { Label } from "@components/shadcn/Label";
const electron = window?.require ? window.require("electron") : null;

function StatusMagazzino() {
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() - 45);
  const [endDate, setEndDate] = useState(defaultEndDate);


  const recordQuery = useQuery<PaginationData<RecordLavorazioneStatus>>([
    URLS.RECORD_LAVORAZIONI_STATUS,
    { consegnato: "false" },
    { data_arrivo__gte: "2024-01-01" },
    { data_arrivo__lte: endDate.toISOString().split("T")[0] },
    { n_lotto_super: "/" },
    { custom_page_size: 200 },
    { ordering: "data_arrivo" },
  ]);

  const downloadPDF = () => {
    console.log(`${URLS.RECORD_LAVORAZIONI_STATUS_PDF}?end_date=${endDate.toISOString().split("T")[0]}`);
    
    apiGet(`${URLS.RECORD_LAVORAZIONI_STATUS_PDF}?end_date=${endDate.toISOString().split("T")[0]}`).then((res) => {
      const today = new Date().toLocaleDateString("it-IT").replaceAll("/", "-");
      electron.ipcRenderer.invoke("save-pdf", res, `lotti-arretrati-${today}.pdf`);
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Status Magazzino</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <div className="grid gap-4 select-text">
        <div className="flex justify-between items-center">
          <p className="text-muted text-sm">I lotti sono mostrati dal più vecchio al più recente.</p>
          <div className="flex items-center gap-x-8">
            <div className="w-52 flex items-center">
              <Label className="w-20 mr-3">Fino al: </Label>
              <Input
                onChange={(e) => setEndDate(new Date(e.target.value))}
                type="date"
                value={endDate.toISOString().split("T")[0]}
              />
            </div>
            <Button variant="secondary" className="px-3" onClick={downloadPDF}>
              Scarica PDF
              <FontAwesomeIcon icon={faDownload} className="text-slate-700 ml-3" />
            </Button>
          </div>
        </div>
        {recordQuery.isError && <Error />}
        {recordQuery.isLoading && <Loading className="m-auto relative top-60" />}
        {recordQuery.isSuccess && <DataTable columns={columns} data={recordQuery.data.results} />}
      </div>
    </div>
  );
}

export default StatusMagazzino;
