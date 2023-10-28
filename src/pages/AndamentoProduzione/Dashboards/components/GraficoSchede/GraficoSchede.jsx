import React, { useState } from "react";
import { Button, Card, OverlayTrigger, Popover } from "react-bootstrap";
import Error from "../../../../../components/Error/Error";
import Loading from "../../../../../components/Loading/Loading";
import { URLS } from "../../../../../urls";
import { useQuery } from "react-query";
import { options2 } from "../../../../../charts/barOptions";
import { Bar } from "react-chartjs-2";
import { colors } from "../../../../../charts/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faEllipsis } from "@fortawesome/free-solid-svg-icons";

function GraficoSchede() {
  const [visible, setVisible] = useState(false);
  const [timeframe, setTimeframe] = useState("week");
  const query = useQuery({
    queryKey: [URLS.RECORD_LAVORAZIONI_OVER_TIME, { timeframe: timeframe }],
  });
  const popover = (
    <Popover className="max-w-[340px] w-[280px]">
      <Popover.Header className="te xt-center py-1 font-semibold relative">
        <span>Filtri</span>
        <FontAwesomeIcon
          icon={faClose}
          className="absolute rounded-full bg-red-400 text-white w-4 h-4 p-0.5 right-2 top-1.5 hover:bg-red-500 hover:cursor-pointer"
          onClick={() => setVisible(false)}
        />
      </Popover.Header>
      <Popover.Body className="py-2 px-3 my-1 flex gap-2">
        <Button
          active={timeframe === "week"}
          size="sm"
          variant="outline-primary"
          className="w-full mb-1"
          onClick={() => {
            setTimeframe("week");
            setTimeout(() => setVisible(false), 80);
          }}
        >
          Settimana
        </Button>
        <Button
          active={timeframe === "month"}
          size="sm"
          variant="outline-primary"
          className="w-full mb-1"
          onClick={() => {
            setTimeframe("month");
            setTimeout(() => setVisible(false), 80);
          }}
        >
          Mese
        </Button>
        <Button
          active={timeframe === "year"}
          size="sm"
          variant="outline-primary"
          className="w-full mb-1"
          onClick={() => {
            setTimeframe("year");
            setTimeout(() => setVisible(false), 80);
          }}
        >
          Anno
        </Button>
      </Popover.Body>
    </Popover>
  )
  return (
    <Card className="text-center min-h-[400px]">
      <Card.Header className="flex justify-between items-center">
        <div></div>
        <span>Schede Controllo Per Impianto</span>
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          show={visible}
          overlay={popover}
        >
          <div className="cursor-pointer" onClick={() => setVisible(!visible)}>
            <FontAwesomeIcon icon={faEllipsis} size="lg" />
          </div>
        </OverlayTrigger>
      </Card.Header>
      <Card.Body className="flex flex-col justify-center">
        {query.isError && <Error />}
        {query.isLoading && <Loading className="m-auto" />}
        {query.isSuccess && (
          <div className="min-h-[330px] pr-2">
            <Bar
              data={{
                labels: query.data.at(0)?.dati.map((record) => record.label),
                datasets: query.data?.map((data, i) => ({
                  label: data.impianto,
                  data: data.dati.map((record) => record.count),
                  backgroundColor: colors[i],
                  borderColor: colors[i],
                  borderWidth: 1,
                })),
              }}
              options={options2}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default GraficoSchede;