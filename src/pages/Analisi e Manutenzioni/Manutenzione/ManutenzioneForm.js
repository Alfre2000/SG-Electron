import React, { useEffect, useRef, useState } from "react";
import { Col, Row, Form, ListGroup } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Input from "../../../components/form-components/Input";
import Select from "../../../components/form-components/Select";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { dateToDatePicker } from "../../../utils";

function ManutenzioneForm({ data, initialData, errors, view }) {
  const [searchParams,] = useSearchParams();
  const startManutenzione = initialData?.operazione || searchParams.get('manutenzione') || ""
  const [manutenzione, setManutenzione] = useState(startManutenzione)
  // Fai si che la manutenzione selezionata sia visibile
  const listGroupRef = useRef(null)
  useEffect(() => {
    if (!data.operazioni || !startManutenzione) return;
    const index = data.operazioni.findIndex(op => op.id === startManutenzione)
    const height = listGroupRef.current.querySelector('div').offsetHeight
    listGroupRef.current.parentElement.scrollTo(0, height * (index - 3))
  }, [startManutenzione, data.operazioni])
  return (
    <>
      <Row>
        <Col xs={4}>
          <Input 
            name="data"
            errors={errors}
            vertical={true}
            inputProps={{
              type: "date",
              defaultValue: dateToDatePicker(
                initialData?.data ? new Date(initialData.data) : new Date()
              )
            }}
          />
        </Col>
        <Col xs={4}>
          <Form.Group className="text-center">
            <Form.Label>Ora:</Form.Label>
              <TimeInput initialData={initialData} />
          </Form.Group>
        </Col>
        <Col xs={4}>
          <Select
            name="operatore"
            labelCols={4}
            inputProps={{ required: true }}
            data={data?.operatori?.map(o => [o.id, o.nome])}
            vertical={true}
          />
        </Col>
      </Row>
      <Row className="my-8">
        <Col xs={4} className="flex justify-center items-center">
          <Form.Label>Manutenzione effettuata:</Form.Label>
        </Col>
        <Col xs={8} className="max-h-[310px] overflow-scroll">
          <ListGroup className={view ? "" : "cursor-pointer"} ref={listGroupRef}>
            {data.operazioni &&
              data.operazioni.map((el) => (
                <ListGroup.Item
                  active={manutenzione === el.id}
                  onClick={() => {
                    if (view) return;
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
