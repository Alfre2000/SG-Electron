import React, { useRef } from "react";
import { Card, Col, Row, Stack, Table } from "react-bootstrap";
import { apiGet } from "../../../api/api";
import Input from "../../../components/form-components/Input";
import SearchSelect from "../../../components/form-components/SearchSelect";
import Paginator from "../../../components/Pagination/Paginator";
import { URLS } from "../../../urls";
import { searchOptions } from "../../../utils";

function SelezioneLotto({ data, setData, setRecord }) {
  const formRef = useRef(null);
  const updateData = (extra) => {
    const formData = {
      ...Object.fromEntries(new FormData(formRef.current).entries()),
      ...extra,
    };
    formData.codice = formData.articolo
    const searchParams = new URLSearchParams(formData);
    apiGet(`${URLS.RECORD_LAVORAZIONI_SEARCH}?${searchParams.toString()}`).then(
      (res) => setData((prev) => ({ ...prev, records: res }))
    );
  };
  return (
    <>
      <Card className="mt-10">
        <Card.Header as="h6" className="font-semibold text-lg">
          Ricerca Lotto
        </Card.Header>
        <Card.Body className="px-5">
          <form ref={formRef}>
            <Row>
              <Col xs={6}>
                <Stack gap={2}>
                  <Input
                    name="n_lotto_super"
                    label="Lotto Super"
                    inputProps={{
                      onChange: () => updateData(),
                    }}
                  />
                  <Input
                    name="n_lotto_cliente"
                    label="Lotto Cliente"
                    inputProps={{
                      onChange: () => updateData(),
                    }}
                  />
                  <Input
                    name="articolo"
                    inputProps={{
                      onChange: () => updateData(),
                    }}
                  />
                </Stack>
              </Col>
              <Col xs={6} className="my-auto">
                <Stack gap={2}>
                  <SearchSelect
                    name="cliente"
                    options={searchOptions(data?.clienti, "nome")}
                    inputProps={{
                      onChange: (e) => updateData({ cliente: e?.value || "" }),
                    }}
                  />
                  <SearchSelect
                    name="impianto"
                    options={searchOptions(data?.impianti, "nome")}
                    inputProps={{
                      onChange: (e) => updateData({ impianto: e?.value || "" }),
                    }}
                  />
                </Stack>
              </Col>
            </Row>
          </form>
        </Card.Body>
      </Card>
      <Table bordered hover className="mt-10 align-middle">
        <thead>
          <tr>
            <th>Data</th>
            <th>Lotto Super</th>
            <th>Lotto Cliente</th>
            <th>Articolo</th>
            <th>Cliente</th>
            <th>Impianto</th>
          </tr>
        </thead>
        <tbody className="hover:cursor-pointer text-sm">
          {data?.records?.results?.length === 0 ? (
            <tr>
              <td colSpan={6}>
                Non è presente nessun lotto con le caratteristiche selezionate.
              </td>
            </tr>
          ) : (
            data?.records?.results?.map((record) => {
              const options = {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              };
              const date = new Date(record.data).toLocaleString(
                "default",
                options
              );
              return (
                <tr key={record.id} onClick={() => setRecord(record) || document.getElementById("page").scrollTo(0,0)}>
                  <td>{date}</td>
                  <td>{record.n_lotto_super || "-"}</td>
                  <td>{record.n_lotto_cliente || "-"}</td>
                  <td>{record.articolo}</td>
                  <td>{record.cliente}</td>
                  <td>{record.impianto}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
      <Paginator
        data={data.records}
        setData={(newData) => setData({ ...data, records: newData })}
      />
    </>
  );
}

export default SelezioneLotto;
