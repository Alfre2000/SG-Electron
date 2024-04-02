import { capitalize } from "@utils/main";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@components/shadcn/Form";
import RequiredSelect from "@components/form-components/RequiredSelect";
import Select from "react-select";
import { customStyle } from "./stylesSelect";
import { cn } from "@lib/utils";

type Option = { value: string | number; label: string | number };

type SearchSelectProps = {
  name: string;
  label?: string | boolean;
  options: Option[];
  inputColumns?: number;
  inputClassName?: string;
};

function SearchSelect({ name, label, options, inputColumns = 8, inputClassName }: SearchSelectProps) {
  const form = useFormContext();

  const labelText = label || `${capitalize(name).replaceAll("_", " ")}:`;
  const colInput = label === false ? 12 : inputColumns;
  const colLabel = label === false ? 0 : 12 - colInput;
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
          <FormItem className="w-full">
            <div className="grid grid-cols-12 items-center overflow-visible">
              {label !== false && (
                <FormLabel
                  style={{ gridColumn: `span ${colLabel} / span ${colLabel}` }}
                  className="text-left text-base font-normal"
                >
                  {labelText}
                </FormLabel>
              )}
              <FormControl style={{ gridColumn: `span ${colInput} / span ${colInput}` }}>
                <div>
                  <RequiredSelect
                    className={cn(`react-select flex flex-col justify-center items-center h-8 hover:border-[#e5e7eb] text-left ${errorClass} ${successClass}`, inputClassName)}
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
                  <FormMessage className="mt-1 text-xs text-destructive font-normal" />
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
