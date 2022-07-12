import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormContext } from "../../../contexts/FormContext";
import { findNestedElement } from "../../../pages/utils";
import ImageModal from "../../Modals/ImageModal/ImageModal";
const electron = window?.require ? window.require("electron") : null;

function FileField({ name }) {
  const { initialData, view, errors } = useFormContext();
  const [showModal, setShowModal] = useState(false)
  const errorsValue = errors
    ? findNestedElement(errors, name)?.join(" - ")
    : undefined;
  const defaultValue = initialData
    ? findNestedElement(initialData, name)
    : undefined;
  const isImage = ["png", "jpg", "jpeg"].includes(
    defaultValue?.split(".")?.at(-1).toLowerCase()
  );
  const handleClick = () => {
    if (isImage) {
      setShowModal(true)
    } else {
      electron.ipcRenderer.invoke("open-file", defaultValue);
    }
  }
  return (
    <Form.Group className="text-left">
      {defaultValue && (
        <div className="pb-2">
          <span className="font-medium">Attualmente:</span>
          <span
            className="pl-6 hover:underline-offset-1 hover:underline hover:cursor-pointer"
            onClick={handleClick}
          >
            {defaultValue?.split("/")?.at(-1)}
          </span>
          {showModal && (
            <ImageModal setShow={setShowModal} url={defaultValue} /> 
          )}
        </div>
      )}
      <div className="flex items-center gap-x-12">
        {defaultValue && <div className="font-medium">Modifica: </div>}
        <Form.Control
          type="file"
          size="sm"
          name={name}
          className="text-center"
          disabled={!!view}
          isInvalid={errors && Boolean(errorsValue)}
          isValid={!errorsValue && !!errors}
        />
      </div>
      <Form.Control.Feedback type="invalid" className="text-xs text-center">
        {errors && errorsValue}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default FileField;
