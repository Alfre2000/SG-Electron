import React from "react";
import { Input as ShadcnInput } from "@components/shadcn/Input";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@components/shadcn/Form";
import { useFormContext } from "react-hook-form";
import { capitalize } from "@utils/main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type InputProps = {
  name: string;
  label?: string | boolean;
  type?: "text" | "password" | "email" | "number";
};

function Input({ name, label, type }: InputProps) {
  const form = useFormContext();

  const labelText = label || `${capitalize(name).replace("_", " ")}:`;
  const colInput = label === false ? "col-span-12" : "col-span-8";
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const success = Object.keys(formState.errors).length > 0 && !fieldState.invalid;
        const variant = fieldState.invalid ? "destructive" : success ? "success" : "form";
        return (
          <FormItem>
            <div className="grid grid-cols-12 items-center">
              {label !== false && <FormLabel className="col-span-4 text-left text-base font-normal">{labelText}</FormLabel>}
              <FormControl className={`${colInput}`}>
                <div>
                  <div className="relative">
                    <ShadcnInput
                      {...field}
                      variant={variant}
                      disabled={formState.disabled}
                      type={type}
                      className="h-8 w-full rounded-sm disabled:bg-[#eaecef] disabled:opacity-1 disabled:border-gray-300 disabled:cursor-auto"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {fieldState.invalid ? (
                        <span className="text-sm font-medium text-destructive">
                          <ExclamationTriangleIcon />
                        </span>
                      ) : success ? (
                        <span className="text-sm font-medium text-green-700">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <FormMessage className="mt-1.5 text-xs text-destructive font-normal" />
                </div>
              </FormControl>
            </div>
          </FormItem>
        );
      }}
    />
  );
}

export default Input;
