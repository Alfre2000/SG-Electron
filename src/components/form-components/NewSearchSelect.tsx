import { Label } from "@components/shadcn/Label";
import CreatableSelect from "react-select/creatable";
import RequiredSelect from "./RequiredSelect";
import { capitalize } from "utils";
import Select from "react-select";
import { findNestedElement } from "@pages/utils";
import { useFormContext } from "@contexts/FormContext";
import { customStyle } from "./stylesSelect";

type NewSearchSelectProps = {
  options: { value: string | number; label: string | number }[];
  label?: string | false;
  name?: string;
  createTable?: boolean;
  errors?: Record<string, string[]>;
  onChange?: (value: { value: string | number; label: string | number } | null) => void;
};

function NewSearchSelect({ options, label, name, createTable, errors, onChange }: NewSearchSelectProps) {
  if (label === undefined && name === undefined) label = false;
  const lastName = name ? name.split("__")[name.split("__").length - 1] : "";
  const labelText = label ? label : name ? `${capitalize(lastName).replace("_", " ")}:` : "";
  const SelectComponent = createTable ? CreatableSelect : RequiredSelect;

  const formData = useFormContext();
  errors = errors !== undefined ? errors : formData?.errors;
  const disabled = formData?.view === true ? true : null;
  const errorsValue = errors ? findNestedElement(errors, name)?.join(" - ") : undefined;
  const errorClass = errorsValue ? "react-select-invalid" : "";
  const successClass = errors && !errorsValue ? "react-select-valid" : "";
  const viewClass = formData?.view ? "react-select-view" : "";
  return (
    <div className="">
      {label !== false && <Label htmlFor={name} className="mb-1.5">{labelText}</Label>}
      <SelectComponent
        className={`react-select h-10 text-center ${errorClass} ${successClass} ${viewClass}`}
        SelectComponent={Select}
        placeholder=""
        noOptionsMessage={() => "Nessun risultato"}
        isClearable={true}
        styles={customStyle}
        name={name}
        options={options}
        isDisabled={disabled}
        inputId={name}
        error={errorsValue}
        errors={!!errors}
        onChange={onChange}
      />
      {errorsValue && <p className="text-xs text-center pt-1 text-red-700">{errorsValue}</p>}
    </div>
  );
}

export default NewSearchSelect;
