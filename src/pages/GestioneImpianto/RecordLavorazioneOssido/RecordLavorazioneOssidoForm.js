import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Col, Row, Form, Stack } from "react-bootstrap";
import Checkbox from "../../../components/form-components/Checkbox";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import Hidden from "../../../components/form-components/Hidden/Hidden";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import TimeInput from "../../../components/TimeInput/TimeInput";
import UserContext from "../../../UserContext";
import { searchOptions } from "../../../utils";

function RecordLavorazioneOssidoForm({ data, initialData }) {
  const { user: { user: { impianto } } } = useContext(UserContext);
  const [materiale, setMateriale] = useState(initialData?.dati_aggiuntivi?.n_difetti_materiale || 0)
  const [sporco, setSporco] = useState(initialData?.dati_aggiuntivi?.n_difetti_sporco || 0)
  const [meccanici, setMeccanici] = useState(initialData?.dati_aggiuntivi?.n_difetti_meccanici || 0)
  const [trattamento, setTrattamento] = useState(initialData?.dati_aggiuntivi?.n_difetti_trattamento || 0)
  const [altro, setAltro] = useState(initialData?.dati_aggiuntivi?.n_difetti_altro || 0)
  

  const [errValore, setErrValore] = useState({})
  const valvoleScarto = +materiale + +sporco + +meccanici + +trattamento + +altro
  const handleValoreChange = (e) => {
    if (e.target.name === 'dati_aggiuntivi__spessore_deviazione') return;
    const name = e.target.name.includes('spessore') ? 'spessore_ossido' : e.target.name.split('__').at(-1)
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
            <DateInput />
            <TimeInput />
            <SearchSelect 
              name="operatore"
              options={searchOptions(data?.operatori, "nome")}
            />
          </Stack>
        </Col>
        <Col xs={6} className="pb-3 border-b-2 border-b-gray-500">
          <Stack gap={1} className="text-right">
            <SearchSelect 
              label="Modello:"
              labelCols={6}
              name="articolo"
              labelProps={{ className: "pr-6" }}
              options={data?.articoli && data?.articoli?.map(o => ({ value: o.id, label: `${o.nome} (${o.codice})`}))}
            />
            <Input 
              label="Numero Lotto:"
              name="n_lotto_cliente"
              labelCols={6}
              labelProps={{ className: "pr-6" }}
            />
            <Checkbox 
              label="Idoneità al trattamento:"
              name="dati_aggiuntivi__idoneità"
              labelCols={6}
              labelProps={{ className: "pr-6" }}
              inputProps={{ 
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
            labelCols={5}
            labelProps={{ className: "pr-0" }}
            inputProps={{ 
              type: "number",
              className: "text-center w-4/5 ml-auto"
            }}
          />
        </Col>
        <Col xs={1}></Col>
        <Col xs={6}>
          <Input 
            label="Valvole conformi:"
            name="dati_aggiuntivi__n_pezzi_conformi"
            labelCols={5}
            labelProps={{ className: "pr-0" }}
            inputProps={{ 
              type: "number",
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
                name={`dati_aggiuntivi__${name}`}
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
                <Input
                  label={false}
                  inputProps={{
                    type: "number",
                    className: "text-center",
                    disabled: true,
                    value: valvoleScarto,
                    readOnly: true
                  }}
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
                <Input
                  label={false}
                  inputProps={{
                    name: "dati_aggiuntivi__n_difetti_materiale",
                    type: "number",
                    className: "text-center",
                    value: materiale,
                    onChange: (e) => setMateriale(e.target.value)
                  }}
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
                <Input
                  label={false}
                  inputProps={{
                    name: "dati_aggiuntivi__n_difetti_sporco",
                    type: "number",
                    className: "text-center",
                    value: sporco,
                    onChange: (e) => setSporco(e.target.value)
                  }}
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
                <Input
                  label={false}
                  inputProps={{
                    name: "dati_aggiuntivi__n_difetti_meccanici",
                    type: "number",
                    className: "text-center",
                    value: meccanici,
                    onChange: (e) => setMeccanici(e.target.value)
                  }}
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
                <Input
                  label={false}
                  inputProps={{
                    name: "dati_aggiuntivi__n_difetti_trattamento",
                    type: "number",
                    className: "text-center",
                    value: trattamento,
                    onChange: (e) => setTrattamento(e.target.value)
                  }}
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
                <Input
                  label={false}
                  inputProps={{
                    name: "dati_aggiuntivi__n_difetti_altro",
                    type: "number",
                    className: "text-center",
                    value: altro,
                    onChange: (e) => setAltro(e.target.value)
                  }}
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
        {['dati_aggiuntivi__spessore_ossido', 'dati_aggiuntivi__spessore_minimo', 'dati_aggiuntivi__spessore_massimo', 'dati_aggiuntivi__spessore_deviazione'].map(name => (
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
        {['dati_aggiuntivi__temperatura_soda', 'dati_aggiuntivi__temperatura_ossido', 'dati_aggiuntivi__temperatura_colore', 'dati_aggiuntivi__temperatura_fissaggio'].map(name => (
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
            <Input
              label={false}
              inputProps={{ as: "textarea", rows: 3, className: "text-left" }}
              name="note"
            />
          </Col>
        </Row>
      </Form.Group>
      <Hidden defaultValue={valvoleScarto} name="n_pezzi_scartati" />
      <Hidden defaultValue={true} name="completata" />
      <Hidden defaultValue={impianto?.id} name="impianto" />
    </>
  );
}

export default RecordLavorazioneOssidoForm;
