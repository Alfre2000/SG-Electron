import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { dateToTimePicker } from "../../utils";

function TimeInput({ initialData }) {
  const [time, setTime] = useState(dateToTimePicker(new Date()));
  setInterval(() => {
    if (!initialData) {
      setTime(dateToTimePicker(new Date()));
    }
  }, 1000 * 60)

  return (initialData?.data ? (
      <Form.Control
        size="sm"
        className="text-center"
        type="time"
        name="ora"
        defaultValue={dateToTimePicker(new Date(initialData.data))}
      />
    ) : (
      <Form.Control
        size="sm"
        className="text-center"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        name="ora"
      />
    )
  );
}

export default TimeInput;
