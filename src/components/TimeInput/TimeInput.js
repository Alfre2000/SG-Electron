import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { dateToTimePicker } from "../../utils";

function TimeInput() {
  const [time, setTime] = useState(dateToTimePicker(new Date()));
  setInterval(() => {
    setTime(dateToTimePicker(new Date()));
  }, 1000 * 60)

  return (
    <Form.Control
      size="sm"
      className="text-center"
      type="time"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      name="ora"
    />
  );
}

export default TimeInput;
