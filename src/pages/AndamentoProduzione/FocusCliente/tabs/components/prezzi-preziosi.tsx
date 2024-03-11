import { Button } from "../../../../../components/shadcn/Button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrors } from "../../../../../api/utils";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/shadcn/Form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/shadcn/Dialog";
import { UmInput } from "../../../../../components/shadcn/Input";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "../../../../../it-zod";
import { URLS } from "../../../../../urls";
import { apiUpdateWithGet } from "../../../../../api/apiV2";
import { useParams } from "react-router-dom";
import DatePicker from "../../../../../components/shadcn/DatePicker";
import { InfoPrezzi, PrezziMetalli } from "../../../../../interfaces/global";
import { useState } from "react";
import { dateToDatePicker } from "../../../../../utils";
import { HashLoader } from "react-spinners";
import { toFormattedNumber } from "@utils/main";
import { round } from "@lib/utils";

type Props = {
  data: InfoPrezzi;
  children?: React.ReactNode;
  clienteID?: string;
};

const numberSchema = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((value) => (value == null ? undefined : parseFloat(value.toString())))
  .refine((value) => value === undefined || (!isNaN(value) && value > 0), {
    message: "Inserire un valore positivo",
  });

const dateSchema = z.union([z.string(), z.date(), z.undefined(), z.null()]).transform((value) => {
  if (value == null) return undefined;
  if (value instanceof Date) return dateToDatePicker(value);
  return value;
});

const formSchema = z.object({
  prezzo_oro: numberSchema,
  prezzo_argento: numberSchema,
  scadenza_prezzo_oro: dateSchema,
  scadenza_prezzo_argento: dateSchema,
  densità_oro: numberSchema,
  densità_argento: numberSchema,
  minimo_per_pezzo: numberSchema,
  minimo_per_riga: numberSchema,
});

function PrezziPreziosi({ data, children, clienteID }: Props) {
  const [loading, setLoading] = useState(false);
  const { cliente } = useParams();
  clienteID = clienteID || cliente;
  const prezziMetalliQuery = useQuery<PrezziMetalli>(URLS.PREZZI_METALLI);
  const today = new Date();
  today.setHours(0);
  const oroScaduto = !data.scadenza_prezzo_oro || !data.prezzo_oro || new Date(data.scadenza_prezzo_oro) < today;
  const argentoScaduto =
    !data.scadenza_prezzo_argento || !data.prezzo_argento || new Date(data.scadenza_prezzo_argento) < today;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prezzo_oro: oroScaduto ? undefined : data.prezzo_oro || undefined,
      prezzo_argento: argentoScaduto ? undefined : data.prezzo_argento || undefined,
      scadenza_prezzo_oro: oroScaduto ? undefined : data.scadenza_prezzo_oro || undefined,
      scadenza_prezzo_argento: argentoScaduto ? undefined : data.scadenza_prezzo_argento || undefined,
      densità_argento: data.densità_argento,
      densità_oro: data.densità_oro,
      minimo_per_pezzo: data.minimo_per_pezzo || undefined,
      minimo_per_riga: data.minimo_per_riga || undefined,
    },
  });
  const updateMutation = useMutation(
    (data: z.infer<typeof formSchema>) => apiUpdateWithGet(URLS.INFO_PREZZI + clienteID + "/", data),
    {
      onSuccess: (response) => {
        toast.success("Prezzi aggiornati con successo.");
        form.reset({
          prezzo_oro: response.data.prezzo_oro,
          prezzo_argento: response.data.prezzo_argento,
          scadenza_prezzo_oro: response.data.scadenza_prezzo_oro,
          scadenza_prezzo_argento: response.data.scadenza_prezzo_argento,
          densità_argento: response.data.densità_argento,
          densità_oro: response.data.densità_oro,
          minimo_per_pezzo: response.data.minimo_per_pezzo,
          minimo_per_riga: response.data.minimo_per_riga,
        });
        setOpen(false);
        queryClient.invalidateQueries(`${URLS.INFO_PREZZI}${clienteID}/`);
      },
      onError: (error) => {
        const errors = getErrors(error);
        console.log(errors);
        toast.error("Si è verificato un errore.");
      },
      onSettled: () => {
        setLoading(false);
      },
    }
  );
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    updateMutation.mutate(values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="ml-auto mt-0.5">
        {children ? children : <Button className="opacity-80">Aggiorna</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="mb-2">
          <DialogTitle>Prezzi Metalli Preziosi</DialogTitle>
          <DialogDescription>
            Inserisci il prezzo di Oro e Argento e fino a quando questi prezzi saranno validi.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-x-8 gap-y-2 justify-center">
            <FormControl>
              <FormField
                control={form.control}
                name="prezzo_oro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Oro</FormLabel>
                    <FormControl>
                      <UmInput {...field} step="0.0001" type="number" um="€ / g" className="pr-14" />
                    </FormControl>
                    <div className="h-5 mt-0 text-right">
                      {prezziMetalliQuery.data && (
                        <span className="text-muted text-xs">
                          Prezzo attuale: {toFormattedNumber(round(prezziMetalliQuery.data.Oro / 1000, 1))} € / g
                        </span>
                      )}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </FormControl>
            <FormControl>
              <FormField
                control={form.control}
                name="scadenza_prezzo_oro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scadenza Prezzo Oro</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
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
                name="densità_oro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Densità Oro</FormLabel>
                    <FormControl>
                      <UmInput {...field} step="0.0001" type="number" um="g / cm³" className="pr-14" />
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
                name="prezzo_argento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Argento</FormLabel>
                    <FormControl>
                      <UmInput {...field} step="0.0001" type="number" um="€ / kg" className="pr-14" />
                    </FormControl>
                    <div className="h-5 mt-0 text-right">
                      {prezziMetalliQuery.data && (
                        <span className="text-muted text-xs">
                          Prezzo attuale: {toFormattedNumber(round(prezziMetalliQuery.data.Argento, 0))} € / kg
                        </span>
                      )}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </FormControl>
            <FormControl>
              <FormField
                control={form.control}
                name="scadenza_prezzo_argento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scadenza Prezzo Argento</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
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
                name="densità_argento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Densità Argento</FormLabel>
                    <FormControl>
                      <UmInput {...field} step="0.0001" type="number" um="g / cm³" className="pr-14" />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </FormControl>
            <hr className="col-span-3 mb-3 mt-3 w-3/4 mx-auto" />
            <div className="col-span-3 mx-auto flex gap-x-8">
              <FormControl>
                <FormField
                  control={form.control}
                  name="minimo_per_riga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prezzo minimo per riga</FormLabel>
                      <FormControl>
                        <UmInput {...field} step="0.0001" type="number" um="€" className="pr-14" />
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
                  name="minimo_per_pezzo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prezzo minimo per pezzo</FormLabel>
                      <FormControl>
                        <UmInput {...field} step="0.0001" type="number" um="€" className="pr-14" />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </FormControl>
            </div>
            <div className="flex justify-between items-center mt-4 col-span-3 px-12">
              <div className="w-5"></div>
              <Button className="mx-auto " type="submit">
                Aggiorna
              </Button>
              <div className="relative w-5">
                {loading && <HashLoader color="#36d7b7" size={30} className="mb-1" />}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PrezziPreziosi;
