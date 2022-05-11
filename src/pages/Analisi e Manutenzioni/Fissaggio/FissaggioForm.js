import { Col, Row, Form, Stack } from "react-bootstrap";
import React from "react";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker } from "../../../utils";
import Input from "../../../components/form-components/Input";
import Checkbox from "../../../components/form-components/Checkbox";
import Select from "../../../components/form-components/Select";

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
      <Col xs={6} className="flex border-b-2 border-b-gray-500 pb-6">
        <Stack gap={2} className="text-right justify-center">
          <Checkbox
            label="Aggiunta eseguita:"
            name="aggiunto_fissaggio"
            labelCols={6}
            labelProps={{ className: "pr-6" }}
            inputProps={{ defaultChecked: true }}
          />
          <Input 
            label="pH:"
            name={`valore-${parametroID}`}
            labelCols={6}
            errors={errors}
            labelProps={{ className: "pr-6" }}
            inputProps={{
              step: "0.01",
              type: "number",
              required: true,
              className: "text-center w-2/3 m-auto",
            }}
          />
        </Stack>
      </Col>
    </Row>
  );
}

export default FissaggioForm;
