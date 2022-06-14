import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { capitalize } from "../../utils";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { parseFromAPI } from './../../pages/utils';
import { customStyle } from "./stylesSelect";

function SearchSelect({ label, name, inputProps, labelProps, labelCols, options, createTable, initialData, errors }) {
  const labelText = label ? label : `${capitalize(name.split('.').at(-1)).replace('_', ' ')}:`
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = label !== false ? 12 - labelColumns : 12
  const SelectComponent = createTable ? CreatableSelect : Select
  const defaultValue = !!initialData && Object.keys(initialData).length > 0 ? parseFromAPI(initialData, name) : undefined
  const errorsValue = errors ? parseFromAPI(errors, name)?.join(' - ') : undefined
  return (
    <Form.Group as={Row}>
      {label !== false && (
        <Form.Label column sm={labelColumns} {...labelProps}>
          {labelText}
        </Form.Label>
      )}
      <Col sm={inputColumns}>
        <SelectComponent
          placeholder=""
          noOptionsMessage={() => "Nessun risultato"}
          isClearable={true}
          required={true}
          styles={customStyle}
          name={name}
          options={options}
          defaultValue={defaultValue ? options.filter(o => o.value === defaultValue || o.label === defaultValue)[0] : null}
          {...inputProps}
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