import { Button } from "../../../../../components/shadcn/Button";
import { useMutation, useQueryClient } from "react-query";
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
import { InfoPrezzi } from "../../../../../interfaces/global";
import { useState } from "react";
import { dateToDatePicker } from "../../../../../utils";

type Props = {
  data: InfoPrezzi;
  children?: React.ReactNode;
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

function PrezziPreziosi({ data, children }: Props) {
  const { cliente } = useParams();
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
      prezzo_oro: oroScaduto ? undefined : data.prezzo_oro,
      prezzo_argento: argentoScaduto ? undefined : data.prezzo_argento,
      scadenza_prezzo_oro: oroScaduto ? undefined : data.scadenza_prezzo_oro,
      scadenza_prezzo_argento: argentoScaduto ? undefined : data.scadenza_prezzo_argento,
      densità_argento: data.densità_argento,
      densità_oro: data.densità_oro,
      minimo_per_pezzo: data.minimo_per_pezzo,
      minimo_per_riga: data.minimo_per_riga,
    },
  });
  const updateMutation = useMutation(
    (data: z.infer<typeof formSchema>) => apiUpdateWithGet(URLS.INFO_PREZZI + cliente + "/", data),
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
        queryClient.invalidateQueries(`${URLS.INFO_PREZZI}${cliente}/`);
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
            <hr className="col-span-3 mb-3 w-3/4 mx-auto" />
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
            <Button className="col-span-3 w-1/4 mx-auto mt-4" type="submit">
              Aggiorna
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PrezziPreziosi;
