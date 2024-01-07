import { useState } from "react";
import { Card, OverlayTrigger, Popover, Table, Tooltip, TooltipProps } from "react-bootstrap";
import Error from "../../../../../components/Error/Error";
import Loading from "../../../../../components/Loading/Loading";
import { useQuery } from "react-query";
import { URLS } from "../../../../../urls";
import { RecordMancantiType } from "../../../../../interfaces/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const RecordMancanti = () => {
  const [timeframe, setTimeframe] = useState<"7" | "30" | "365">("30");

  const query = useQuery<RecordMancantiType>({ queryKey: [URLS.RECORD_MANCANTI, { timeframe: timeframe }] });

  const totLotti = query.data?.reduce((acc, impianto) => acc + impianto.total, 0) || 0;
  const totInseriti = query.data?.reduce((acc, impianto) => acc + impianto.inseriti, 0) || 0;

  const renderTooltip = (props: TooltipProps) => (
    <Tooltip id="button-tooltip" {...props}>
      L'allerta è attiva perchè la percentuale di lotti inseriti è inferiore al 90%
    </Tooltip>
  );
  return (
    <Card className="text-center min-h-[590px]">
      <Card.Header>Record Mancanti</Card.Header>
      <Card.Body className="flex flex-col justify-center">
        <p className="text-muted">
          Indica la percentuale di lotti che sono stati inseriti nel programma rispetto a quelli che compaiono in
          Mago.
          <br></br>
          Più il valore si avvicina al 100% e più i lotti sono stati inseriti con costanza.
        </p>
        <div className="min-h-[330px] mx-auto mt-4 mb-2 flex gap-32 w-full justify-center">
          <div className="w-2/5 flex justify-center items-center">
            {query.isError && <Error />}
            {query.isLoading && <Loading />}
            {query.isSuccess && (
              <Table className="text-left" hover>
                <thead>
                  <tr>
                    <th>Impianto</th>
                    <th>Percentuale Inseriti</th>
                  </tr>
                </thead>
                <tbody>
                  {query.data.map((impianto, index) => (
                    <OverlayTrigger
                      placement="left"
                      trigger="click"
                      rootClose
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">Informazioni Dettagliate</Popover.Header>
                          <Popover.Body>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between">
                                <div className="font-semibold">Lotti Totali</div>
                                <div>{impianto.total}</div>
                              </div>
                              <div className="flex justify-between">
                                <div className="font-semibold">Lotti Inseriti</div>
                                <div>{impianto.inseriti}</div>
                              </div>
                              <div className="flex justify-between">
                                <div className="font-semibold">Lotti Mancanti</div>
                                <div>{impianto.total - impianto.inseriti}</div>
                              </div>
                            </div>
                          </Popover.Body>
                        </Popover>
                      }
                      key={index}
                    >
                      <tr className="cursor-pointer">
                        <td>{impianto.impianto__nome}</td>
                        <td className="py-2.5 text-center relative">
                          <span className="font-bold">
                            {((impianto.inseriti / impianto.total) * 100).toFixed(0)} %
                          </span>{" "}
                          su {impianto.total}
                          {impianto.inseriti / impianto.total < 0.9 && (
                            <div className="right-1 top-2 absolute cursor-help">
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip}
                              >
                                <div>
                                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-600" />
                                </div>
                              </OverlayTrigger>
                            </div>
                          )}
                        </td>
                      </tr>
                    </OverlayTrigger>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
          <div className="flex flex-col justify-evenly">
            <div>
              <h3 className="mb-3 font-medium text-lg tracking-wider">SELEZIONA PERIODO</h3>
              <div>
                <button
                  className={`px-2 py-1 rounded-l-md border border-slate-500 hover:bg-slate-100 ${
                    timeframe === "7" ? "bg-slate-200" : ""
                  }`}
                  onClick={() => setTimeframe("7")}
                >
                  7 giorni
                </button>
                <button
                  className={`px-2 py-1 border-y hover:bg-slate-100 ${timeframe === "30" ? "bg-slate-200" : ""}`}
                  onClick={() => setTimeframe("30")}
                >
                  30 giorni
                </button>
                <button
                  className={`px-2 py-1 rounded-r-md border border-slate-500 hover:bg-slate-100 ${
                    timeframe === "365" ? "bg-slate-200" : ""
                  }`}
                  onClick={() => setTimeframe("365")}
                >
                  365 giorni
                </button>
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-medium text-lg tracking-wider">TOTALE</h3>
              {query.isLoading && <Loading className="mt-4" />}
              {query.isSuccess && (
                <>
                  <div className="flex justify-between mb-3 gap-3">
                    <div className="border border-slate-500 rounded-lg px-3 py-2">
                      Totale lotti: <span className="font-bold">{totLotti}</span>
                    </div>
                    <div className="border border-slate-500 rounded-lg px-3 py-2">
                      Lotti inseriti: <span className="font-bold">{totInseriti}</span>
                    </div>
                  </div>
                  <div className="border border-slate-500 rounded-lg px-3 py-2">
                    Percentuale inseriti:{" "}
                    <span className="font-bold">{((totInseriti / totLotti) * 100).toFixed(0)} %</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="text-muted text-sm">I dati sono relativi agli ultimi {timeframe} giorni</Card.Footer>
    </Card>
  );
};

export default RecordMancanti;
