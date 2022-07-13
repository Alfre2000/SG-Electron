import React, { useRef, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import { dateToDatePicker, searchOptions } from "../../../utils";
import { URLS } from "../../../urls";
import { apiGet } from "../../../api/api";
import { useUserContext } from "../../../UserContext";
import SearchSelect from "../../../components/form-components/SearchSelect";

function RicercaDatabaseForm({ data, setData }) {
  const { user } = useUserContext();
  const [inizio, setInizio] = useState("");
  const [fine, setFine] = useState(dateToDatePicker(new Date()));
  const formRef = useRef(null);
  const handleHelpChange = (e) => {
    let timeframe;
    if (e.value === "week") timeframe = 7;
    else if (e.value === "month") timeframe = 31;
    else if (e.value === "year") timeframe = 365;
    else return;
    const newDate = dateToDatePicker(
      new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
    );
    setInizio(newDate);
    setFine(dateToDatePicker(new Date()));
    sendForm({ inizio: newDate, fine: dateToDatePicker(new Date()) });
  };
  const sendForm = (moreData = {}) => {
    const impianto = user.user.impianto.id;
    const formData = {
      ...Object.fromEntries(new FormData(formRef.current).entries()),
      ...moreData,
      impianto: impianto,
    };
    const searchParams = new URLSearchParams(formData);
    apiGet(`${URLS.PAGINA_RICERCA_DATABASE}?${searchParams.toString()}`).then(
      (res) => setData((prev) => ({ ...prev, records: res }))
    );
  };
  return (
    <form ref={formRef}>
      <Row>
        <Col xs={4}>
          <Input
            name="inizio"
            vertical={true}
            inputProps={{
              value: inizio,
              onChange: (e) => {
                setInizio(e.target.value);
                sendForm();
              },
              type: "date",
            }}
          />
        </Col>
        <Col xs={4}>
          <Input
            name="fine"
            vertical={true}
            inputProps={{
              type: "date",
              value: fine,
              onChange: (e) => {
                setFine(e.target.value);
                sendForm();
              },
            }}
          />
        </Col>
        <Col xs={4}>
          <Form.Label>Help:</Form.Label>
          <SearchSelect
            label={false}
            options={[
              { value: "week", label: "Ultima Settimana" },
              { value: "month", label: "Ultimo Mese" },
              { value: "year", label: "Ultimo Anno" },
            ]}
            inputProps={{
              onChange: (e) => {
                handleHelpChange(e);
              },
            }}
          />
        </Col>
      </Row>
      <Row className="my-8">
        <Col xs={1}></Col>
        <Col xs={5}>
          <Form.Label>Operatore:</Form.Label>
          <SearchSelect
            label={false}
            name="operatore"
            options={searchOptions(data?.operatori, "nome")}
            inputProps={{
              onChange: (e) => sendForm({ operatore: e?.value || "" }),
            }}
          />
        </Col>
        <Col xs={5}>
          <Form.Label>Operazione:</Form.Label>
          <SearchSelect
            label={false}
            name="operazione"
            options={searchOptions(data?.operazioni, "nome")}
            inputProps={{
              onChange: (e) => sendForm({ operazione: e?.value || "" }),
            }}
          />
        </Col>
        <Col xs={1}></Col>
      </Row>
    </form>
  );
}

export default RicercaDatabaseForm;
