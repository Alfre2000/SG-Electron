import React, { useState } from "react";
import { Col, Row, Form, Stack } from "react-bootstrap";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, dateToTimePicker } from "../../../utils";


function SchedaControlloForm({ data, initialData }) {
  const [materiale, setMateriale] = useState(initialData?.n_difetti_materiale || 0)
  const [sporco, setSporco] = useState(initialData?.n_difetti_sporco || 0)
  const [meccanici, setMeccanici] = useState(initialData?.n_difetti_meccanici || 0)
  const [trattamento, setTrattamento] = useState(initialData?.n_difetti_trattamento || 0)
  const [altro, setAltro] = useState(initialData?.n_difetti_altro || 0)
  const valvoleScarto = +materiale + +sporco + +meccanici + +trattamento + +altro
  return (
    <>
      <Row className="mb-4 justify-between">
        <Col
          xs={6}
          className="pr-20 pb-7 border-b-2 border-b-gray-500 border-r-2 border-r-gray-500"
        >
          <Stack gap={2} className="text-left">
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Data:
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  size="sm"
                  className="text-center"
                  type="date"
                  defaultValue={dateToDatePicker(
                    initialData?.data ? new Date(initialData.data) : new Date()
                  )}
                  name="data"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Ora:
              </Form.Label>
              <Col sm="8">
              {initialData?.data ? (
                <Form.Control
                  size="sm"
                  className="text-center"
                  type="time"
                  name="ora"
                  defaultValue={dateToTimePicker(new Date(initialData.data))}
                />
              ) : (
                <TimeInput />
              )}
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Operatore:
              </Form.Label>
              <Col sm="8">
                <Form.Select
                  required
                  size="sm"
                  className="text-center"
                  name="operatore"
                >
                  <option value=""></option>
                  {data.operatori &&
                    data.operatori.map((operatore) => (
                      <option key={operatore.id} value={operatore.id}>
                        {operatore.nome}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Form.Group>
          </Stack>
        </Col>
        <Col xs={6} className="pb-7 border-b-2 border-b-gray-500">
          <Stack gap={2} className="text-right">
            <Form.Group as={Row}>
              <Form.Label column sm="6" className="pr-6">
                Modello:
              </Form.Label>
              <Col sm="6">
                <Form.Select
                  required
                  size="sm"
                  className="text-center"
                  name="articolo"
                >
                  <option value=""></option>
                  {data.articoli &&
                    data.articoli.map((articolo) => (
                      <option key={articolo.id} value={articolo.id}>
                        {articolo.nome}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6" className="pr-6">
                Numero Lotto:
              </Form.Label>
              <Col sm="6">
                <Form.Control
                  type="text"
                  required
                  size="sm"
                  name="lotto"
                  className="text-center"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="6" className="pr-6">
                Idoneità al trattamento:
              </Form.Label>
              <Col sm="6">
                <Form.Check
                  type="checkbox"
                  className="text-left mt-2"
                  name="idoneità"
                  defaultChecked={initialData ? initialData['idoneità'] : true}
                />
              </Col>
            </Form.Group>
          </Stack>
        </Col>
      </Row>
      <Row className="mb-3 text-left">
        <Col xs={6}>
          <Form.Group as={Row}>
            <Form.Label column sm="5" className="pr-0">
              Valvole dichiarate:
            </Form.Label>
            <Col sm="6" className="pr-10">
              <Form.Control
                type="number"
                size="sm"
                required
                name="n_pezzi_dichiarati"
                className="text-center"
              />
            </Col>
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group as={Row}>
            <Form.Label column sm="6" className="pr-0">
              Valvole conformi:
            </Form.Label>
            <Col sm="5" className="pr-14">
              <Form.Control
                type="number"
                size="sm"
                required
                name="n_pezzi_conformi"
                className="text-center"
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-4 border-b-2 border-b-gray-500 flex-nowrap">
        <Col
          xs={5}
          className="py-6 mt-2 border-t-2 border-t-gray-500 border-r-2 border-r-gray-500"
        >
          <Stack gap={2} className="text-left">
            <Form.Group as={Row}>
              <Form.Label column sm="7" className="pr-6">
                Verifiche Preliminari:
              </Form.Label>
              <Col sm="5">
                <Form.Check
                  type="checkbox"
                  className="text-left mt-2 pl-10"
                  name="verifiche_preliminari"
                  defaultChecked={initialData ? initialData['verifiche_preliminari'] : true}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="7" className="pr-6">
                Pulizia:
              </Form.Label>
              <Col sm="5">
                <Form.Check
                  type="checkbox"
                  className="text-left mt-2 pl-10"
                  name="pulizia"
                  defaultChecked={initialData ? initialData['pulizia'] : true}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="7" className="pr-6">
                Filetto M6:
              </Form.Label>
              <Col sm="5">
                <Form.Check
                  type="checkbox"
                  className="text-left mt-2 pl-10"
                  name="filetto_m6"
                  defaultChecked={initialData ? initialData['filetto_m6'] : true}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="7" className="pr-6">
                Accantonato campione:
              </Form.Label>
              <Col sm="5">
                <Form.Check
                  type="checkbox"
                  className="text-left mt-2 pl-10"
                  name="accantonato_campione"
                  defaultChecked={initialData ? initialData['accantonato_campione'] : true}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="7" className="pr-6">
                Master:
              </Form.Label>
              <Col sm="5">
                <Form.Check
                  type="checkbox"
                  className="text-left mt-2 pl-10"
                  name="master"
                  defaultChecked={initialData ? initialData['master'] : true}
                />
              </Col>
            </Form.Group>
          </Stack>
        </Col>
        <Col xs={1}></Col>
        <Col xs={6} className="flex h-fit">
          <Stack gap={2} className="text-left">
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
                  name="n_difetti_materiale"
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
                  name="n_difetti_sporco"
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
                  name="n_difetti_meccanici"
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
                  name="n_difetti_trattamento"
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
                  name="n_difetti_altro"
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
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Spessore ossido:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="spessore_ossido"
            />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Spessore minimo:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="spessore_minimo"
            />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Spessore massimo:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="spessore_massimo"
            />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Spessore deviazione:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="spessore_deviazione"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="pb-4 mb-4 border-b-2 border-b-gray-500">
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Temperatura soda:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="temperatura_soda"
            />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Temperatura ossido:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="temperatura_ossido"
            />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Temperatura colore:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="temperatura_colore"
            />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group>
            <Form.Label>Temperatura fissaggio:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              size="sm"
              className="w-3/4 m-auto text-center"
              name="temperatura_fissaggio"
            />
          </Form.Group>
        </Col>
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
