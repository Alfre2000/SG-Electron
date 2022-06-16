import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { apiPost, apiUpdate } from "../../api/utils";
import useSetViewForm from "../../hooks/useSetViewForm";
import { dateToDatePicker } from "../../utils";
import { parseFormData } from "../utils";

function FormWrapper({ data, setData, initialData, onSuccess, url, children, view }) {
  const staticForm = Boolean(view)
  useSetViewForm(staticForm)
  const formRef = useRef(null);
  const [error, setError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [key, setKey] = useState(1)
  // Se vengono passati dei dati iniziali inseriscili nel form
  useEffect(() => {
    if (!initialData) return
    [...formRef.current.elements].forEach(el => {
      let defaultValue;
      defaultValue = initialData[el.name]
      if (defaultValue !== undefined && defaultValue !== null) {
        if (el.tagName === 'SELECT') {
          if (el.querySelector(`option[value="${defaultValue}"]`)) {
            el.querySelector(`option[value="${defaultValue}"]`).setAttribute('selected', 'selected')
          }
        } else if (el.type === "checkbox") {
          el.setAttribute('checked', defaultValue)
        } else if (el.type === "date") {
          el.defaultValue = dateToDatePicker(new Date(defaultValue)) 
        } else {
          el.defaultValue = defaultValue
        }
      }
    })
  }, [initialData])

  // Funzione che gestisce la validazione del form
  const handleForm = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      form.reportValidity()
      setError(true)
      setTimeout(() => setError(false), 4000)
      setValidated(true);
      setTimeout(() => setValidated(false), 1000 * 10)
    } else {
      let formData = Object.fromEntries(new FormData(form).entries());
      [...form.elements].forEach(el => {
        if (el.hasAttribute('multiple')) {
          formData[el.name] = [...el.selectedOptions].map(op => op.value)
        }
      })
      if (initialData) {
        updateRecord(formData, form);
      } else {
        createRecord(formData, form)
      }
    }
  };

  // Funzione che gestisce la creazione di un nuovo record
  const createRecord = (formData, form) => {
    // const formDataCopy = {...formData}
    // console.log(formDataCopy);
    // Object.keys(formDataCopy).forEach(key => {
    //   if (formData[key] === "") delete formData[key]
    //   if (key.includes('.')) {
    //     let [parent_obj, child_key] = key.split('.')
    //     if (formData[parent_obj] === undefined) formData[parent_obj] = {};
    //     formData[parent_obj][child_key] = formData[key]
    //     delete formData[key]
    //   }
    //   if (key.split('__').length === 3) {
    //     const [ chiave, index, campo ] = key.split('__')
    //     const nElementiPerRiga = Object.keys(formDataCopy).filter(k => k.startsWith(chiave + '__0')).length
    //     if (!(chiave in formData)) {
    //       const nElementi = Object.keys(formDataCopy).filter(k => k.startsWith(chiave + '__')).length
    //       formData[chiave] = Array.from(Array(nElementi / nElementiPerRiga))
    //     }
    //     if (!formData[chiave][index]) formData[chiave][index] = {}
    //     if (formData[key] !== "") {
    //       formData[chiave][index][campo] = formData[key]
    //     }
    //     delete formData[key]
    //     // Se il record è completo elimina la riga se è vuota
    //     if (Object.keys(formData[chiave][index]).length + 1 === nElementiPerRiga) {
    //       if (Object.values(formData[chiave][index]).every(value => !value)) {
    //         formData[chiave].splice(index, 1)
    //       }
    //     }
    //   }
    // })
    console.log('prima', {...formData});
    parseFormData(formData)
    console.log('dopo', formData);
    apiPost(url, formData).then(response => {
      if (data.records) {
        setData({...data, records: {...data.records,  results:[response, ...data.records.results]}})
      }
      if (onSuccess) onSuccess(response);
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
      console.log(err);
    })
  }

  // Funzione che gestisce la modifica di un record già esistente
  const updateRecord = (formData, form) => {
    [...form.elements].forEach(el => {
      if (el.type ===  'checkbox' && !el.checked) {
        formData[el.name] = "false"
      } else if (el.type !== 'text') {
        if (formData[el.name] === "") formData[el.name] = null
      }
    })
    // const formDataCopy = {...formData}
    // Object.keys(formData).forEach(key => {
    //   // if (formData[key] === "") delete formData[key]
    //   if (key.includes('.')) {
    //     let [parent_obj, child_key] = key.split('.')
    //     if (formData[parent_obj] === undefined) formData[parent_obj] = {};
    //     formData[parent_obj][child_key] = formData[key]
    //     delete formData[key]
    //   }
    //   if (key.split('__').length === 3) {
    //     const [ chiave, index, campo ] = key.split('__')
    //     const nElementiPerRiga = Object.keys(formDataCopy).filter(k => k.startsWith(chiave + '__0')).length
    //     if (!(chiave in formData)) {
    //       const nElementi = Object.keys(formDataCopy).filter(k => k.startsWith(chiave + '__')).length
    //       formData[chiave] = Array.from(Array(nElementi / nElementiPerRiga))
    //     }
    //     if (!formData[chiave][index]) formData[chiave][index] = {}
    //     if (formData[key] !== "") {
    //       formData[chiave][index][campo] = formData[key]
    //     }
    //     delete formData[key]
    //     // Se il record è completo elimina la riga se è vuota
    //     if (Object.keys(formData[chiave][index]).length + 1 === nElementiPerRiga) {
    //       if (Object.values(formData[chiave][index]).every(value => !value)) {
    //         formData[chiave].splice(index, 1)
    //       }
    //     }
    //   }
    // });
    console.log('prima', {...formData});
    parseFormData(formData, true)
    console.log('dopo', formData);
    apiUpdate(url + initialData.id + '/', formData).then(response => {
      const records = data.records.results.map(record => {
        if (record.id === response.id) {
          return response
        }
        return record
      })
      setData({...data, records: {...data.records, results: records}})
      onSuccess();
    }).catch(err => {
      setError(err)
      setTimeout(() => setError(false), 1000 * 10)
      console.log(err);
    })
  }
  return (
    <Form
      ref={formRef}
      noValidate
      validated={validated}
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
  );
}

export default FormWrapper;
