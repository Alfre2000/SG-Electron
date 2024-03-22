import { capitalize } from "@utils/main";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@components/shadcn/Form";
import RequiredSelect from "@components/form-components/RequiredSelect";
import Select from "react-select";
import { customStyle } from "./stylesSelect";

type Option = { value: string | number; label: string | number };

type SearchSelectProps = {
  name: string;
  label?: string | boolean;
  options: Option[];
};

function SearchSelect({ name, label, options }: SearchSelectProps) {
  const form = useFormContext();

  const labelText = label || `${capitalize(name).replace("_", " ")}:`;
  const colInput = label === false ? "col-span-12" : "col-span-8";
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const errors = Object.keys(formState.errors).length > 0;
        const success = errors && !fieldState.invalid;
        const errorClass = fieldState.invalid ? "react-select-invalid" : "";
        const successClass = success ? "react-select-valid" : "";
        return (
          <FormItem>
            <div className="grid grid-cols-12 items-center">
              {label !== false && (
                <FormLabel className="col-span-4 text-left text-base font-normal">{labelText}</FormLabel>
              )}
              <FormControl className={`${colInput}`}>
                <div>
                  <RequiredSelect
                    className={`react-select h-10 hover:border-[#e5e7eb] text-left ${errorClass} ${successClass}`}
                    SelectComponent={Select}
                    placeholder=""
                    noOptionsMessage={() => "Nessun risultato"}
                    isClearable={true}
                    styles={customStyle}
                    name={field.name}
                    options={options}
                    isDisabled={field.disabled}
                    inputId={name}
                    error={fieldState.invalid}
                    errors={errors}
                    onChange={(val: Option) => field.onChange(val?.value)}
                    value={options?.find((option) => option.value === field?.value)}
                  />
                  <FormMessage className="-mt-1.5 text-xs text-destructive font-normal" />
                </div>
              </FormControl>
            </div>
          </FormItem>
        );
      }}
    />
  );
}

export default SearchSelect;
