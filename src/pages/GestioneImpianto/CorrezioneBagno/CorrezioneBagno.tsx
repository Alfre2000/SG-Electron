import Wrapper from "@ui/wrapper/Wrapper";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/shadcn/Card";
import Form from "@components/form/Form";
import { z } from "@/../it-zod";
import { URLS } from "urls";
import { useQuery } from "react-query";
import { findElementFromID } from "utils";
import { useImpianto } from "@contexts/UserContext";
import { RichiestaCorrezioneBagno } from "@interfaces/global";
import Textarea from "@components/form/Textarea";
import SG from "@images/certificati/sg.png";
import ICIM from "@images/certificati/icim.png";
import OperatoreInput from "@components/form/OperatoreInput";

const schema = z.object({
  operatore: z.number(),
  note: z.string().optional().nullable(),
  impianto: z.number(),
  note_completamento: z.string().optional().nullable(),
  richieste_prodotto: z.array(
    z.object({
      vasca: z.string(),
      prodotto: z.string().optional().nullable(),
      quantità: z.string().optional().nullable(),
      prodotto_magazzino: z.number().optional().nullable(),
      quantità_magazzino: z.number().optional().nullable(),
      um: z.string().optional().nullable(),
    })
  ),
});

function CorrezioneBagno() {
  const { richiestaID } = useParams();
  const richiestaQuery = useQuery<RichiestaCorrezioneBagno>(URLS.RICHIESTE_CORREZIONE_BAGNO + richiestaID + "/");
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
                    <td className="border-[1px] border-slate-300">{impianto.nome}</td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-8 text-muted text-sm mb-2">Lista di prodotti che devono essere aggiunti:</p>
              <table className="w-full border-collapse border-[1px] border-slate-300 text-center">
                <tbody>
                  {richiestaQuery.data?.richieste_prodotto.map((richiesta) => {
                    const nomeProdotto = richiesta.prodotto || richiesta.prodotto_magazzino?.nickname || richiesta.prodotto_magazzino?.nome;
                    return (
                    <tr className="h-12" key={richiesta.id}>
                      <td className="font-semibold border-[1px] border-slate-300 w-[15%]">Vasca:</td>
                      <td className="border-[1px] border-slate-300 w-[18.5%] px-2 py-1">{richiesta.vasca}</td>
                      <td className="font-semibold border-[1px] border-slate-300 w-[15%]">Prodotto:</td>
                      <td className="border-[1px] border-slate-300 w-[18.5%] px-2 py-1">{nomeProdotto}</td>
                      <td className="font-semibold border-[1px] border-slate-300 w-[15%]">Quantità:</td>
                      <td className="border-[1px] border-slate-300 px-2 py-1">{richiesta.quantità_testo}</td>
                    </tr>
                  )})}
                  <tr className="h-28">
                    <td className="font-semibold border-[1px] border-slate-300 w-[15%] px-2">Altre operazioni:</td>
                    <td className="border-[1px] border-slate-300" colSpan={5}>
                      {richiestaQuery.data?.note}
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
                    <td className="border-[1px] border-slate-300 border-t-0 w-[35%]">
                      {richiestaQuery.data?.richiesto_da}
                    </td>
                    <td className="font-semibold border-[1px] border-slate-300 border-t-0 w-[15%] px-2">Data:</td>
                    <td className="border-[1px] border-slate-300 border-t-0 w-[35%]">
                      {richiestaQuery.data
                        ? new Date(richiestaQuery.data.data).toLocaleDateString("it-IT", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
              {richiestaQuery.data && (
                <Form
                  endpoint={URLS.RICHIESTE_CORREZIONE_BAGNO}
                  schema={schema}
                  // replace each prodotto_magazzino with only its id
                  initialData={{
                    ...richiestaQuery.data,
                    richieste_prodotto: richiestaQuery.data?.richieste_prodotto.map((richiesta) => ({
                      ...richiesta,
                      prodotto_magazzino: richiesta.prodotto_magazzino?.id,
                    })),
                  }}
                  onSuccess={() => {
                    navigate("/manutenzione/record-lavorazione/");
                  }}
                >
                  <table className="w-full border-collapse border-[1px] border-slate-300 text-center mt-10">
                    <tbody>
                      <tr className="h-12">
                        <td className="font-semibold border-[1px] border-slate-300 w-[15%] px-2">
                          Chi ha eseguito:
                        </td>
                        <td className="border-[1px] border-slate-300 w-[35%] px-3">
                          <OperatoreInput />
                        </td>
                        <td className="font-semibold border-[1px] border-slate-300 w-[15%] px-2">Data:</td>
                        <td className="border-[1px] border-slate-300 w-[35%]">
                          {new Date().toLocaleDateString("it-IT", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </td>
                      </tr>
                      <tr className="h-28">
                        <td className="font-semibold border-[1px] border-slate-300 w-[15%] px-2">Note:</td>
                        <td className="border-[1px] border-slate-300 px-3 py-2" colSpan={3}>
                          <Textarea name="note_completamento" label={false} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

export default CorrezioneBagno;
