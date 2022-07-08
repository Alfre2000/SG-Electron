import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormContext } from "../../contexts/FormContext";
import { findNestedElement } from "../../pages/utils";
import { dateToTimePicker } from "../../utils";

function TimeInput({ initialData }) {
  const formData = useFormContext()
  initialData = initialData !== undefined ? initialData : formData?.initialData;
  const errorsValue = formData?.errors ? findNestedElement(formData?.errors, "ora")?.join(' - ') : undefined
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

  return (
    <Form.Control
      size="sm"
      className="text-center"
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      name="ora"
      placeholder="Ora"
      isInvalid={formData?.errors && Boolean(errorsValue)}
      isValid={!errorsValue && !! formData?.errors}
    />
  );
}

export default TimeInput;
