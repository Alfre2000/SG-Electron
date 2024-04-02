import Wrapper from "@ui/wrapper/Wrapper";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import Form from "@components/form/Form";
import { z } from "@/../it-zod";
import { URLS } from "urls";
import { useQuery } from "react-query";
import { findElementFromID, searchOptions } from "utils";
import SearchSelect from "@components/form/SearchSelect";
import { useImpianto } from "@contexts/UserContext";
import { RichiestaCorrezioneBagno } from "@interfaces/global";
import { Checkbox } from "@components/shadcn/Checkbox";
import { Label } from "@components/shadcn/Label";
import { Input as ShadcnInput } from "@components/shadcn/Input";
import Input from "@components/form/Input";

const schema = z.object({
  operatore: z.number(),
  vasca: z.string().min(1, "Campo obbligatorio"),
  quantità: z.string().min(1, "Campo obbligatorio"),
  prodotto: z.string().min(1, "Campo obbligatorio"),
  note: z.string().optional(),
  impianto: z.number(),
  note_completamento: z.string().optional().nullable(),
});

function CorrezioneBagno() {
  const { richiestaID } = useParams();
  const richiestaQuery = useQuery<RichiestaCorrezioneBagno>(URLS.RICHIESTE_CORREZIONE_BAGNO + richiestaID + "/");
  const operatoriQuery = useQuery(URLS.OPERATORI);
  const impiantiQuery = useQuery(URLS.IMPIANTI);
  const impiantoID = useImpianto();
  const impianto = findElementFromID(impiantoID, impiantiQuery.data);
  const navigate = useNavigate();
  return (
    <Wrapper>
      <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full relative">
        <div className="flex justify-between items-center">
          <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">
            Richiesta Correzione Bagno
          </h2>
        </div>
        <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Correzione Bagno - {impianto.nome}</CardTitle>
              <CardDescription>
                Inserire le informazioni relative alla correzione del bagno necessaria.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-14">
              <div className="grid grid-cols-2 gap-y-4 opacity-75">
                <div className="flex justify-start items-center gap-2">
                  <span className="w-32">Impianto:</span>
                  <ShadcnInput
                    value={impianto.nome}
                    disabled
                    className="py-1 h-8 text-center text-foreground w-64 opacity-100"
                  />
                </div>
                <div className="flex justify-end items-center gap-2">
                  <span className="w-32">Vasca:</span>
                  <ShadcnInput
                    value={richiestaQuery.data?.vasca}
                    disabled
                    className="py-1 h-8 text-center text-foreground w-64 opacity-100"
                  />
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span className="w-32">Prodotto:</span>
                  <ShadcnInput
                    value={richiestaQuery.data?.prodotto}
                    disabled
                    className="py-1 h-8 text-center text-foreground w-64 opacity-100"
                  />
                </div>
                <div className="flex justify-end items-center gap-2">
                  <span className="w-32">Quantità:</span>
                  <ShadcnInput
                    value={richiestaQuery.data?.quantità}
                    disabled
                    className="py-1 h-8 text-center text-foreground w-64 opacity-100"
                  />
                </div>
                {richiestaQuery.data?.note && (
                  <div className="col-span-2">
                    <div className="flex justify-start items-center gap-2">
                      <span className="w-36 mr-2">Note:</span>
                      <ShadcnInput
                        value={richiestaQuery.data?.note}
                        disabled
                        className="py-1 h-8 text-left text-foreground opacity-100"
                      />
                    </div>
                  </div>
                )}
              </div>
              <hr className="my-8 w-4/5 mx-auto" />
              <Form
                endpoint={URLS.RICHIESTE_CORREZIONE_BAGNO}
                schema={schema}
                initialData={richiestaQuery.data}
                onSuccess={() => {
                  navigate("/manutenzione/record-lavorazione/");
                }}
              >
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                  <SearchSelect name="operatore" options={searchOptions(operatoriQuery.data, "nome")} />
                  <div className="flex items-center justify-evenly">
                    <Label className="text-base font-normal" htmlFor="eseguita">
                      Eseguita:{" "}
                    </Label>
                    <Checkbox className="text-xl size-6" required name="eseguita" />
                  </div>
                  <div className="col-span-2">
                    <Input
                      name="note_completamento"
                      label="Note:"
                      className="relative -left-2"
                      inputColumns={10}
                    />
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default CorrezioneBagno;
