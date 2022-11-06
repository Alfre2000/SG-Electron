import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { capitalize } from "../../utils";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { findNestedElement } from './../../pages/utils';
import { customStyle } from "./stylesSelect";
import RequiredSelect from "./RequiredSelect";
import { useFormContext } from "../../contexts/FormContext";

function SearchSelect({ label, name, inputProps, labelProps, labelCols, options, createTable, initialData, errors, colProps, errorName }) {
  if (label === undefined &&  name === undefined) label = false;
  const lastName = name ? name.split('__')[name.split('__').length - 1] : ""; 
  const labelText = label ? label : name ? `${capitalize(lastName).replace('_', ' ')}:` : ""
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = label !== false ? 12 - labelColumns : 12
  const SelectComponent = createTable ? CreatableSelect : RequiredSelect
  const formData = useFormContext()
  errors = errors !== undefined ? errors : formData?.errors
  initialData = initialData !== undefined ? initialData : formData?.initialData
  const disabled = formData?.view === true ? true : null
  let defaultValue = !!initialData && Object.keys(initialData).length > 0 ? findNestedElement(initialData, name) : undefined
  defaultValue =  typeof defaultValue === "object" ? defaultValue?.id : defaultValue
  const errorSearch = errorName ? errorName : name
  const errorsValue = errors ? findNestedElement(errors, errorSearch)?.join(' - ') : undefined
  const errorClass = errorsValue ? "react-select-invalid" : ""
  const successClass = errors && !errorsValue ? "react-select-valid" : ""
  const viewClass = formData?.view ? "react-select-view" : ""
  return (
    <Form.Group as={Row} className="items-center">
      {label !== false && (
        <Form.Label column sm={labelColumns} htmlFor={name} {...labelProps}>
          {labelText}
        </Form.Label>
      )}
      <Col sm={inputColumns} {...colProps}>
        <SelectComponent
          className={`react-select text-center ${errorClass} ${successClass} ${viewClass}`}
          SelectComponent={Select}
          placeholder=""
          noOptionsMessage={() => "Nessun risultato"}
          isClearable={true}
          styles={customStyle}
          name={name}
          options={options}
          defaultValue={defaultValue ? options.filter(o => o.value === defaultValue || o.label === defaultValue)[0] : null}
          isDisabled={disabled}
          inputId={name}
          {...inputProps}
          error={errorsValue}
          errors={!!errors}
        />
        {errorsValue && (
          <p type="invalid" className="text-xs text-center pt-1 text-red-700">
            {errorsValue}
          </p>
        )}
      </Col>
    </Form.Group>
  )
}

export default SearchSelect