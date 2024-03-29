import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useFormContext } from "../../contexts/FormContext";
import { findNestedElement } from "../../pages/utils";
import { capitalize } from "../../utils";

const Input = React.forwardRef(
  ({ label, name, errors, vertical, inputProps, labelProps, colProps, labelCols, inputCols, floating, isDisabled }, ref) => {
  const lastName = name ? name.split('__')[name.split('__').length - 1] : "";
  const labelText = label ? label : name ? `${capitalize(lastName).replace('_', ' ')}:` : ""
  const labelColumns = labelCols ? labelCols : 4 
  const inputColumns = label === false ? 12 : inputCols ? inputCols : 12 - labelColumns
  const formData = useFormContext()
  errors = errors !== undefined ? errors : formData?.errors
  const errorsValue = errors ? findNestedElement(errors, name)?.join(' - ') : undefined
  const defaultValue = formData?.initialData && !("value" in (inputProps || {})) ? findNestedElement(formData?.initialData, name) : undefined
  const default_ = inputProps && "value" in inputProps ? {} : { defaultValue: defaultValue }
  const disabled = formData?.view === true ? true : isDisabled ? isDisabled : null
  return vertical ? (
    <Form.Group className="text-center">
      {label !== false && <Form.Label {...labelProps} htmlFor={name}>{labelText}</Form.Label>}
      <Form.Control
        ref={ref}
        size="sm"
        id={name}
        name={name}
        className="text-center"
        {...default_}
        disabled={disabled}
        {...inputProps}
        isInvalid={errors && Boolean(errorsValue)}
        isValid={!errorsValue && !! errors}
      />
      <Form.Control.Feedback type="invalid" className="text-xs text-center">
        {errors && errorsValue}
      </Form.Control.Feedback>
    </Form.Group>
  ) : floating ? (
    <>
      <FloatingLabel label={labelText} {...labelProps} htmlFor={name}>
        <Form.Control
          size="sm"
          ref={ref}
          id={name}
          name={name}
          {...default_}
          disabled={disabled}
          {...inputProps}
          isInvalid={errors && Boolean(errorsValue)}
          isValid={!errorsValue && !! errors}
        />
      </FloatingLabel>
      <Form.Control.Feedback type="invalid" className="text-xs text-center">
        {errors && errorsValue}
      </Form.Control.Feedback>
    </>
  ) : (
    <Form.Group as={Row}>
      {label !== false && (
        <Form.Label column sm={labelColumns} htmlFor={name} {...labelProps}>
          {labelText}
        </Form.Label>
      )}
      <Col sm={inputColumns} {...colProps}>
        <Form.Control
          ref={ref}
          size="sm"
          id={name}
          name={name}
          className="text-center"
          {...default_}
          disabled={disabled}
          {...inputProps}
          isInvalid={errors && Boolean(errorsValue)}
          isValid={!errorsValue && !! errors}
        />
        <Form.Control.Feedback type="invalid" className="text-xs text-center">
          {errors && errorsValue}
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
})

export default Input;
