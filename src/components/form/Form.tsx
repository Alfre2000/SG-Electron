import React from "react";
import { Form as ShadcnForm } from "@components/shadcn/Form";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "@ui/../it-zod";
import { ZodTypeAny } from "zod";
import { useMutation, useQueryClient } from "react-query";
import { apiPost, apiUpdate } from "@api/apiV2";
import { toast } from "sonner";
import { Button } from "@components/shadcn/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrors } from "@api/utils";
import { usePageContext } from "@contexts/PageContext";

type FormProps<T extends ZodTypeAny> = {
  children: React.ReactNode;
  endpoint: string;
  schema: T;
  initialData?: z.infer<T>;
  disabled?: boolean;
  onSuccess?: (res: any) => void;
};

function Form<T extends ZodTypeAny>({
  children,
  endpoint,
  schema,
  initialData,
  disabled = false,
  onSuccess,
}: FormProps<T>) {
  const [key, setKey] = React.useState(0);
  const pageContext = usePageContext();
  const copyData = pageContext?.copyData;
  const setCopyData = pageContext?.setCopyData;

  initialData = initialData || copyData;

  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
    disabled,
  });

  React.useEffect(() => {
    console.log("Resetting form");
    form.reset(initialData);
  }, []);

  const createMutation = useMutation((data: z.infer<typeof schema>) => apiPost(endpoint, data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(endpoint);
      toast.success("Record creato con successo !");

      const paginator = document.querySelector(".paginator-first");
      if (paginator) (paginator as HTMLElement).click();

      form.reset();
      setKey((prev) => prev + 1);
      if (setCopyData) setCopyData(null);
      if (onSuccess) onSuccess(res);
    },
    onError: (error) => onError(error),
  });

  const updateMutation = useMutation(
    (data: z.infer<typeof schema>) => apiUpdate(`${endpoint}${initialData?.id}/`, data),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(endpoint);
        toast.success("Record modificato con successo !");
        setKey((prev) => prev + 1);
        if (onSuccess) onSuccess(res);
      },
      onError: (error) => onError(error),
    }
  );

  const onError = (error: unknown) => {
    const errors = getErrors(error);
    console.log(errors);

    // Aggiorna gli errori nello state del form
    Object.keys(errors).forEach((key, idx) => {
      if (errors[key][0] instanceof Object) {
        errors[key].forEach((error: any, i: number) => {
          Object.keys(error).forEach((nestedKey) => {
            const message = { message: error[nestedKey][0] };
            form.setError(`${key}[${i}].${nestedKey}` as any, message, { shouldFocus: idx === 0 });
          }
        );
      });
      } else {
      const message = { message: errors[key][0] };
      form.setError(key as any, message, { shouldFocus: idx === 0 });
    }
    });
    toast.error("Si è verificato un errore !");

    // Dopo 3 secondi cancella gli errori
    setTimeout(() => {
      form.clearErrors();
    }, 3000);
  };

  const onValidForm = (values: z.infer<typeof schema>) => {
    console.log(values);
    if (initialData?.id) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const onInvalidForm = (e: any) => {
    console.log(e);
    toast.error("Si è verificato un errore !");
    setTimeout(() => {
      form.clearErrors();
    }, 3000);
  };
  return (
    <ShadcnForm {...form} key={key}>
      <form onSubmit={form.handleSubmit(onValidForm, onInvalidForm)}>
        {children}
        {!disabled && (
          <div className="flex justify-center items-end">
            <div className="w-1/3"></div>
            <div className="text-center w-1/3">
              <Button type="submit" className="mt-8 w-32 bg-[#0d6efd] hover:bg-[#4275c1]">
                Salva
              </Button>
            </div>
            <div className="w-1/3">
              <NonFieldErrors />
            </div>
          </div>
        )}
      </form>
    </ShadcnForm>
  );
}

function NonFieldErrors() {
  const form = useFormContext();
  const errors = form.formState.errors;
  return (
    <div>
      {errors.non_field_errors && (
        <div className="text-red-500 text-sm font-medium">{errors.non_field_errors.message?.toString()}</div>
      )}
    </div>
  );
}

export default Form;
