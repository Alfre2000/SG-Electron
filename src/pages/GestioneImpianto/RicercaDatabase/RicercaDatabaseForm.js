import React, { useRef } from "react";
import { Col, Row, Form } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import { dateToDatePicker, searchOptions } from "../../../utils";
import { URLS } from "../../../urls";
import SearchSelect from "../../../components/form-components/SearchSelect";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import { usePageContext } from "../../../contexts/PageContext";

function RicercaDatabaseForm() {
  const { filters, setFilters } = usePageContext();

  const operatoriQuery = useImpiantoQuery({ queryKey: URLS.OPERATORI });
  const operazioniQuery = useImpiantoQuery({ queryKey: URLS.OPERAZIONI_DEEP });

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
    setFilters((prev)=> ({
      ...prev,
      filters: {...prev.filters, inizio: newDate, fine: dateToDatePicker(new Date())},
    }));
  };
  return (
    <form ref={formRef}>
      <Row>
        <Col xs={4}>
          <Input
            name="inizio"
            vertical={true}
            inputProps={{
              value: filters.filters.inizio,
              onChange: (e) => {
                setFilters((prev) => ({...prev, filters: {...prev.filters, inizio: e.target.value }}));
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
              value: filters.filters.fine,
              onChange: (e) => {
                setFilters((prev) => ({...prev, filters: {...prev.filters, fine: e.target.value }}));
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
            options={searchOptions(operatoriQuery.data, "nome")}
            inputProps={{
              onChange: (e) =>
                setFilters((prev) => ({...prev, filters: {...prev.filters, operatore: e?.value || "" }}))
            }}
          />
        </Col>
        <Col xs={5}>
          <Form.Label>Operazione:</Form.Label>
          <SearchSelect
            label={false}
            name="operazione"
            options={searchOptions(operazioniQuery.data, "nome")}
            inputProps={{
              onChange: (e) =>
                setFilters((prev) => ({...prev, filters: {...prev.filters, operazione: e?.value || "" }}))
            }}
          />
        </Col>
        <Col xs={1}></Col>
      </Row>
    </form>
  );
}

export default RicercaDatabaseForm;
