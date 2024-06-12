import { Button } from "@components/shadcn/Button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Operatore, Prodotto, UtilizzoProdotto } from "@interfaces/global";
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
            <Checkbox checked={download} onCheckedChange={() => setDownload((prev) => !prev)} className="size-6" />
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
  return (
    <>
      <Table containerClassName="overflow-visible">
        <TableHeader>
          <TableRow>
            <TableHead>Prodotto</TableHead>
            <TableHead>Quantità</TableHead>
            <TableHead>Fornitore</TableHead>
            <TableHead>Prezzo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {field.fields.map((ordine, index) => {
            let placeholder = "";
            if (prodotti[index].unità_misura !== "pz") {
              placeholder = `${prodotti[index].nome_unità} da ${prodotti[index].dimensioni_unitarie} ${prodotti[index].unità_misura}`;
            } else {
              placeholder = `${prodotti[index].nome_unità}`;
            }
            return (
              <TableRow key={ordine.id}>
                <TableCell>
                  <Hidden name={`prodotti[${index}].prodotto`} value={prodotti[index].id} />
                  <Popover>
                    <PopoverTrigger className="hover:underline">{prodotti[index].nome}</PopoverTrigger>
                    <PopoverContent className="w-[600px]">
                      <PopoverProdotto prodottoId={prodotti[index].id} />
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
                    options={prodotti[index].prodotti_fornitori.map((pf) => ({
                      value: pf.fornitore.id,
                      label: pf.fornitore.nome,
                    }))}
                    onChange={(value) => {
                      form.setValue(`prodotti[${index}].fornitore`, value?.value);
                      form.setValue(
                        `prodotti[${index}].prezzo_unitario`,
                        prodotti[index].prodotti_fornitori.find((pf) => pf.fornitore.id === value?.value)
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4 items-center mx-3">
        <div></div>
        <div className="w-72 flex justify-end">
          <SearchSelect
            name="operatore"
            options={searchOptions(operatoriQuery.data, "nome")}
            inputClassName="w-48"
          />
        </div>
      </div>
    </>
  );
};

const PopoverProdotto = ({ prodottoId }: { prodottoId: number }) => {
  const prodottoQuery = useQuery<UtilizzoProdotto>(URLS.UTILIZZO_PRODOTTO + prodottoId);
  if (!prodottoQuery.isSuccess) return null;
  const prodotto = prodottoQuery.data;
  const color =
    prodotto.scorta_magazzino + prodotto.scorta_ordinata < prodotto.scorta_minima ? "text-red-500" : "";
  const scorta_minima = prodotto.scorta_minima / prodotto.dimensioni_unitarie;
  const scorta_magazzino = prodotto.scorta_magazzino / prodotto.dimensioni_unitarie;
  const scorta_ordinata = prodotto.scorta_ordinata / prodotto.dimensioni_unitarie;
  const dimensioni =
    prodotto.unità_misura !== "pz" ? `da ${prodotto.dimensioni_unitarie} ${prodotto.unità_misura}` : "";
  return (
    <div>
      <span className="font-medium">{prodotto.nome}</span>
      <div className="flex justify-between items-center">
        <p className="text-muted text-sm">Descrizione: {prodotto.descrizione}</p>
        <p className="text-muted text-sm min-w-24 text-right">
          {prodotto.nome_unità} {dimensioni}
        </p>
      </div>
      <hr className="mb-3 mt-2" />
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-3 gap-2">
          <span className="col-span-2">Scorta minima:</span>
          <span className="text-center font-semibold">{scorta_minima}</span>
          <span className="col-span-2">Scorta magazzino:</span>
          <span className={`text-center font-semibold ${color}`}>{scorta_magazzino}</span>
          <span className="col-span-2">Scorta ordinata:</span>
          <span className="text-center font-semibold">{scorta_ordinata}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="col-span-2">Utilizzo ultimo mese:</span>
          <span className="text-center font-semibold">{prodotto.utilizzo_ultimo_mese.toFixed(1)}</span>
          <span className="col-span-2">Utilizzo ultimo trimestre:</span>
          <span className="text-center font-semibold">{prodotto.utilizzo_ultimo_trimestre.toFixed(1)}</span>
          <span className="col-span-2">Utilizzo ultimo anno:</span>
          <span className="text-center font-semibold">{prodotto.utilizzo_ultimo_anno.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default Ordine;
