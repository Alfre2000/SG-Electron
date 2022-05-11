import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { capitalize } from "../../utils";

function Select({ label, name, vertical, inputProps, labelProps, labelCols, data }) {
  const labelText = label ? label : `${capitalize(name).replace('_', ' ')}:`
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = 12 - labelColumns
  return vertical ? (
    <Form.Group className="text-center">
      <Form.Label {...labelProps}>{labelText}</Form.Label>
      <Form.Select
        size="sm"
        className="text-center"
        name={name}
        {...inputProps}
      >
        <option value=""></option>
          {data && data.map((record) => (
            <option key={record[0]} value={record[0]}>
              {record[1]}
            </option>
          ))}
      </Form.Select>
    </Form.Group>
  ) : (
    <Form.Group as={Row}>
      <Form.Label column sm={labelColumns} {...labelProps}>
        {labelText}
      </Form.Label>
      <Col sm={inputColumns}>
        <Form.Select
          size="sm"
          className="text-center"
          name={name}
          {...inputProps}
        >
          <option value=""></option>
          {data && data.map((record) => (
            <option key={record[0]} value={record[0]}>
              {record[1]}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  );
}

export default Select;
