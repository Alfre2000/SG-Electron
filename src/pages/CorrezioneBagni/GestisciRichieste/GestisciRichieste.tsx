import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import React, { useState } from "react";
import Form from "@components/form/Form";
import { z } from "@/../it-zod";
import { URLS } from "urls";
import Input from "@components/form/Input";
import SearchSelect, { Option } from "@components/form/SearchSelect";
import { useQuery } from "react-query";
import { findElementFromID, searchOptions } from "utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import Loading from "@components/Loading/Loading";
import Error from "@components/Error/Error";
import { PaginationData, Prodotto, RichiestaCorrezioneBagno, Vasca } from "@interfaces/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPrint, faTimes } from "@fortawesome/free-solid-svg-icons";
import { apiGet } from "@api/api";
import Textarea from "@components/form/Textarea";
import SG from "@images/certificati/sg.png";
import ICIM from "@images/certificati/icim.png";
import { useFieldArray, useFormContext } from "react-hook-form";
import AddIcon from "@components/form/AddIcon";
import RemoveIcon from "@components/form/RemoveIcon";
const electron = window?.require ? window.require("electron") : null;

const numberSchema = z
  .union([z.string(), z.number()])
  .transform((value) => (value == null ? undefined : parseFloat(value.toString())))
  .refine((value) => value === undefined || value === null || (!isNaN(value) && value > 0), {
    message: "Inserire un valore positivo",
  });

const schema = z.object({
  note: z.string().optional(),
  impianto: z.number(),
  richiesto_da: z.string().min(1, "Campo obbligatorio"),
  richieste_prodotto: z.array(
    z.object({
      vasca: z.string().min(1, "Campo obbligatorio"),
      prodotto_magazzino: z.number(),
      quantità_magazzino: numberSchema,
      um: z.string(),
      quantità: z.string().optional(),
    })
  ),
});

function GestisciRichieste() {
  const impiantiQuery = useQuery(URLS.IMPIANTI);
  const richiesteQuery = useQuery<PaginationData<RichiestaCorrezioneBagno>>(URLS.RICHIESTE_CORREZIONE_BAGNO);
  const vecchieQuery = useQuery<PaginationData<RichiestaCorrezioneBagno>>([
    URLS.RICHIESTE_CORREZIONE_BAGNO,
    { vecchie: true },
  ]);
  const printPDF = (richiestaID: string) => {
    apiGet(`${URLS.RICHIESTE_CORREZIONE_BAGNO_PDF}${richiestaID}`).then((res) => {
      const date = new Date()
        .toLocaleDateString("it-IT", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replaceAll("/", "-")
        .replace(", ", "_")
        .replace(":", "-");
      electron.ipcRenderer.invoke("print-pdf-2", res, `richiesta_correzione_bagno_${date}.pdf`);
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="scroll-m-20 text-3xl font-semibold first:mt-0 text-gray-800">Richieste Correzione Bagni</h2>
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
              <table className="w-full border-collapse border-[1px] border-slate-300 text-center">
                <tbody>
                  <tr>
                    <td className="border-[1px] border-slate-300">
                      <img src={SG} alt="SuperGalvanica" className="h-20 m-auto" />
                    </td>
                    <td className="w-2/5 border-[1px] border-slate-300">
                      <h2 className="text-xl font-semibold">Richiesta Correzione Bagno</h2>
                    </td>
                    <td className="border-[1px] border-slate-300">
                      <img src={ICIM} alt="Icim" className="h-20 m-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="w-full border-collapse border-[1px] border-slate-300 text-center mt-8">
                <tbody>
                  <tr className="h-12">
                    <td className="font-semibold border-[1px] border-slate-300 w-[15%]">Linea:</td>
                    <td className="border-[1px] border-slate-300 px-3">
                      <SearchSelect
                        name="impianto"
                        options={searchOptions(impiantiQuery.data, "nome")}
                        label={false}
                        inputClassName="max-w-64 mx-auto"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-8 text-muted text-sm mb-2">Lista di prodotti che devono essere aggiunti:</p>
              <table className="w-full border-collapse border-[1px] border-slate-300 text-center">
                <tbody>
                  <RichiesteProdotto />
                </tbody>
              </table>
              <table className="w-full border-collapse border-[1px] border-t-0 border-slate-300 text-center">
                <tbody>
                  <tr className="h-28">
                    <td className="font-semibold border-[1px] border-t-0 border-slate-300 w-[15%] px-2">
                      Altre operazioni:
                    </td>
                    <td className="border-[1px] border-t-0 border-slate-300 px-3" colSpan={6}>
                      <Textarea name="note" label={false} rows={5} className="h-20" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="w-full border-collapse border-[1px] border-slate-300 border-t-0 text-center">
                <tbody>
                  <tr className="h-12">
                    <td className="font-semibold border-[1px] border-slate-300 border-t-0 w-[15%] px-2">
                      Chi richiede:
                    </td>
                    <td className="border-[1px] border-slate-300 border-t-0 w-[35%] px-3">
                      <Input name="richiesto_da" label={false} />
                    </td>
                    <td className="font-semibold border-[1px] border-slate-300 border-t-0 w-[15%] px-2">Data:</td>
                    <td className="border-[1px] border-slate-300 border-t-0 w-[35%]">
                      {new Date().toLocaleDateString("it-IT", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Form>
          </CardContent>
        </Card>
        {vecchieQuery.isSuccess && vecchieQuery.data.results.length > 0 && (
          <Card
            className="shadow-red-600 shadow-md"
            style={{ boxShadow: "0px 0px 5px 5px rgba(245, 32, 32, 0.2)" }}
          >
            <CardHeader>
              <CardTitle className="text-red-700">Richieste correzioni in ritardo</CardTitle>
              <CardDescription>
                Qui è possibile visualizzare le richieste di correzione dei bagni che non sono state ancora fatte
                pur essendo passato più di un giorno dal momento della richiesta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-inherit">
                    <TableHead>Data</TableHead>
                    <TableHead>Impianto</TableHead>
                    <TableHead>Prodotti</TableHead>
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
                      <TableCell>
                        {richiesta.richieste_prodotto
                          .map((r) => r.prodotto || r.prodotto_magazzino?.nome)
                          .join(" - ")}
                      </TableCell>
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
                    <TableHead>Prodotti</TableHead>
                    <TableHead className="text-center">Eseguita</TableHead>
                    <TableHead className="text-center">Scarica</TableHead>
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
                      <TableCell>
                        {richiesta.richieste_prodotto
                          .map((r) => r.prodotto || r.prodotto_magazzino?.nome)
                          .join(" - ")}
                      </TableCell>
                      <TableCell className="text-center">
                        <FontAwesomeIcon icon={richiesta.data_completamento ? faCheck : faTimes} />
                      </TableCell>
                      <TableCell className="text-center cursor-pointer" onClick={() => printPDF(richiesta.id)}>
                        <FontAwesomeIcon icon={faPrint} className="text-slate-700" />
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
  );
}

export default GestisciRichieste;

const RichiesteProdotto = () => {
  const vascheQuery = useQuery<Vasca[]>(URLS.VASCHE);
  const prodottiQuery = useQuery<Prodotto[]>(URLS.PRODOTTI);
  const form = useFormContext();
  const field = useFieldArray({ control: form.control, name: "richieste_prodotto" });
  const effectRan = React.useRef(false);
  React.useEffect(() => {
    if (effectRan.current) return;
    if (field.fields.length === 0) {
      field.append({ vasca: "", prodotto_magazzino: "", quantità_magazzino: "", um: "" });
      effectRan.current = true;
    }
  }, [field]);
  const [umOptions, setUmOptions] = useState<Option[][]>([]);
  return (
    <>
      {field.fields.map((item, index) => {
        return (
          <tr className="h-12" key={item.id}>
            <td className="border-[1px] border-slate-300 text-left px-3 py-3 w-[21%]">
              <label className="font-semibold mb-1 pl-0.5">Vasca</label>
              <SearchSelect
                name={`richieste_prodotto[${index}].vasca`}
                options={vascheQuery.data?.map((v) => ({ value: v, label: v })) || []}
                label={false}
                createTable
              />
            </td>
            <td className="border-[1px] border-slate-300 text-left px-3 py-3 w-[21%]">
              <label className="font-semibold mb-1 pl-0.5">Prodotto</label>
              <SearchSelect
                name={`richieste_prodotto[${index}].prodotto_magazzino`}
                options={searchOptions(prodottiQuery.data, "nome")}
                onChange={(e) => {
                  const id = parseInt(e.value.toString());
                  const prodotto = prodottiQuery?.data?.find((p) => p.id === id);
                  setUmOptions((prevUms) => {
                    const newUms = [...prevUms];
                    newUms[index] = prodotto?.ums.map((um) => ({ value: um[0], label: um[1] })) || [];
                    return newUms;
                  });
                  form.setValue(`richieste_prodotto[${index}].um`, prodotto?.ums[0][0]);
                }}
                label={false}
              />
            </td>
            <td className="border-[1px] border-slate-300 text-left px-3 py-3 w-[15%]">
              <label className="font-semibold mb-1 pl-0.5">Quantità</label>
              <Input
                name={`richieste_prodotto[${index}].quantità_magazzino`}
                label={false}
                type="number"
                inputProps={{
                  step: "0.01",
                }}
              />
            </td>
            <td className="border-[1px] border-slate-300 text-left px-3 py-3 w-[21%]">
              <label className="font-semibold mb-1 pl-0.5">Unità Misura</label>
              <SearchSelect
                name={`richieste_prodotto[${index}].um`}
                label={false}
                options={umOptions[index] || []}
              />
            </td>
            <td className="border-[1px] border-slate-300 text-left px-3 py-3 w-[17%]">
              <label className="font-semibold mb-1 pl-0.5">Quantità Testo</label>
              <Input name={`richieste_prodotto[${index}].quantità`} label={false} />
            </td>
            <td className="border-[1px] border-slate-300">
              <RemoveIcon
                onClick={() => {
                  field.remove(index);
                  setUmOptions((prevUms) => {
                    const newUms = [...prevUms];
                    newUms.splice(index, 1);
                    return newUms;
                  });
                }}
              />
            </td>
          </tr>
        );
      })}
      <tr className="h-10">
        <td colSpan={7}>
          <AddIcon
            onClick={() =>
              field.append({ vasca: "", prodotto_magazzino: "", quantità_magazzino: "", um: "", quantità: "" })
            }
          />
        </td>
      </tr>
    </>
  );
};
