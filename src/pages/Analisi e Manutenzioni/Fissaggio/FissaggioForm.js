import { Col, Row, Form, Stack } from "react-bootstrap";
import React from "react";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, dateToTimePicker } from "../../../utils";

function FissaggioForm({ data, initialData, errors }) {
  const parametroID = data.operazioni ? data.operazioni[0].parametri[0].id : ""
  const operazioneID = data.operazioni ? data.operazioni[0].id : ""
  return (
    <Row className="mb-4 justify-between">
      <Col
        xs={6}
        className="pr-12 border-r-2 border-r-gray-500 border-b-2 border-b-gray-500 pb-6"
      >
        <Stack gap={2} className="text-left">
          <Form.Control defaultValue={operazioneID} name="operazione" hidden/>
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
      <Col xs={6} className="flex border-b-2 border-b-gray-500 pb-6">
        <Stack gap={2} className="text-right justify-center">
          <Form.Group as={Row}>
            <Form.Label column sm="6" className="pr-6">
              Aggiunta eseguita:
            </Form.Label>
            <Col sm="6">
              <Form.Check
                type="checkbox"
                className="text-center mt-2"
                name="aggiunto_fissaggio"
                defaultChecked={true}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="6" className="pr-6">
              pH:
            </Form.Label>
            <Col sm="6">
              <Form.Control
                type="number"
                required
                step="0.01"
                size="sm"
                name={`valore-${parametroID}`}
                className="text-center w-2/3 m-auto"
              />
              {/* <Form.Control.Feedback type="invalid" className="text-xs text-center">
                Please choose a username.
              </Form.Control.Feedback> */}
            </Col>
          </Form.Group>
        </Stack>
      </Col>
    </Row>
  );
}

export default FissaggioForm;
