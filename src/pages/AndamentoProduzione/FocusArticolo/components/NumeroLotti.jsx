import React from "react";
import { Card } from "react-bootstrap";
import { URLS } from "../../../../urls";
import useCustomQuery from "../../../../hooks/useCustomQuery/useCustomQuery";
import { useParams } from "react-router";
import Error from "../../../../components/Error/Error";
import Loading from "../../../../components/Loading/Loading";

function NumeroLotti() {
  const { articoloId } = useParams();
  const recordsQuery = useCustomQuery({
    queryKey: [
      URLS.RECORD_LAVORAZIONI,
      { custom_page_size: "full" },
      { articolo_id: articoloId },
    ],
  });
  return (
    <Card className="text-center min-h-[120px]">
      <Card.Header>N° totale di lotti</Card.Header>
      <Card.Body className="flex flex-col text-nav-blue">
        {recordsQuery.isError && <Error />}
        {recordsQuery.isLoading && <Loading className="m-auto" />}
        {recordsQuery.isSuccess && (
          <h1 className="text-4xl">{recordsQuery.data.length}</h1>
        )}
      </Card.Body>
    </Card>
  );
}

export default NumeroLotti;
