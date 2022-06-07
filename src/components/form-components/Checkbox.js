import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { capitalize } from "../../utils";

function Checkbox({ label, name, vertical, inputProps, labelProps, labelCols, initialData }) {
  const labelText = label ? label : `${capitalize(name.split('.').at(-1)).replace('_', ' ')}:`
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = 12 - labelColumns
  return vertical ? (
    <Form.Group className="m-auto text-center">
      {label !== false && <Form.Label {...labelProps}>{labelText}</Form.Label>}
      <Form.Check 
        type="checkbox"
        name={name}
        defaultChecked={initialData ? initialData[name] : true}
        {...inputProps}
      />
    </Form.Group>
  ) : (
    <Form.Group as={Row}>
      {label !== false && (
        <Form.Label column sm={labelColumns} {...labelProps}>
          {labelText}
        </Form.Label>
      )}
      <Col sm={inputColumns}>
        <Form.Check
          type="checkbox"
          className="text-center mt-2"
          name={name}
          defaultChecked={initialData ? initialData[name] : true}
          {...inputProps}
        />
      </Col>
    </Form.Group>
  );
}

export default Checkbox;
