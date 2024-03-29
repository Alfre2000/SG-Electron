import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import ReactForm from "react-bootstrap/Form";
import { apiUpdate } from "../api/api";
import { apiPost } from "../api/apiV2";
import FormContext from "../contexts/FormContext";
import { focusErrorInput, parseFormData } from "./utils";
import useImpiantoMutation from "../hooks/useImpiantoMutation/useImpiantoMutation";
import { usePageContext } from "../contexts/PageContext";
import { toast } from "sonner";

function Form({ children = undefined, initialData, onSuccess = undefined, view = false, validator = undefined, componentProps = undefined, forceNoCopy = false }) {
  const { FormComponent, FormComponentFn, postURL, copyData, setCopyData, queriesToInvalidate } = usePageContext();

  initialData = initialData || copyData
  const finalURL = typeof postURL === "function" ? postURL(initialData) : postURL
  let endpoint = finalURL.split('?')[0]
  if (!endpoint.endsWith('/')) endpoint += '/'

  const FormComponentFinal = FormComponentFn ? FormComponentFn(initialData) : FormComponent

  const staticForm = Boolean(view)
  const formRef = useRef(null);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(1)

  const onError = (error, form) => {
    setError(error)
    setTimeout(() => setError(false), 1000 * 10)
    focusErrorInput(form, error)
    toast.error('Si è verificato un errore !')
  }

  const createMutation = useImpiantoMutation(({ formData, form }) => apiPost(endpoint, formData), {
    onSuccess: (response, variables, { queryClient, impianto }) => {
      queryClient.invalidateQueries([finalURL])
      queriesToInvalidate.forEach(query => queryClient.invalidateQueries(query))
      if (onSuccess) onSuccess(response, queryClient)
      setKey(key + 1)
      setCopyData(undefined)
      toast.success('Record creato con successo !')
      if (document.querySelector('.paginator-first a')) {
        document.querySelector('.paginator-first a').click()
      }
    },
    onError: (error, { form }) => onError(error, form)
  })

  const updateMutation = useImpiantoMutation(({ formData, form }) => apiUpdate(endpoint + initialData.id + '/', formData), {
    onSuccess: (response, variables, { queryClient, impianto }) => {
      queryClient.invalidateQueries([finalURL])
      queriesToInvalidate.forEach(query => queryClient.invalidateQueries(query))
      if (onSuccess) onSuccess(response, queryClient)
      setKey(key + 1)
      setCopyData(undefined)
    },
    onError: (error, { form }) => onError(error, form)
  })

  // Funzione che gestisce la validazione del form
  const handleForm = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (["plus-icon", "minus-icon"].includes(document.activeElement.classList[0])) return;
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
    if (initialData && (!copyData || forceNoCopy)) {
      updateMutation.mutate({ formData: finalFormData, form })
    } else {
      createMutation.mutate({ formData: finalFormData, form })
    }
  };

  useEffect(() => {
    setKey((prev) => prev + 1)
  }
  , [initialData])

  return (
    <FormContext initialData={initialData} errors={error} view={view}>
      <ReactForm
      ref={formRef}
      noValidate
      onSubmit={handleForm}
      key={key}
      className={initialData === undefined ? "create-form" : "update-form"}
      >
        {children ? (
          React.cloneElement(children)
          ) : (
          <FormComponentFinal {...componentProps} />
        )}
      {!staticForm && (
        <Row className="mb-2 items-center">
          <Col sx={4}></Col>
          <Col sx={4} className="text-center">
            <Button type="submit" className="bg-[#0d6efd] w-28 font-medium">
            Salva
            </Button>
          </Col>
          <Col sx={4}>
          </Col>
        </Row>
      )}
      </ReactForm>
    </FormContext>
  );
}

export default Form;
