import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Form } from "react-bootstrap";
import { useFormContext } from "../../../contexts/FormContext";
import { findNestedElement } from "../../../pages/utils";
import ImageModal from "../../Modals/ImageModal/ImageModal";
import Hidden from "../Hidden/Hidden";
const electron = window?.require ? window.require("electron") : null;

const FileField = React.forwardRef(({ name, onChange }, ref) => {
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
  const hiddenFileRef = useRef();
  useEffect(() => {
    if (defaultValue) {
      fetch(defaultValue).then(res => res.blob()).then(blob => {
        const dataTransfer = new DataTransfer()
        const file = new File([blob], defaultValue?.split("?")?.[0])
        dataTransfer.items.add(file)
        hiddenFileRef.current.files = dataTransfer.files
      })
    }
  }, [defaultValue])
  return (
    <Form.Group className="text-left">
      {defaultValue && (
        <div className="text-center">
          <span className="font-medium">Attualmente:</span>
          <span
            className="pl-6 hover:underline-offset-1 hover:underline hover:cursor-pointer"
            onClick={handleClick}
          >
            {defaultValue?.split("/")?.at(-1)?.split("?")?.[0]}
          </span>
          {showModal && (
            <ImageModal setShow={setShowModal} url={defaultValue} /> 
          )}
        </div>
      )}
      {!defaultValue &&
        <div className="flex items-center gap-x-12">
          <Form.Control
            type="file"
            size="sm"
            name={name}
            className="text-center"
            disabled={!!view}
            isInvalid={errors && Boolean(errorsValue)}
            isValid={!errorsValue && !!errors}
            ref={ref}
            onChange={onChange}
          />
        </div>
      }
      {defaultValue && (
        <Hidden name={name} type="file" ref={hiddenFileRef} />
      )}
      <Form.Control.Feedback type="invalid" className="text-xs text-center">
        {errors && errorsValue}
      </Form.Control.Feedback>
    </Form.Group>
  );
})

export default FileField;
