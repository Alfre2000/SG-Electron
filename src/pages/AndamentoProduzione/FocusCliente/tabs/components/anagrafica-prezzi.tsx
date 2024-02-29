import { Button } from "@components/shadcn/Button";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrors } from "@api/utils";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@components/shadcn/Form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/shadcn/Dialog";
import { Input, UmInput } from "@components/shadcn/Input";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArticoloPrice } from "./columns";
import { useState } from "react";
import { z } from "../../../../../it-zod";
import { URLS } from "../../../../../urls";
import { apiUpdateWithGet } from "@api/apiV2";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";

type AnagraficaArticoloProps<TData> = {
  id: string;
  data: TData[];
  setShow: (show: string | undefined) => void;
};

const numberSchema = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((value) => (value == null ? undefined : parseFloat(value.toString())))
  .refine((value) => value === undefined || value === null || (!isNaN(value) && value > 0), {
    message: "Inserire un valore positivo",
  });

const formSchema = z.object({
  superficie: numberSchema,
  peso: numberSchema,
  costo_manodopera: numberSchema,
  fattore_moltiplicativo: numberSchema,
  prezzo_dmq: numberSchema,
});

export default function AnagraficaArticolo<TData>({ id, data, setShow }: AnagraficaArticoloProps<TData>) {
  const [open, setOpen] = useState(true);
  const { cliente } = useParams();
  const queryClient = useQueryClient();
  const finalData = (data as ArticoloPrice[]).find((d) => d.articolo_id === id)!;
  const articolo = finalData.articolo;
  console.log(articolo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      superficie: articolo.superficie ?? undefined,
      peso: articolo.peso ?? undefined,
      costo_manodopera: articolo.costo_manodopera ?? undefined,
      fattore_moltiplicativo: articolo.fattore_moltiplicativo ?? undefined,
      prezzo_dmq: articolo.prezzo_dmq ?? undefined,
    },
  });

  const updateMutation = useMutation(
    (data: z.infer<typeof formSchema>) => apiUpdateWithGet(URLS.ARTICOLI + id + "/", data),
    {
      onSuccess: () => {
        toast.success("Anagrafica aggiornata");
        setShow(undefined);
        form.reset();
        queryClient.invalidateQueries(`${URLS.CLIENTI}${cliente}/prezzi`);
      },
      onError: (error) => {
        const errors = getErrors(error);
        console.log(errors);
        toast.error("Si è verificato un errore.");
      },
    }
  );
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setShow(undefined);
      }}
    >
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Anagrafica {finalData.codice}</DialogTitle>
          <DialogDescription>
            Modifica le informazioni legate al calcolo del prezzo per l'articolo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-8 gap-y-2">
            <FormControl>
              <FormField
                control={form.control}
                name="superficie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superficie</FormLabel>
                    <FormControl>
                      <UmInput {...field} type="number" um="dm²" step="0.0001" />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </FormControl>
            <FormControl>
              <FormField
                control={form.control}
                name="peso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso</FormLabel>
                    <FormControl>
                      <UmInput {...field} type="number" um="kg" step="0.0001" />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </FormControl>
            <FormControl>
              <FormField
                control={form.control}
                name="costo_manodopera"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo Manodopera</FormLabel>
                    <FormControl>
                      <UmInput {...field} type="number" step="0.001" um="€ / dm²" className="pr-16" />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </FormControl>
            <FormControl>
              <FormField
                control={form.control}
                name="fattore_moltiplicativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fattore Moltiplicativo</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.001" />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </FormControl>
            <hr className="col-span-2 mx-auto w-2/3" />
            <div className="flex col-span-2 items-center justify-center gap-x-8 mt-3">
              <span className="text-muted">oppure</span>
              <FormControl>
                <FormField
                  control={form.control}
                  name="prezzo_dmq"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prezzo al dm²</FormLabel>
                      <FormControl>
                        <UmInput {...field} type="number" step="0.0001" um="€ / dm²" className="pr-16" />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </FormControl>
            </div>
            {articolo.richieste.length > 0 && (
              <>
                <hr className="col-span-2 mx-auto w-2/3" />
                <div className="col-span-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lavorazione</TableHead>
                        <TableHead>Spessore Considerato</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articolo.richieste
                        .map((richiesta) => (
                          <TableRow key={richiesta.id}>
                            <TableCell className="px-4">{richiesta.lavorazione?.nome || ""}</TableCell>
                            <TableCell className="px-4">{richiesta.spessore_massimo && (<>{richiesta.spessore_massimo} µm</>)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
            <Button className="col-span-2 w-1/3 mx-auto mt-4" type="submit">
              Aggiorna
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
