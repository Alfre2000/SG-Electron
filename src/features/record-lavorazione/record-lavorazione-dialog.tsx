import React from "react";
import { useQuery } from "react-query";
import { URLS } from "urls";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/shadcn/Dialog";
import { toEuro, toFormattedNumber } from "@utils/main";
import { RecordLavorazioneDetail } from "@interfaces/global";
import { STATUS } from "../../constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

type Props = {
  recordID: string;
  n_lotto_super: string;
};

function RecordLavorazioneDialog({ recordID, n_lotto_super }: Props) {
  const { data, isSuccess } = useQuery<RecordLavorazioneDetail>(URLS.RECORD_LAVORAZIONE_DETAIL + recordID);
  return (
    <Dialog>
      <DialogTrigger>{n_lotto_super}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Lotto n° {n_lotto_super}</DialogTitle>
          <hr className="mt-2 mx-auto w-2/3" />
        </DialogHeader>
        {isSuccess && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-start mx-10">
                <div className="space-y-2">
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Cliente:</h4>
                    <span>{data.cliente}</span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Articolo:</h4>
                    <span>{data.articolo}</span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Trattamenti:</h4>
                    <span>{data.trattamenti}</span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Quantità:</h4>
                    <span>
                      {toFormattedNumber(data.quantità)}
                      {data.um === "KG" ? <span> Kg</span> : <span> pz</span>}
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Prezzo:</h4>
                    <span>{toEuro(data.prezzo)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Data Ordine:</h4>
                    <span>
                      {new Date(data.data_arrivo).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Status:</h4>
                    <span>{STATUS.find((s) => s.value === data.status)?.label}</span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Impianto:</h4>
                    <span>{data.impianto}</span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">Lotto Cliente:</h4>
                    <span>{data.n_lotto_cliente ?? "-"}</span>
                  </div>
                  <div className="flex justify-start items-center gap-x-2">
                    <h4 className="font-semibold w-32 text-left">DDT Cliente:</h4>
                    {data.ddt_cliente ?? "-"}
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center gap-x-2 mx-10">
                <h4 className="font-semibold w-32 text-left">Descrizione:</h4>
                {data.descrizione ?? ""}
                <span></span>
              </div>
            </div>
            <h3 className="mx-auto uppercase tracking-wider font-medium text-lg">Bagnate</h3>
            <hr className="-mt-4 mx-auto w-2/3" />
            <div className="mx-8 -mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codice</TableHead>
                    <TableHead>Inizio</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Articolo</TableHead>
                    <TableHead>Quantità</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.barre.length > 0 &&
                    data.barre
                      .filter((barra) => !!barra.valida)
                      .sort((a, b) => b.codice.localeCompare(a.codice))
                      .map((barra) => (
                        <TableRow key={barra.codice}>
                          <TableCell>{barra.codice.slice(3)}</TableCell>
                          <TableCell>
                            {new Date(barra.inizio).toLocaleDateString("it-IT", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell>
                            {barra.fine
                              ? new Date(barra.fine).toLocaleDateString("it-IT", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </TableCell>
                          <TableCell>{barra.articolo}</TableCell>
                          <TableCell>
                            {barra.quantità ? toFormattedNumber(barra.quantità) + " " + barra.um : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                  {data.barre.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Non è stata ancora inserita nessuna bagnata
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <h3 className="mx-auto uppercase tracking-wider font-medium text-lg mt-4">Consegne</h3>
            <hr className="-mt-4 mx-auto w-2/3" />
            <div className="mx-8 pb-10 -mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bolla</TableHead>
                    <TableHead>Data Consegna</TableHead>
                    <TableHead>Quantità</TableHead>
                    <TableHead>Data Fattura</TableHead>
                    <TableHead>Certificato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.consegne.length > 0 &&
                    data.consegne
                      .sort((a, b) => b.n_bolla.localeCompare(a.n_bolla))
                      .map((consegna) => (
                        <TableRow key={consegna.id}>
                          <TableCell>
                            {consegna.n_bolla}.{consegna.riga_bolla}
                          </TableCell>
                          <TableCell>
                            {new Date(consegna.data_consegna).toLocaleDateString("it-IT", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            {toFormattedNumber(consegna.quantità)}
                            {data.um === "KG" ? <span> Kg</span> : <span> pz</span>}
                          </TableCell>
                          <TableCell>
                            {consegna.data_fattura
                              ? new Date(consegna.data_fattura).toLocaleDateString("it-IT", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="ml-6">
                              <a href={consegna.certificato} target="_blank" rel="noreferrer">
                                <FontAwesomeIcon icon={faFilePdf} className="text-nav-blue text-lg" />
                              </a>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  {data.consegne.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Non è stato ancora consegnato nulla
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RecordLavorazioneDialog;
