import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { apiPost, apiUpdate } from "../api/api";
import FormContext from "../contexts/FormContext";
import { focusErrorInput, parseFormData } from "./utils";

function FormWrapper({ data, setData, initialData, onSuccess, url, children, view, validator }) {
  const staticForm = Boolean(view)
  const formRef = useRef(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [key, setKey] = useState(1)

  // Funzione che gestisce la validazione del form
  const handleForm = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (validator) {
      const res = validator(form);
      if (res === false) return;
    }
    let formData = Object.fromEntries(new FormData(form).entries());
    [...form.elements].forEach(el => {
      if (el.hasAttribute('multiple')) {
        formData[el.name] = [...el.selectedOptions].map(op => op.value)
      }
    });
    parseFormData(form, formData)
    const finalFormData = new FormData()
    Object.entries(formData).forEach((obj) => finalFormData.append(obj[0], obj[1]))
    console.log(formData);
    if (initialData) {
      updateRecord(finalFormData, form);
    } else {
      createRecord(finalFormData, form)
    }
  };

  // Funzione che gestisce la creazione di un nuovo record
  const createRecord = (formData, form) => {
    apiPost(url, formData).then(response => {
      if (data.records) {
        const newData = {...data, records: {...data.records,  results:[response, ...data.records.results]}}
        if (onSuccess) {
          onSuccess(newData);
        } else {
          setData(newData);
        } 
      } else if (onSuccess) {
        onSuccess(response)
      }
      form.reset()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
      setKey(key + 1)
      if (document.querySelector('.paginator-first a')) {
        document.querySelector('.paginator-first a').click()
      }
    }).catch(err => {
      setError(err)
      setTimeout(() => setError(false), 1000 * 10)
      focusErrorInput(form, err)
      console.log(err);
    })
  }

  // Funzione che gestisce la modifica di un record già esistente
  const updateRecord = (formData, form) => {
    apiUpdate(url + initialData.id + '/', formData).then(response => {
      const records = data.records.results.map(record => {
        if (record.id === response.id) {
          return response
        }
        return record
      })
      const newData = {...data, records: {...data.records, results: records}}
      if (onSuccess) {
        onSuccess(newData);
      } else {
        setData(newData);
      } 
    }).catch(err => {
      setError(err)
      setTimeout(() => setError(false), 1000 * 10)
      focusErrorInput(form, err)
      console.log(err);
    })
  }
  return (
    <FormContext initialData={initialData} errors={error} view={view}>
    <Form
      ref={formRef}
      noValidate
      onSubmit={handleForm}
      key={key}
      className={initialData === undefined ? "create-form" : "update-form"}
    >
      {React.cloneElement(children, { errors: error, view: staticForm })}
      {!staticForm && (
        <Row className="mb-2 items-center">
          <Col sx={4}></Col>
          <Col sx={4} className="text-center">
            <Button type="submit" className="bg-[#0d6efd] w-28 font-medium">
              Salva
            </Button>
          </Col>
          <Col sx={4}>
            {success && (
              <Alert className="m-0 p-2" variant="success">
                <FontAwesomeIcon size="lg" className="mr-3" icon={faCheck} />
                {initialData ? "Record modificato con successo !" :"Nuovo record aggiunto !"}
              </Alert>
            )}
            {error && (
              <Alert className="m-0 p-2" variant="danger">
                <FontAwesomeIcon
                  size="lg"
                  className="mr-3"
                  icon={faCircleExclamation}
                />
                Si è verificato un errrore !
              </Alert>
            )}
          </Col>
        </Row>
      )}
    </Form>
    </FormContext>
  );
}

export default FormWrapper;
