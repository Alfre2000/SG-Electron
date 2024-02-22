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
import { Cliente } from "../../../../../interfaces/global";
import { useState } from "react";
import { dateToDatePicker } from "../../../../../utils";

type Props = {
  data: Cliente;
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
});

function PrezziPreziosi({ data, children }: Props) {
  const today = new Date();
  today.setHours(0);
  const oroScaduto = !data.scadenza_prezzo_oro || !data.prezzo_oro || new Date(data.scadenza_prezzo_oro) < today;
  const argentoScaduto = !data.scadenza_prezzo_argento || !data.prezzo_argento || new Date(data.scadenza_prezzo_argento) < today;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { cliente } = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prezzo_oro: oroScaduto ? undefined : data.prezzo_oro,
      prezzo_argento: argentoScaduto ? undefined : data.prezzo_argento,
      scadenza_prezzo_oro: oroScaduto ? undefined : data.scadenza_prezzo_oro,
      scadenza_prezzo_argento: argentoScaduto ? undefined : data.scadenza_prezzo_argento,
    },
  });
  const updateMutation = useMutation(
    (data: z.infer<typeof formSchema>) => apiUpdateWithGet(URLS.CLIENTI + cliente + "/", data),
    {
      onSuccess: (response) => {
        toast.success("Prezzi aggiornati con successo.");
        form.reset({
          prezzo_oro: response.data.prezzo_oro,
          prezzo_argento: response.data.prezzo_argento,
          scadenza_prezzo_oro: response.data.scadenza_prezzo_oro,
          scadenza_prezzo_argento: response.data.scadenza_prezzo_argento,
        });
        setOpen(false);
        queryClient.invalidateQueries(`${URLS.CLIENTI}${cliente}/`);
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
      <DialogContent className="max-w-xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="mb-2">
          <DialogTitle>Prezzi Metalli Preziosi</DialogTitle>
          <DialogDescription>
            Inserisci il prezzo di Oro e Argento e fino a quando questi prezzi saranno validi.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-8 gap-y-2">
            <FormControl>
              <FormField
                control={form.control}
                name="prezzo_oro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Oro</FormLabel>
                    <FormControl>
                      <UmInput {...field} type="number" um="€ / g" className="pr-14" />
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
                name="prezzo_argento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Argento</FormLabel>
                    <FormControl>
                      <UmInput {...field} type="number" um="€ / kg" className="pr-14" />
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
            <Button className="col-span-2 w-1/3 mx-auto mt-4" type="submit">
              Aggiorna
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PrezziPreziosi;
