import { faCalendarDays, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import Error from "../../../../components/Error/Error";
import Loading from "../../../../components/Loading/Loading";
import { URLS } from "../../../../urls";
import { useParams } from "react-router";
import useCustomQuery from "../../../../hooks/useCustomQuery/useCustomQuery";

const dateOptions = {
  "day": "numeric",
  "month": "long",
  "year": "numeric"
}

function PrimoUltimoLotto() {
  const { articoloId } = useParams();
  const recordsQuery = useCustomQuery({
    queryKey: [
      URLS.RECORD_LAVORAZIONI,
      { custom_page_size: "full" },
      { articolo_id: articoloId },
    ],
  });
  const primoRecord = recordsQuery.data?.[recordsQuery.data.length - 1];
  const ultimoRecord = recordsQuery.data?.[0];
  const primoRecordDate = new Date(primoRecord?.data).toLocaleDateString("it-IT", dateOptions)
  const ultimoRecordDate = new Date(ultimoRecord?.data).toLocaleDateString("it-IT", dateOptions)
  return (
    <Card className="text-center min-h-[120px]">
      <Card.Header>
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="mr-4 text-lg text-slate-100"
        />
        Primo e ultimo lotto
      </Card.Header>
      <Card.Body className="flex items-center">
        {recordsQuery.isError && <Error />}
        {recordsQuery.isLoading && <Loading className="m-auto" />}
        {recordsQuery.isSuccess && (
          <>
            {primoRecordDate}
            <FontAwesomeIcon icon={faRightLong} size="2xl" className="text-nav-blue opacity-100 mx-4" />
            {ultimoRecordDate}
          </>
        )}        
      </Card.Body>
    </Card>
  );
}

export default PrimoUltimoLotto;
