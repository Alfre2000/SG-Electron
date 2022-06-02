import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Row, Form, Stack } from "react-bootstrap";
import Checkbox from "../../../components/form-components/Checkbox";
import Input from "../../../components/form-components/Input";
import Select from "../../../components/form-components/Select";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker } from "../../../utils";


function SchedaControlloForm({ data, initialData, errors }) {
  const [materiale, setMateriale] = useState(initialData ? initialData['dati_aggiuntivi.n_difetti_materiale'] : 0)
  const [sporco, setSporco] = useState(initialData ? initialData['dati_aggiuntivi.n_difetti_sporco'] : 0)
  const [meccanici, setMeccanici] = useState(initialData ? initialData['dati_aggiuntivi.n_difetti_meccanici'] : 0)
  const [trattamento, setTrattamento] = useState(initialData ? initialData['dati_aggiuntivi.n_difetti_trattamento'] : 0)
  const [altro, setAltro] = useState(initialData ? initialData['dati_aggiuntivi.n_difetti_altro'] : 0)

  const [errValore, setErrValore] = useState({})

  const valvoleScarto = +materiale + +sporco + +meccanici + +trattamento + +altro
  const handleValoreChange = (e) => {
    if (e.target.name === 'dati_aggiuntivi.spessore_deviazione') return;
    const name = e.target.name.includes('spessore') ? 'spessore_ossido' : e.target.name.split('.').at(-1)
    const minimo = data.scheda_controllo[`${name}_minimo`]
    const massimo = data.scheda_controllo[`${name}_massimo`]
    const value = parseFloat(e.target.value)
    if (value > massimo) {
      setErrValore({...errValore, [e.target.name]: `Valore oltre il massimo di ${massimo} !`})
    } else if (value < minimo) {
      setErrValore({...errValore, [e.target.name]: `Valore sotto il minimo di ${minimo} !`})
    } else {
      setErrValore({...errValore, [e.target.name]: ""})
    }
  }
  return (
    <>
      <Row className="mb-4 justify-between">
        <Col
          xs={6}
          className="pr-20 pb-3 border-b-2 border-b-gray-500 border-r-2 border-r-gray-500"
        >
          <Stack gap={1} className="text-left">
            <Input 
              name="data"
              errors={errors}
              inputProps={{
                type: "date",
                defaultValue: dateToDatePicker(
                  initialData?.data ? new Date(initialData.data) : new Date()
                )
              }}
            />
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Ora:
              </Form.Label>
              <Col sm="8">
                <TimeInput initialData={initialData} />
              </Col>
            </Form.Group>
            <Select 
              name="operatore"
              inputProps={{ required: true }}
              data={data?.operatori?.map(o => [o.id, o.nome])}
            />
          </Stack>
        </Col>
        <Col xs={6} className="pb-3 border-b-2 border-b-gray-500">
          <Stack gap={1} className="text-right">
            <Select 
              label="Modello:"
              labelCols={6}
              name="articolo"
              labelProps={{ className: "pr-6" }}
              inputProps={{ required: true }}
              data={data?.articoli && data?.articoli?.map(o => [o.id, o.nome])}
            />
            <Input 
              label="Numero Lotto:"
              name="lotto"
              errors={errors}
              labelCols={6}
              labelProps={{ className: "pr-6" }}
              inputProps={{ required: true }}
            />
            <Checkbox 
              label="Idoneità al trattamento:"
              name="dati_aggiuntivi.idoneità"
              labelCols={6}
              labelProps={{ className: "pr-6" }}
              inputProps={{ 
                defaultChecked: initialData ? initialData['idoneità'] : true,
                className: "text-left mt-2"
              }}
            />
          </Stack>
        </Col>
      </Row>
      <Row className="mb-3 text-left">
        <Col xs={5}>
          <Input 
            label="Valvole dichiarate:"
            name="n_pezzi_dichiarati"
            errors={errors}
            labelCols={5}
            labelProps={{ className: "pr-0" }}
            inputProps={{ 
              type: "number",
              required: true,
              className: "text-center w-4/5 ml-auto"
            }}
          />
        </Col>
        <Col xs={1}></Col>
        <Col xs={6}>
          <Input 
            label="Valvole conformi:"
            name="dati_aggiuntivi.n_pezzi_conformi"
            errors={errors}
            labelCols={5}
            labelProps={{ className: "pr-0" }}
            inputProps={{ 
              type: "number",
              required: true,
              className: "w-[64%] text-center mx-auto"
            }}
            colProps={{ className: "pr-14" }}
          />
        </Col>
      </Row>
      <Row className="mb-4 border-b-2 border-b-gray-500 flex-nowrap">
        <Col
          xs={5}
          className="py-6 mt-2 border-t-2 border-t-gray-500 border-r-2 border-r-gray-500"
        >
          <Stack gap={1} className="text-left">
            {['verifiche_preliminari', 'pulizia', 'filetto_m6', 'accantonato_campione', 'master'].map(name => (
              <Checkbox 
                key={name}
                name={'dati_aggiuntivi.' + name}
                initialData={initialData}
                labelCols={7}
                inputProps={{ className: "text-left mt-2 pl-12" }}
              />
            ))}
          </Stack>
        </Col>
        <Col xs={1}></Col>
        <Col xs={6} className="flex h-fit">
          <Stack gap={1} className="text-left">
            <Form.Group as={Row}>
              <Form.Label column sm="6">
                Valvole scarto:
              </Form.Label>
              <Col sm="4">
                <Form.Control
                  type="number"
                  disabled
                  size="sm"
                  className="text-center"
                  value={valvoleScarto}
                />
              </Col>
              <Col xs={2}>
                <hr className="mt-3 -ml-4" />
                <hr className="-ml-4 w-2 rotate-45 relative top-[2px]" />
                <hr className="-ml-4 w-2 -rotate-45 relative top-[-5px]" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6">
                Difetti del materiale:
              </Form.Label>
              <Col sm="4">
                <Form.Control
                  type="number"
                  size="sm"
                  name="dati_aggiuntivi.n_difetti_materiale"
                  className="text-center"
                  value={materiale}
                  onChange={(e) => setMateriale(e.target.value)}
                />
              </Col>
              <Col xs={2}>
                <hr className="mt-3 -ml-4" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6">
                Difetti da sporco:
              </Form.Label>
              <Col sm="4">
                <Form.Control
                  type="number"
                  size="sm"
                  name="dati_aggiuntivi.n_difetti_sporco"
                  className="text-center"
                  value={sporco}
                  onChange={(e) => setSporco(e.target.value)}
                />
              </Col>
              <Col xs={2}>
                <hr className="mt-3 -ml-4" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6">
                Difetti meccanici:
              </Form.Label>
              <Col sm="4">
                <Form.Control
                  type="number"
                  size="sm"
                  name="dati_aggiuntivi.n_difetti_meccanici"
                  className="text-center"
                  value={meccanici}
                  onChange={(e) => setMeccanici(e.target.value)}
                />
              </Col>
              <Col xs={2}>
                <hr className="mt-3 -ml-4" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6">
                Difetti del trattamento:
              </Form.Label>
              <Col sm="4">
                <Form.Control
                  type="number"
                  size="sm"
                  name="dati_aggiuntivi.n_difetti_trattamento"
                  className="text-center"
                  value={trattamento}
                  onChange={(e) => setTrattamento(e.target.value)}
                />
              </Col>
              <Col xs={2}>
                <hr className="mt-3 -ml-4" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6">
                Difetti altri:
              </Form.Label>
              <Col sm="4">
                <Form.Control
                  type="number"
                  size="sm"
                  name="dati_aggiuntivi.n_difetti_altro"
                  className="text-center"
                  value={altro}
                  onChange={(e) => setAltro(e.target.value)}
                />
              </Col>
              <Col xs={2}>
                <hr className="mt-3 -ml-4" />
              </Col>
            </Form.Group>
          </Stack>
          <div className="w-[1px] mb-[1.3rem] mt-[1rem] bg-[#c8c9ca]"></div>
        </Col>
      </Row>
      <Row className="pb-4 mb-3 -mt-1 border-b-2 border-b-gray-500">
        {['dati_aggiuntivi.spessore_ossido', 'dati_aggiuntivi.spessore_minimo', 'dati_aggiuntivi.spessore_massimo', 'dati_aggiuntivi.spessore_deviazione'].map(name => (
          <Col xs={3} key={name} className="text-center">
            <Input
              name={name}
              vertical={true}
              inputProps={{
                className: "w-3/4 m-auto text-center",
                step: "0.01",
                type: "number",
                onBlur: handleValoreChange,
              }}
            />
            {errValore[name] && (
              <span type="invalid" className="text-xs font-semibold text-center text-[#d48208]">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" /> 
                  {errValore[name]}
              </span>
            )}
          </Col>  
        ))}
      </Row>
      <Row className="pb-4 mb-4 border-b-2 border-b-gray-500">
        {['dati_aggiuntivi.temperatura_soda', 'dati_aggiuntivi.temperatura_ossido', 'dati_aggiuntivi.temperatura_colore', 'dati_aggiuntivi.temperatura_fissaggio'].map(name => (
          <Col xs={3} key={name} className="text-center">
            <Input
              name={name}
              vertical={true}
              inputProps={{
                className: "w-3/4 m-auto text-center",
                step: "0.01",
                type: "number",
                onBlur: handleValoreChange,
              }}
            />
            {errValore[name] && (
              <span type="invalid" className="text-xs font-semibold text-center text-[#d48208]">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" /> 
                  {errValore[name]}
              </span>
            )}
          </Col>  
        ))}
      </Row>
      <Form.Group>
        <Row className="mb-4">
          <Col xs={1} className="flex items-center">
            <Form.Label>Note:</Form.Label>
          </Col>
          <Col sm={11}>
            <Form.Control as="textarea" rows={3} name="note" />
          </Col>
        </Row>
      </Form.Group>
    </>
  );
}

export default SchedaControlloForm;
