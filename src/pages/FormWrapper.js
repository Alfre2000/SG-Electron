import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { apiPost, apiUpdate } from "../api/utils";
import useSetViewForm from "../hooks/useSetViewForm";
import UserContext from "../UserContext";
import { dateToDatePicker } from "../utils";

function FormWrapper({ data, setData, initialData, onSuccess, url, children, view }) {
  const staticForm = Boolean(view)
  useSetViewForm(staticForm)
  const formRef = useRef(null);
  const [error, setError] = useState(false);
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [key, setKey] = useState(1)
  const { user } = useContext(UserContext)
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
      if (url.toLowerCase().includes('lavorazioni')) {
        formData['impianto'] = user.user.impianto.id
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
      if (key.includes('.')) {
        let [parent_obj, child_key] = key.split('.')
        if (formData[parent_obj] === undefined) formData[parent_obj] = {};
        formData[parent_obj][child_key] = formData[key]
        delete formData[key]
      }
    })
    if (url.toLowerCase().includes('lavorazione')) {
      formData['scheda_controllo'] = data.scheda_controllo.id
    }
    apiPost(url, formData).then(response => {
      response = url.toLowerCase().includes('lavorazione') ? parserSchedaControllo(response) : response
      setData({...data, records: {...data.records,  results:[response, ...data.records.results]}})
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
    Object.keys(formData).forEach(key => {
      if (key.includes('.')) {
        let [parent_obj, child_key] = key.split('.')
        if (formData[parent_obj] === undefined) formData[parent_obj] = {};
        formData[parent_obj][child_key] = formData[key]
        delete formData[key]
      }
    });
    [...form.elements].forEach(el => {
      if (el.type ===  'checkbox' && !el.checked) {
        formData[el.name] = "false"
      } else if (el.type !== 'text') {
        if (formData[el.name] === "") formData[el.name] = null
      }
    })
    apiUpdate(url + initialData.id + '/', formData).then(response => {
      const records = data.records.results.map(record => {
        if (record.id === response.id) {
          record = url.toLowerCase().includes('lavorazione') ? parserSchedaControllo(response) : response
          return record
        }
        return record
      })
      setData({...data, records: {...data.records, results: records}})
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
  const parserSchedaControllo = useCallback((record) => {
    for (const [key, value] of Object.entries(record.dati_aggiuntivi)) {
      record['dati_aggiuntivi.' + key] =  value
    }
    delete record.dati_aggiuntivi
    return record
  }, [])
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
