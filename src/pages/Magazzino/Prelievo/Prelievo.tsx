import Form from "@components/form/Form";
import Hidden from "@components/form/Hidden";
import Input from "@components/form/Input";
import SearchSelect, { Option } from "@components/form/SearchSelect";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { URLS } from "urls";
import { searchOptions } from "utils";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import { useFormContext } from "react-hook-form";
import { Impianto, Movimento, Operatore, PaginationData, Prodotto } from "@interfaces/global";
import { DataTable } from "@ui/full-data-table/data-table";
import { columns } from "./columns";
import Loading from "@components/Loading/Loading";
import Error from "@components/Error/Error";

const schema = z.object({
  prodotto: z.number(),
  fornitore: z.string().optional(),
  scorta_magazzino: z.string().optional(),
  scorta_minima: z.string().optional(),
  quantità: z.string().transform((val) => parseFloat(val)),
  destinazione: z.number(),
  operatore: z.number(),
  tipo: z.string(),
  um: z.string(),
});

function Prelievo() {
  const movimentiQuery = useQuery<PaginationData<Movimento>>([URLS.MOVIMENTI, { tipo: "scarico" }, { custom_page_size: 200 }]);
  const queryClient = useQueryClient();
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Prelievo Magazzino</h2>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prelievo Magazzino</CardTitle>
          <CardDescription>Compila il form per prelevare un prodotto dal magazzino.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            endpoint={URLS.MOVIMENTI}
            schema={schema}
            onSuccess={() => queryClient.invalidateQueries(URLS.PRODOTTI)}
          >
            <ProdottoForm />
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prelievi Passati</CardTitle>
          <CardDescription>Visualizza i prelievi passati dal magazzino.</CardDescription>
        </CardHeader>
        <CardContent>
          {movimentiQuery.isLoading && <Loading />}
          {movimentiQuery.isError && <Error />}
          {movimentiQuery.isSuccess && <DataTable columns={columns} data={movimentiQuery.data.results} />}
        </CardContent>
      </Card>
    </div>
  );
}

function ProdottoForm() {
  const prodottiQuery = useQuery<Prodotto[]>(URLS.PRODOTTI);
  const operatoriQuery = useQuery<Operatore[]>([URLS.OPERATORI, { can_magazzino: true }]);
  const [umOptions, setUmOptions] = useState<Option[]>([]);
  const { setValue } = useFormContext();
  const [impiantoOptions, setImpiantoOptions] = useState<Option[]>([]);
  return (
    <>
      <Hidden name="tipo" value="scarico" />
      <div className="grid gap-4">
        <div className="flex gap-x-20">
          <div className="w-1/2">
            <SearchSelect
              name="prodotto"
              options={searchOptions(prodottiQuery.data, "nome")}
              onChange={(value) => {
                if (!value) {
                  setValue("fornitore", "");
                  setValue("scorta_magazzino", "");
                  setValue("scorta_minima", "");
                  setValue("um", "");
                  setValue("destinazione", "");
                  setImpiantoOptions([]);
                  setUmOptions([]);
                  return;
                }
                if (!prodottiQuery.data) return;
                const prodotto = prodottiQuery.data.find((prodotto) => prodotto.id === value.value)!;
                setValue("fornitore", prodotto?.prodotti_fornitori.map((pf) => pf.fornitore.nome_semplice).join(", "));
                const scorta = `${(prodotto?.scorta_magazzino / prodotto?.dimensioni_unitarie)} ${prodotto?.nome_unità}`;
                setValue("scorta_magazzino", scorta);
                const scorta_minima = `${(prodotto?.scorta_minima / prodotto?.dimensioni_unitarie)} ${prodotto?.nome_unità}`;
                setValue("scorta_minima", scorta_minima);
                setUmOptions(prodotto?.ums.map((um) => ({ value: um[0], label: um[1] })));
                setValue("um", prodotto?.ums[0][0]);
                setImpiantoOptions(prodotto?.impianti.map((impianto) => ({ value: impianto.id, label: impianto.nome })));
                if (prodotto?.impianti.length === 1) {
                  setValue("destinazione", prodotto?.impianti[0].id);
                }
              }}
            />
          </div>
          <div className="w-1/2">
            <Input name="fornitore" disabled />
          </div>
        </div>
        <div className="flex gap-x-20">
          <div className="w-1/2">
            <Input name="scorta_magazzino" disabled />
          </div>
          <div className="w-1/2">
            <Input name="scorta_minima" disabled />
          </div>
        </div>
        <div className="flex gap-x-20">
          <div className="w-1/2">
            <Input name="quantità" type="number" />
          </div>
          <div className="w-1/2">
            <SearchSelect name="um" label="Unità di Misura" options={umOptions} />
          </div>
        </div>
        <div className="flex gap-x-20">
          <div className="w-1/2">
            <SearchSelect name="destinazione" options={impiantoOptions} />
          </div>
          <div className="w-1/2">
            <SearchSelect name="operatore" options={searchOptions(operatoriQuery.data, "nome")} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Prelievo;
