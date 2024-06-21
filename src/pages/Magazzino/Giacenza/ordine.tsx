import { Button } from "@components/shadcn/Button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Operatore, Prodotto } from "@interfaces/global";
import { URLS } from "urls";
import Input from "@components/form/Input";
import Form from "@components/form/Form";
import { z } from "zod";
import SearchSelect from "@components/form/SearchSelect";
import Hidden from "@components/form/Hidden";
import { useFieldArray, useFormContext } from "react-hook-form";
import { searchOptions } from "utils";
import { Popover, PopoverContent, PopoverTrigger } from "@components/shadcn/Popover";
import { apiPost } from "@api/apiV2";
import { getErrors } from "@api/utils";
import { Checkbox } from "@components/shadcn/Checkbox";
import { Label } from "@components/shadcn/Label";
import PopoverProdotto from "./popover-prodotto";
import DatePicker from "@components/form/DatePicker";
import RemoveIcon from "@components/form/RemoveIcon";
const electron = window?.require ? window.require("electron") : null;

const numberSchema = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((value) => (value == null ? undefined : parseFloat(value.toString())))
  .refine((value) => value === undefined || value === null || (!isNaN(value) && value > 0), {
    message: "Inserire un valore positivo",
  });

const schema = z.object({
  prodotti: z.array(
    z.object({
      prodotto: numberSchema,
      quantità: numberSchema,
      prezzo_unitario: z
        .union([z.string(), z.number(), z.undefined(), z.null()])
        .transform((value) => (value == null ? undefined : parseFloat(value.toString()))),
      fornitore: numberSchema,
    })
  ),
  operatore: numberSchema,
  data_consegna_prevista: z.string(),
});

type Props = {
  prodotti: string[];
  setProdotti: React.Dispatch<React.SetStateAction<string[]>>;
};

function Ordine({ prodotti, setProdotti }: Props) {
  const queryClient = useQueryClient();
  const prodottiQuery = useQuery<Prodotto[]>([URLS.PRODOTTI, { order_by: "difference" }]);
  const [download, setDownload] = useState(false);

  const prodottiMappati = useMemo(() => {
    if (!prodottiQuery.isSuccess) return [];
    return prodotti.map((prodotto) => prodottiQuery.data.find((p) => p.nome === prodotto)!);
  }, [prodotti, prodottiQuery.isSuccess, prodottiQuery.data]);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const initialData = {
    prodotti: prodottiMappati.map((prodotto) => {
      const hasPrezzo = prodotto.prodotti_fornitori.length <= 1 && prodotto.prodotti_fornitori[0]?.prezzo_unitario;
      const hasFornitore = prodotto.prodotti_fornitori.length <= 1;
      return {
        prodotto: prodotto.id,
        quantità: undefined,
        prezzo_unitario: hasPrezzo ? prodotto.prodotti_fornitori[0].prezzo_unitario : undefined,
        fornitore: hasFornitore ? prodotto.prodotti_fornitori[0].fornitore.id : undefined,
      };
    }),
    operatore: undefined,
    data_consegna_prevista: nextWeek.toISOString().split("T")[0],
  };
  const pdfMutation = useMutation((data: FormData) => apiPost(URLS.DOCX_ORDINE, data), {
    onSuccess: (res) => {
      if (download) {
        const ordine = res.data.n_ordine.split("/");
        electron.ipcRenderer.invoke("save-docx", res.data.docx, `ordine-${ordine[1]}-${ordine[0]}.docx`);
      }
      setProdotti([]);
    },
    onError: (error) => {
      const errors = getErrors(error);
      console.log(errors);
    },
  });
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Nuovo Ordine</h2>
        <Button variant="secondary" onClick={() => setProdotti([])}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-3 relative top-px" /> Indietro
        </Button>
      </div>
      <hr className="mt-2 pb-1 text-gray-800 w-40 mb-4" />
      <Card>
        <CardHeader className="relative">
          <CardTitle>Nuovo ordine</CardTitle>
          <CardDescription>Inserisci i dati dell'ordine e conferma per inviare la richiesta.</CardDescription>
          <div className="absolute right-8 top-5 text-base">
            <div className="flex justify-between items-center gap-x-3">
              <Label>Scarica ordine</Label>
              <Checkbox
                checked={download}
                onCheckedChange={() => setDownload((prev) => !prev)}
                className="size-6"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {prodottiMappati.length > 0 && (
            <Form
              endpoint={URLS.ORDINI + "/"}
              schema={schema}
              initialData={initialData}
              onSuccess={(res: any) => {
                queryClient.invalidateQueries(URLS.PRODOTTI);
                queryClient.invalidateQueries(URLS.ORDINI);
                const ids = res.data.ids;
                const formData = new FormData();
                formData.append("ids", ids.join(","));
                pdfMutation.mutate(formData);
              }}
            >
              <FormOrdine prodotti={prodottiMappati} />
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type FormOrdineProps = {
  prodotti: Prodotto[];
};

const FormOrdine = ({ prodotti }: FormOrdineProps) => {
  const operatoriQuery = useQuery<Operatore>([URLS.OPERATORI, { can_magazzino: true }]);
  const form = useFormContext();
  const field = useFieldArray({ control: form.control, name: "prodotti" });
  const [prodottiOrdine, setProdottiOrdine] = useState(prodotti);
  return (
    <>
      <Table containerClassName="overflow-visible">
        <TableHeader>
          <TableRow>
            <TableHead>Prodotto</TableHead>
            <TableHead>Quantità</TableHead>
            <TableHead>Fornitore</TableHead>
            <TableHead>Prezzo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {field.fields.map((ordine, index) => {
            let placeholder = "";
            if (prodottiOrdine[index].unità_misura !== "pz") {
              placeholder = `${prodottiOrdine[index].nome_unità} da ${prodottiOrdine[index].dimensioni_unitarie} ${prodottiOrdine[index].unità_misura}`;
            } else {
              placeholder = `${prodottiOrdine[index].nome_unità}`;
            }
            return (
              <TableRow key={ordine.id}>
                <TableCell>
                  <Hidden name={`prodotti[${index}].prodotto`} value={prodottiOrdine[index].id} />
                  <Popover>
                    <PopoverTrigger className="hover:underline">{prodottiOrdine[index].nome}</PopoverTrigger>
                    <PopoverContent className="w-[600px]">
                      <PopoverProdotto prodottoId={prodottiOrdine[index].id} />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    name={`prodotti[${index}].quantità`}
                    label={false}
                    inputProps={{
                      placeholder: placeholder,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <SearchSelect
                    name={`prodotti[${index}].fornitore`}
                    options={prodottiOrdine[index].prodotti_fornitori.map((pf) => ({
                      value: pf.fornitore.id,
                      label: pf.fornitore.nome_semplice,
                    }))}
                    onChange={(value) => {
                      form.setValue(`prodotti[${index}].fornitore`, value?.value);
                      form.setValue(
                        `prodotti[${index}].prezzo_unitario`,
                        prodottiOrdine[index].prodotti_fornitori.find((pf) => pf.fornitore.id === value?.value)
                          ?.prezzo_unitario ?? null
                      );
                    }}
                    label={false}
                    inputClassName="w-40"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    name={`prodotti[${index}].prezzo_unitario`}
                    label={false}
                    inputProps={{
                      step: "0.01",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <RemoveIcon
                    onClick={() => {
                      field.remove(index);
                      setProdottiOrdine((prev) => {
                        const newProdotti = [...prev];
                        newProdotti.splice(index, 1);
                        return newProdotti;
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="grid grid-cols-5 mt-4 items-center mx-3">
        <div></div>
        <div className="col-span-2 text-right">
          <SearchSelect
            name="operatore"
            options={searchOptions(operatoriQuery.data, "nome")}
            inputClassName="w-48"
          />
        </div>
        <div className="col-span-2 text-right">
          <DatePicker name="data_consegna_prevista" label="Data Consegna:" />
        </div>
      </div>
    </>
  );
};

export default Ordine;
