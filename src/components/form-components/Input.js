import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { capitalize } from "../../utils";

function Input({ label, name, errors, vertical, inputProps, labelProps, colProps, labelCols, inputCols, datalist }) {
  const labelText = label ? label : `${capitalize(name.split('.').at(-1)).replace('_', ' ')}:`
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = label === false ? 12 : inputCols ? inputCols : 12 - labelColumns
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
        {...inputProps}
        isInvalid={errors && Boolean(errors[name])}
      />
      {datalist && (
        <datalist id={labelText + "list"}>
          {datalist.map(el => (
            <option value={el} />
          ))}
        </datalist>
      )}
      <Form.Control.Feedback type="invalid" className="text-xs text-center">
        {errors && errors[name]}
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
          {...inputProps}
          isInvalid={errors && Boolean(errors[name])}
        />
        {datalist && (
          <datalist id={labelText + "list"}>
            {datalist.map(el => (
              <option value={el} />
            ))}
          </datalist>
        )}
        <Form.Control.Feedback type="invalid" className="text-xs text-center">
          {errors && errors[name]}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}

export default Input;
