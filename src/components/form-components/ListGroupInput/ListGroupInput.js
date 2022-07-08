import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { useFormContext } from "../../../contexts/FormContext";
import { findNestedElement } from "../../../pages/utils";
import Hidden from "../Hidden/Hidden";

function ListGroupInput({ options, defaultValue, name }) {
  const { errors, view } = useFormContext();
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const errorsValue = errors
    ? findNestedElement(errors, name)?.join(" - ")
    : undefined;
  const listGroupRef = useRef(null);
  useEffect(() => {
    if (!options || !defaultValue) return;
    const index = options.findIndex((op) => op.value === defaultValue);
    const height = listGroupRef.current.querySelector("div").offsetHeight;
    listGroupRef.current.parentElement.scrollTo(0, height * (index - 3));
  }, [defaultValue, options]);
  return (
    <>
      <ListGroup className={view ? "" : "cursor-pointer"} ref={listGroupRef}>
        {options &&
          options.map((el) => (
            <ListGroup.Item
              active={selectedOption === el.value}
              onClick={() => {
                if (view) return;
                if (selectedOption === el.value) setSelectedOption(null);
                else setSelectedOption(el.value);
              }}
              key={el.value}
              value={el.value}
            >
              {el.label}
            </ListGroup.Item>
          ))}
      </ListGroup>
      <Hidden value={selectedOption} name={name} readOnly={true} />
      {errorsValue && (
        <Form.Control.Feedback type="invalid" className="text-xs text-center">
          {errorsValue}
        </Form.Control.Feedback>
      )}
    </>
  );
}

export default ListGroupInput;
