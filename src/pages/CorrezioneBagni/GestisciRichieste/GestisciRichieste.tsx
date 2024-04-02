import Wrapper from "@ui/wrapper/Wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import React from "react";
import Form from "@components/form/Form";
import { z } from "@/../it-zod";
import { URLS } from "urls";
import Input from "@components/form/Input";
import SearchSelect from "@components/form/SearchSelect";
import { useQuery } from "react-query";
import { findElementFromID, searchOptions } from "utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import Loading from "@components/Loading/Loading";
import Error from "@components/Error/Error";
import { PaginationData, RichiestaCorrezioneBagno } from "@interfaces/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const schema = z.object({
  vasca: z.string().min(1, "Campo obbligatorio"),
  quantità: z.string().min(1, "Campo obbligatorio"),
  prodotto: z.string().min(1, "Campo obbligatorio"),
  note: z.string().optional(),
  impianto: z.number(),
});

function GestisciRichieste() {
  const impiantiQuery = useQuery(URLS.IMPIANTI);
  const richiesteQuery = useQuery<PaginationData<RichiestaCorrezioneBagno>>(URLS.RICHIESTE_CORREZIONE_BAGNO);
  const vecchieQuery = useQuery<PaginationData<RichiestaCorrezioneBagno>>(
    URLS.RICHIESTE_CORREZIONE_BAGNO + "?vecchie=true"
  );
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full relative">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">
            Richieste Correzione Bagni
          </h2>
        </div>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuova richiesta</CardTitle>
              <CardDescription>
                Inserire le informazioni relative alla correzione del bagno necessaria.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form endpoint={URLS.RICHIESTE_CORREZIONE_BAGNO} schema={schema}>
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                  <SearchSelect name="impianto" options={searchOptions(impiantiQuery.data, "nome")} />
                  <Input name="vasca" />
                  <Input name="prodotto" />
                  <Input name="quantità" />
                  <div className="col-span-2">
                    <Input name="note" inputColumns={10} className="relative w-[101%] -left-2" />
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
          {vecchieQuery.isSuccess && vecchieQuery.data.results.length > 0 && (
            <Card className="shadow-red-600 shadow-md" style={{boxShadow: "0px 0px 5px 5px rgba(245, 32, 32, 0.2)"}}>
              <CardHeader>
                <CardTitle className="text-red-700">Richieste correzioni in ritardo</CardTitle>
                <CardDescription>
                  Qui è possibile visualizzare le richieste di correzione dei bagni che non sono state ancora fatte pur essendo passato più di un giorno dal momento della richiesta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-inherit">
                      <TableHead>Data</TableHead>
                      <TableHead>Impianto</TableHead>
                      <TableHead>Vasca</TableHead>
                      <TableHead>Prodotto</TableHead>
                      <TableHead>Quantità</TableHead>
                      <TableHead className="text-center">Eseguita</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vecchieQuery.data.results.map((richiesta) => (
                      <TableRow key={richiesta.id} className="hover:bg-inherit">
                        <TableCell>
                          {new Date(richiesta.data).toLocaleDateString("it-IT", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{findElementFromID(richiesta.impianto, impiantiQuery.data).nome}</TableCell>
                        <TableCell>{richiesta.vasca}</TableCell>
                        <TableCell>{richiesta.prodotto}</TableCell>
                        <TableCell>{richiesta.quantità}</TableCell>
                        <TableCell className="text-center">
                          <FontAwesomeIcon icon={richiesta.data_completamento ? faCheck : faTimes} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Lista richieste correzioni</CardTitle>
              <CardDescription>
                Qui è possibile visualizzare le richieste di correzione dei bagni in ordine cronologico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {richiesteQuery.isLoading && <Loading className="my-auto" />}
              {richiesteQuery.isError && <Error />}
              {richiesteQuery.isSuccess && impiantiQuery.isSuccess && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Impianto</TableHead>
                      <TableHead>Vasca</TableHead>
                      <TableHead>Prodotto</TableHead>
                      <TableHead>Quantità</TableHead>
                      <TableHead className="text-center">Eseguita</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {richiesteQuery.data.results.map((richiesta) => (
                      <TableRow key={richiesta.id}>
                        <TableCell>
                          {new Date(richiesta.data).toLocaleDateString("it-IT", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{findElementFromID(richiesta.impianto, impiantiQuery.data).nome}</TableCell>
                        <TableCell>{richiesta.vasca}</TableCell>
                        <TableCell>{richiesta.prodotto}</TableCell>
                        <TableCell>{richiesta.quantità}</TableCell>
                        <TableCell className="text-center">
                          <FontAwesomeIcon icon={richiesta.data_completamento ? faCheck : faTimes} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default GestisciRichieste;
