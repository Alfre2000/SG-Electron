import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { apiPost, apiUpdate } from "../../../api/utils";
import { URLS } from "../../../urls";
import { dateToDatePicker } from "../../../utils";

function FormWrapper({ data, setData, initialData, onSuccess, children }) {
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
      if (el.name.startsWith('valore-') && initialData.record_parametri) {
        const paramID = el.name.split('valore-').at(-1)
        defaultValue = initialData.record_parametri.filter(pm => pm.parametro === paramID)[0].valore
      } else if (el.name.startsWith('aggiunte-') && initialData.record_parametri) {
        const paramID = el.name.split('aggiunte-').at(-1)
        defaultValue = initialData.record_parametri.filter(pm => pm.parametro === paramID)[0].aggiunte
      } else {
        defaultValue = initialData[el.name]
      }
      if (defaultValue !== undefined && defaultValue !== null) {
        if (el.tagName === 'SELECT') {
          el.querySelector(`option[value="${defaultValue}"]`).setAttribute('selected', 'selected')
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
    const manutenzioneSelected = form.querySelector('.list-group-item') && !form.querySelector('.list-group-item.active')
    if (form.checkValidity() === false || manutenzioneSelected) {
      form.reportValidity()
      setError(true)
      setTimeout(() => setError(false), 4000)
      setValidated(true);
      setTimeout(() => setValidated(false), 1000 * 10)
    } else {
      let { data: date, ora, ...formData } = Object.fromEntries(new FormData(form).entries());
      formData['data'] = new Date(date + " " + ora).toISOString()
      if (data.tipologia === 'lavorazione') {
        formData['impianto'] = data.impianto.id
      }
      if (data.operazioni?.length === 1) {
        formData['operazione'] = data.operazioni[0].id
      } else if (form.querySelector('.list-group-item')) {
        formData['operazione'] = form.querySelector('.list-group-item.active').getAttribute('value')
      }
      if ([...form.elements].filter(el => el.getAttribute('name') === 'operazione').length > 0) {
        formData = addParametri(formData)
      }
      if (initialData) {
        updateRecord(formData, form);
      } else {
        createRecord(formData, form)
      }
    }
  };

  // Funzione che gestisce la creazione di un nuovo record
  const createRecord = (formData, form) => {
    Object.keys(formData).forEach(key => {
      if (formData[key] === "") delete formData[key]
    })
    const baseUrl = URLS[`RECORD_${data.tipologia.toUpperCase()}`];
    apiPost(baseUrl, formData).then(response => {
      setData({...data, records: [response, ...data.records]})
      form.reset()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
      setKey(key + 1)
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
    const baseUrl = URLS[`RECORD_${data.tipologia.toUpperCase()}`];
    apiUpdate(baseUrl + initialData.id + '/', formData).then(response => {
      const records = data.records.map(record => {
        if (record.id === response.id) return response
        return record
      })
      setData({...data, records: records})
      form.reset()
      onSuccess();
      if (form.querySelector('.list-group-item')) {
        form.querySelector('.list-group-item.active').classList.remove('active')
      }
      
    }).catch(err => {
      setError(err)
      setTimeout(() => setError(false), 1000 * 10)
      console.log(err);
    })
  }

  const addParametri = (formData) => {
    let record_parametri = []
    Object.keys(formData).forEach(key => {
      const ids = record_parametri.map(el => el.parametro)
      if (key.startsWith('aggiunte-')) {
        const parametroId = key.split('aggiunte-').at(-1)
        const idx = ids.indexOf(parametroId)
        if (idx !== -1) record_parametri[idx].aggiunte = formData[key]
        else record_parametri.push({parametro: parametroId, aggiunte: formData[key]})
        delete formData[key]
      } else if (key.startsWith('valore-')) {
        const parametroId = key.split('valore-').at(-1)
        const idx = ids.indexOf(parametroId)
        if (idx !== -1) record_parametri[idx].valore = formData[key]
        else record_parametri.push({parametro: parametroId, valore: formData[key]})
        delete formData[key]
      }
    })
    formData['record_parametri'] = record_parametri
    formData['record_parametri'].forEach((parametro, idx) => {
      Object.keys(parametro).forEach(key => {
        if (formData['record_parametri'][idx][key] === "") formData['record_parametri'][idx][key] = null
      })
    })
    return formData
  }
  return (
    <Form
      ref={formRef}
      noValidate
      validated={validated}
      onSubmit={handleForm}
      key={key}
    >
      {React.cloneElement(children, { errors: error })}
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
    </Form>
  );
}

export default FormWrapper;
