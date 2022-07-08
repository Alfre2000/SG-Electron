import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useFormContext } from "../../contexts/FormContext";
import { findNestedElement } from "../../pages/utils";
import { dateToTimePicker } from "../../utils";

function TimeInput({ initialData, view, vertical = false }) {
  const formData = useFormContext();
  initialData = initialData !== undefined ? initialData : formData?.initialData;
  view = view !== undefined ? view : formData?.view;
  const errorsValue = formData?.errors
    ? findNestedElement(formData?.errors, "ora")?.join(" - ")
    : undefined;
  const [time, setTime] = useState(
    dateToTimePicker(
      initialData?.data ? new Date(initialData.data) : new Date()
    )
  );
  setInterval(() => {
    if (!initialData) {
      setTime(dateToTimePicker(new Date()));
    }
  }, 1000 * 60);

  const Input = (
    <Form.Control
      size="sm"
      className="text-center"
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      name="ora"
      placeholder="Ora"
      isInvalid={formData?.errors && Boolean(errorsValue)}
      isValid={!errorsValue && !!formData?.errors}
      disabled={view}
    />
  );
  return vertical ? (
    <Form.Group className="text-center">
      <Form.Label>Ora:</Form.Label>
      {Input}
    </Form.Group>
  ) : (
    <Form.Group as={Row}>
      <Form.Label column sm="4">
        Ora:
      </Form.Label>
      <Col sm="8">{Input}</Col>
    </Form.Group>
  );
}

export default TimeInput;
