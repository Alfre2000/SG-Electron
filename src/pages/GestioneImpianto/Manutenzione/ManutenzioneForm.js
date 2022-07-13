import React from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import DateInput from "../../../components/form-components/DateInput/DateInput";
import ListGroupInput from "../../../components/form-components/ListGroupInput/ListGroupInput";
import SearchSelect from "../../../components/form-components/SearchSelect";
import TimeInput from "../../../components/TimeInput/TimeInput";
import { useFormContext } from "../../../contexts/FormContext";
import { searchOptions } from "../../../utils";

function ManutenzioneForm({ data }) {
  const { initialData } = useFormContext();
  const [searchParams] = useSearchParams();
  const startManutenzione =
    initialData?.operazione || searchParams.get("manutenzione") || "";
  return (
    <>
      <Row>
        <Col xs={4}>
          <DateInput vertical={true} />
        </Col>
        <Col xs={4}>
          <TimeInput vertical={true} />
        </Col>
        <Col xs={4} className="text-center">
          <Form.Label>Operatore:</Form.Label>
          <SearchSelect
            label={false}
            name="operatore"
            options={searchOptions(data?.operatori, "nome")}
          />
        </Col>
      </Row>
      <Row className="my-8">
        <Col xs={4} className="flex justify-center items-center">
          <Form.Label>Manutenzione effettuata:</Form.Label>
        </Col>
        <Col xs={8} className="max-h-[310px] overflow-scroll">
          <ListGroupInput
            options={searchOptions(data?.operazioni, "nome")}
            defaultValue={startManutenzione}
            name="operazione"
          />
        </Col>
      </Row>
    </>
  );
}

export default ManutenzioneForm;
