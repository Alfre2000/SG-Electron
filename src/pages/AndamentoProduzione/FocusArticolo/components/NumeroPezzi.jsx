import React from "react";
import { Card } from "react-bootstrap";
import { URLS } from "../../../../urls";
import useCustomQuery from "../../../../hooks/useCustomQuery/useCustomQuery";
import { useParams } from "react-router";
import Error from "../../../../components/Error/Error";
import Loading from "../../../../components/Loading/Loading";

function NumeroPezzi() {
  const { articoloId } = useParams();
  const recordsQuery = useCustomQuery({
    queryKey: [
      URLS.RECORD_LAVORAZIONI,
      { custom_page_size: "full" },
      { articolo_id: articoloId },
    ],
  });

  const getTotale = (records) => {
    const formatter = new Intl.NumberFormat('it-IT'
    , { style: 'decimal', maximumFractionDigits: 0 }
    );
    const res = records.reduce((acc, curr) => acc + curr.quantità, 0)
    return formatter.format(res);
  }
  const getUom = (records) => {
    const uomCounts = {};
    let mostFrequentUm = { um: null, count: 0 };
    
    for (const record of records) {
      const um = record.um;
      if (!uomCounts[um]) {
        uomCounts[um] = 1;
      } else {
        uomCounts[um]++;
      }
    
      if (uomCounts[um] > mostFrequentUm.count) {
        mostFrequentUm = { um, count: uomCounts[um] };
      }
    }
    return mostFrequentUm.um === "N" ? "" : mostFrequentUm.um;
  }
  return (
    <Card className="text-center min-h-[120px]">
      <Card.Header>N° totale di pezzi</Card.Header>
      <Card.Body className="flex flex-col text-nav-blue">
        {recordsQuery.isError && <Error />}
        {recordsQuery.isLoading && <Loading className="m-auto" />}
        {recordsQuery.isSuccess && (
          <h1 className="text-4xl">{getTotale(recordsQuery.data)} {getUom(recordsQuery.data)}</h1>
        )}
      </Card.Body>
    </Card>
  );
}

export default NumeroPezzi;
