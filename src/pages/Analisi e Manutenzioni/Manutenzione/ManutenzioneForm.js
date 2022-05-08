import React, { useState } from "react";
import { Col, Row, Form, ListGroup } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, dateToTimePicker } from "../../../utils";

function ManutenzioneForm({ data, initialData }) {
  const [searchParams,] = useSearchParams();
  const startManutenzione = initialData ? initialData.operazione : searchParams.get('manutenzione') ? searchParams.get('manutenzione') : ""
  const [manutenzione, setManutenzione] = useState(startManutenzione)
  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Group className="text-center">
            <Form.Label>Data:</Form.Label>
            <Form.Control
              size="sm"
              className="text-center"
              type="date"
              defaultValue={dateToDatePicker(
                initialData?.data ? new Date(initialData.data) : new Date()
              )}
              name="data"
            />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="text-center">
            <Form.Label>Ora:</Form.Label>
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
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Form.Group className="text-center">
            <Form.Label>Operatore:</Form.Label>
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
          </Form.Group>
        </Col>
      </Row>
      <Row className="my-8">
        <Col xs={4} className="flex justify-center items-center">
          <Form.Label>Manutenzione effettuata:</Form.Label>
        </Col>
        <Col xs={8} className="max-h-[310px] overflow-scroll">
          <ListGroup className="cursor-pointer">
            {data.operazioni &&
              data.operazioni.map((el) => (
                <ListGroup.Item
                  active={manutenzione === el.id}
                  onClick={() => {
                    if (manutenzione === el.id) setManutenzione(null);
                    else setManutenzione(el.id);
                  }}
                  key={el.id}
                  value={el.id}
                >
                  {el.nome}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default ManutenzioneForm;
