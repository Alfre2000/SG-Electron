import React, { useState } from "react";
import Select from "react-select";
import { capitalize } from "../../utils";
import Input from "./Input";
import { customStyle } from "./stylesSelect";

const inputStyle = {...customStyle,
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
    boxShadow: state.isFocused ? "0 0 0 0.25rem rgb(13 110 253 / 25%)" : "none",
    minHeight: "31px",
    height: "31px",
    borderRadius: "0px 4px 4px 0px",
    borderLeft: "none",
    minWidth: "75px",
  }),
}

function InputMisura({ label, name, initialData, convFunction, errors, options }) {
  const [value, setValue] = useState(initialData?.value || "")
  const [uMisura, setUMisura] = useState(initialData?.u || null)

  const lastName = name ? name.split('__')[name.split('__').length - 1] : "";
  const labelText = label ? label : `${capitalize(lastName).replace('_', ' ')}:`
  return (
    <>
      <input
        hidden
        name={name}
        className="hidden"
        value={convFunction(uMisura.value, initialData.u.value, value)}
        onChange={() => {}}
      />
      <Input
        label={labelText}
        labelCols={5}
        errors={errors}
        inputProps={{
          type: "number",
          value: value,
          onChange: (e) => setValue(e.target.value),
          className: "rounded-r-none text-center",
        }}
      />
      <Select
        placeholder=""
        noOptionsMessage={() => "Nessun risultato"}
        isClearable={false}
        styles={inputStyle}
        options={options}
        value={uMisura}
        onChange={(selection) => {
          const newUnità = selection.value;
          const oldUnità = uMisura.value;
          setValue(convFunction(oldUnità, newUnità, value));
          setUMisura(selection);
        }}
      />
    </>
  );
}

export default InputMisura;
