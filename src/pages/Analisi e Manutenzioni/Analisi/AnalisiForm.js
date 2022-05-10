import React, { useState } from "react";
import { Col, Row, Form, Stack, Table } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker, dateToTimePicker } from "../../../utils";

function AnalisiForm({ data, initialData, errors }) {
  const [searchParams,] = useSearchParams();
  const startAnalisi = initialData ? initialData.operazione : searchParams.get('analisi') ? searchParams.get('analisi') : ""
  const [analisi, setAnalisi] = useState(startAnalisi)
  const getParametri = (analisiID) => {
    return data.operazioni.filter(el => el.id === analisiID)[0].parametri
  }
  return (
    <>
      <Row className="mb-4">
        <Col xs={6} className="flex pr-12 border-r-2 border-r-gray-500">
          <Stack gap={2} className="text-left justify-center">
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
          </Stack>
        </Col>
        <Col xs={6} className="pl-10">
          <Stack gap={2} className="text-left">
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
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Analisi:
              </Form.Label>
              <Col sm="8">
                <Form.Select
                  required
                  disabled={!!initialData}
                  size="sm"
                  className="text-center"
                  name="operazione"
                  value={analisi}
                  onChange={(e) => setAnalisi(e.target.value)}
                >
                  <option value=""></option>
                  {data.operazioni &&
                    data.operazioni.map((analisi) => (
                      <option key={analisi.id} value={analisi.id}>
                        {analisi.nome}
                      </option>
                    ))}
                </Form.Select>
              </Col>
            </Form.Group>
          </Stack>
        </Col>
      </Row>
      {analisi && (
        <Row className="mb-4">
          <Table>
            <thead>
              <tr className="text-center">
                <th>Parametro</th>
                <th>Valore</th>
                <th>Aggiunte</th>
                <th>Limite minimo</th>
                <th>Limite massimo</th>
              </tr>
            </thead>
            <tbody>
              {data.operazioni &&
                getParametri(analisi).map((parametro, idx) => (
                  <tr key={parametro.id} className="align-middle text-center">
                    <td className="text-left">{parametro.nome}</td>
                    <td>
                      <Form.Control
                        type="number"
                        step="0.01"
                        size="sm"
                        className="w-2/3 m-auto text-center"
                        name={`valore-${parametro.id}`}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        step="0.01"
                        size="sm"
                        className="w-2/3 m-auto text-center"
                        name={`aggiunte-${parametro.id}`}
                      />
                    </td>
                    <td>{parametro.minimo}</td>
                    <td>{parametro.massimo}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Row>
      )}
      <Row className="mb-4">
        <Col xs={9}>
          <Form.Group>
            <Row>
              <Col xs={2} className="flex items-center">
                <Form.Label>Note:</Form.Label>
              </Col>
              <Col sm={10}>
                <Form.Control as="textarea" rows={3} name="note" />
              </Col>
            </Row>
          </Form.Group>
        </Col>
        <Col xs={3} className="flex">
          <Form.Group className="m-auto text-center">
            <Form.Label>Controanalisi:</Form.Label>
            <Form.Check type="checkbox" className="" name="contro_analisi" defaultChecked={initialData ? initialData.contro_analisi : true} />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default AnalisiForm;
