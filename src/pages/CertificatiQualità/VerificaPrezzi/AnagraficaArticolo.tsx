import React from "react";
import { z } from "@/../it-zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Articolo } from "@interfaces/global";
import { useMutation, useQueryClient } from "react-query";
import { apiUpdateWithGet } from "@api/apiV2";
import { URLS } from "urls";
import { toast } from "sonner";
import { getErrors } from "@api/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/shadcn/Table";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@components/shadcn/Form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/shadcn/Dialog";
import { Input, UmInput } from "@components/shadcn/Input";
import { Button } from "@components/shadcn/Button";

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

type AnagraficaArticoloProps = { articolo: Articolo, updateArticolo: (articolo: Articolo) => void};

function AnagraficaArticolo({ articolo, updateArticolo }: AnagraficaArticoloProps) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
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
    (data: z.infer<typeof formSchema>) => apiUpdateWithGet(URLS.ARTICOLI + articolo.id + "/", data),
    {
      onSuccess: (res, formData) => {
        form.setValue("superficie", formData.superficie);
        form.setValue("peso", formData.peso);
        form.setValue("costo_manodopera", formData.costo_manodopera);
        form.setValue("fattore_moltiplicativo", formData.fattore_moltiplicativo);
        form.setValue("prezzo_dmq", formData.prezzo_dmq);
        queryClient.invalidateQueries(URLS.ARTICOLI + articolo.id + "/");
        const newArticolo = { ...articolo, ...formData };
        updateArticolo(newArticolo);
        toast.success("Anagrafica aggiornata");
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:underline">{articolo.codice}</DialogTrigger>
      <DialogContent className="max-w-2xl px-8" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Anagrafica {articolo.descrizione}</DialogTitle>
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
                <div className="col-span-2 mt-3">
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

export default AnagraficaArticolo;
