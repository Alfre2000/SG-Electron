import React, { useState } from "react";
import { Col, Row, Form, Stack, ListGroup } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Input from "../../../components/form-components/Input";
import Select from "../../../components/form-components/Select";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker } from "../../../utils";

function OssidoForm({ data, initialData, errors }) {
  const [searchParams,] = useSearchParams();
  const startManutenzione = initialData ? initialData.operazione : searchParams.get('manutenzione') ? searchParams.get('manutenzione') : ""
  const [operazione, setOperazione] = useState(startManutenzione)
  return (
    <Row className="mb-4 justify-between">
      <Col
        xs={6}
        className="flex pr-12 border-r-2 border-r-gray-500 border-b-2 border-b-gray-500 pb-6"
      >
        <Stack gap={2} className="text-left">
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
      <Col xs={6} className="px-10 border-b-2 border-b-gray-500 pb-6">
        <ListGroup className="cursor-pointer">
            {data.operazioni &&
              data.operazioni.map((el) => (
                <ListGroup.Item
                  active={operazione === el.id}
                  onClick={() => {
                    if (operazione === el.id) setOperazione(null);
                    else setOperazione(el.id);
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
  );
}

export default OssidoForm;
