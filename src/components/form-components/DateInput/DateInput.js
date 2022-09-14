import React from "react";
import { useId } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useFormContext } from "../../../contexts/FormContext";
import { findNestedElement } from "../../../pages/utils";
import { dateToDatePicker } from "../../../utils";

function DateInput({ vertical = false }) {
  const id = useId()
  const { errors, initialData, view } = useFormContext();
  const errorsValue = errors
    ? findNestedElement(errors, "data")?.join(" - ")
    : undefined;
  const defaultValue = dateToDatePicker(
    initialData?.data ? new Date(initialData.data) : new Date()
  );
  const Input = (
    <Form.Control
      size="sm"
      className="text-center"
      type="date"
      name="data"
      id={id}
      defaultValue={defaultValue}
      isInvalid={errors && Boolean(errorsValue)}
      isValid={!errorsValue && !!errors}
      disabled={view}
    />
  );
  return vertical ? (
    <Form.Group className="text-center">
      <Form.Label htmlFor={id}>Data:</Form.Label>
      {Input}
    </Form.Group>
  ) : (
    <Form.Group as={Row}>
      <Form.Label htmlFor={id} column sm="4">
        Data:
      </Form.Label>
      <Col sm="8">{Input}</Col>
    </Form.Group>
  );
}

export default DateInput;
