import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useFormContext } from "../../contexts/FormContext";
import { findNestedElement } from "../../pages/utils";
import { capitalize } from "../../utils";

function Checkbox({ label, name, vertical, inputProps, labelProps, labelCols, initialData }) {
  const lastName = name ? name.split('__')[name.split('__').length - 1] : "";
  const labelText = label ? label : `${capitalize(lastName).replace('_', ' ')}:`
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = 12 - labelColumns
  const formData = useFormContext()
  initialData = initialData !== undefined ? initialData : formData?.initialData
  let defaultValue = initialData ? findNestedElement(initialData, name) : true
  defaultValue = defaultValue === "false" ? false : defaultValue
  return vertical ? (
    <Form.Group className="m-auto text-center">
      {label !== false && <Form.Label {...labelProps}  htmlFor={name}>{labelText}</Form.Label>}
      <Form.Check 
        type="checkbox"
        name={name}
        defaultChecked={defaultValue}
        disabled={formData?.view}
        id={name}
        {...inputProps}
      />
    </Form.Group>
  ) : (
    <Form.Group as={Row}>
      {label !== false && (
        <Form.Label column sm={labelColumns} htmlFor={name} {...labelProps}>
          {labelText}
        </Form.Label>
      )}
      <Col sm={inputColumns}>
        <Form.Check
          type="checkbox"
          className="text-center mt-2"
          name={name}
          id={name}
          defaultChecked={defaultValue}
          disabled={formData?.view}
          {...inputProps}
        />
      </Col>
    </Form.Group>
  );
}

export default Checkbox;
