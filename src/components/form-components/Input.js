import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useFormContext } from "../../contexts/FormContext";
import { findNestedElement } from "../../pages/utils";
import { capitalize } from "../../utils";

function Input({ label, name, errors, vertical, inputProps, labelProps, colProps, labelCols, inputCols, datalist }) {
  const labelText = label ? label : name ? `${capitalize(name.split('.').at(-1)).replace('_', ' ')}:` : ""
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = label === false ? 12 : inputCols ? inputCols : 12 - labelColumns
  const formData = useFormContext()
  errors = errors !== undefined ? errors : formData.errors
  const errorsValue = errors ? findNestedElement(errors, name)?.join(' - ') : undefined
  const defaultValue = formData?.initialData ? findNestedElement(formData?.initialData, name) : null
  const disabled = formData?.view === true ? true : null
  if (datalist) {
    inputProps = inputProps || {};
    inputProps.list = labelText + "list"
  }
  return vertical ? (
    <Form.Group className="text-center">
      {label !== false && <Form.Label {...labelProps}>{labelText}</Form.Label>}
      <Form.Control
        size="sm"
        name={name}
        className="text-center"
        defaultValue={defaultValue}
        disabled={disabled}
        {...inputProps}
        isInvalid={errors && Boolean(errorsValue)}
        isValid={!errorsValue && !! errors}
      />
      {datalist && (
        <datalist id={labelText + "list"}>
          {datalist.map(el => (
            <option value={el} />
          ))}
        </datalist>
      )}
      <Form.Control.Feedback type="invalid" className="text-xs text-center">
        {errors && errorsValue}
      </Form.Control.Feedback>
    </Form.Group>
  ) : (
    <Form.Group as={Row}>
      {label !== false && (
        <Form.Label column sm={labelColumns} {...labelProps}>
          {labelText}
        </Form.Label>
      )}
      <Col sm={inputColumns} {...colProps}>
        <Form.Control
          size="sm"
          name={name}
          className="text-center"
          defaultValue={defaultValue}
          disabled={disabled}
          {...inputProps}
          isInvalid={errors && Boolean(errorsValue)}
          isValid={!errorsValue && !! errors}
        />
        {datalist && (
          <datalist id={labelText + "list"}>
            {datalist.map(el => (
              <option value={el} />
            ))}
          </datalist>
        )}
        <Form.Control.Feedback type="invalid" className="text-xs text-center">
          {errors && errorsValue}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

export default Input;
