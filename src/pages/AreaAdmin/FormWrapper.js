import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { apiPost, apiUpdate } from "../../api/utils";
import ViewModal from "../../components/Modals/ViewModal/ViewModal";
import useSetViewForm from "../../hooks/useSetViewForm/useSetViewForm";
import { dateToDatePicker } from "../../utils";
import { parseFormData } from "../utils";

function FormWrapper({ data, setData, initialData, onSuccess, url, children, view, preview = false }) {
  const staticForm = Boolean(view)
  useSetViewForm(staticForm)
  const formRef = useRef(null);
  const [error, setError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false)
  const [key, setKey] = useState(1)
  // Se vengono passati dei dati iniziali inseriscili nel form
  useEffect(() => {
    if (!initialData) return
    [...formRef.current.elements].forEach(el => {
      let defaultValue;
      defaultValue = initialData[el.name]
      if (defaultValue !== undefined && defaultValue !== null) {
        if (el.type === "file") return;
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
      setTimeout(() => setValidated(false), 1000 * 10);
      [...document.querySelectorAll('.react-select')].forEach(el => {
        const isRequired = el.nextSibling?.hasAttribute('required')
        const isEmpty = [...el.children].find(el => el.tagName === 'INPUT').value === ""
        if (isRequired && isEmpty) {
          el.querySelector('div').classList.add('input-error')
          setTimeout(() => el.querySelector('div').classList.remove('input-error'), 1000 * 10)
        } else {
          el.querySelector('div').classList.add('input-success')
          setTimeout(() => el.querySelector('div').classList.remove('input-success'), 1000 * 10)
        }
      })
    } else {
      let formData = Object.fromEntries(new FormData(form).entries());
      [...form.elements].forEach(el => {
        if (el.hasAttribute('multiple')) {
          formData[el.name] = [...el.selectedOptions].map(op => op.value)
        }
      });
      if (initialData) {
        updateRecord(formData, form);
      } else {
        createRecord(formData, form)
      }
    }
  };

  // Funzione che gestisce la creazione di un nuovo record
  const createRecord = (formData, form) => {
    parseFormData(formData)
    const finalFormData = new FormData()
    Object.entries(formData).forEach((obj) => finalFormData.append(obj[0], obj[1]))
    apiPost(url, finalFormData).then(response => {
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
    parseFormData(formData)
    const finalFormData = new FormData()
    Object.entries(formData).forEach((obj) => finalFormData.append(obj[0], obj[1]))
    apiUpdate(url + initialData.id + '/', finalFormData).then(response => {
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
      console.log(err);
    })
  }
  const PreviewComponent = preview ? preview.FormComponent : "div"
  let formData;
  if (preview?.data && showPreview) {
    formData = Object.fromEntries(new FormData(formRef.current).entries());
    parseFormData(formData)
    console.log({...formData});
  } else { formData = {}}
  const previewData = preview?.data ? {...preview.data, [preview.itemKey]: formData } : {}
  return (
    <>
    {showPreview && (
      <ViewModal show={true} handleClose={() => setShowPreview(false)}>
        <PreviewComponent data={previewData} />
      </ViewModal>
    )}
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
            {preview && (
              <Button variant="secondary" className="bg-gray-500" onClick={() => setShowPreview(true)}>
                Anteprima
              </Button>
            )}
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
    </>
  );
}

export default FormWrapper;
