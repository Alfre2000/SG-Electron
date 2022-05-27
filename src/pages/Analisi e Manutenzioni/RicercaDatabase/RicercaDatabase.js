import React, { useRef, useState } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import Select from "../../../components/form-components/Select";
import { dateToDatePicker } from "../../../utils";
import Wrapper from "../subcomponents/Wrapper";
import { URLS } from "../../../urls";
import useUpdateData from "../../../hooks/useUpdateData";
import Tabella from "../subcomponents/Tabella";
import { apiGet } from "../../../api/utils";
import ManutenzioneForm from "./../Manutenzione/ManutenzioneForm";

function RicercaDatabase() {
  const [data, setData] = useUpdateData(URLS.PAGINA_RICERCA_DATABASE);
  const [inizio, setInizio] = useState("")
  const [fine, setFine] = useState(dateToDatePicker(new Date()))
  const formRef = useRef(null)
  const handleHelpChange = (e) => {
    let timeframe;
    if (e.target.value === 'week') timeframe = 7
    else if (e.target.value === 'month') timeframe = 31
    else if (e.target.value === 'year') timeframe = 365
    else return
    const newDate = dateToDatePicker(new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000))
    setInizio(newDate)
    setFine(dateToDatePicker(new Date()))
    sendForm({inizio: newDate, fine: dateToDatePicker(new Date())})
  }
  const sendForm = (moreData={}) => {
    const formData = {...Object.fromEntries(new FormData(formRef.current).entries()), ...moreData}
    const searchParams = new URLSearchParams(formData);
    apiGet(`${URLS.PAGINA_RICERCA_DATABASE}?${searchParams.toString()}`).then(
      (res) => setData(res)
    )
  }
  const tableData = data.records ? {...data, records: data.records.results} : {}
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <Row className="justify-center">
          <Col xs={8} className="px-6">
            <Card className="h-full min-h-[70px]">
              <Card.Header className="h-full grid items-center border-b-0 titolo-pagina">
                <h3 className="text-2xl text-nav-blue text-bold font-roboto">
                  Ricerca nel Database
                </h3>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Parametri di Ricerca
              </Card.Header>
              <Card.Body className="px-5">
                <form ref={formRef}>
                  <Row>
                    <Col xs={4}>
                      <Input 
                        name="inizio"
                        vertical={true}
                        inputProps={{
                          value: inizio,
                          onChange: (e) => {
                            setInizio(e.target.value)
                            sendForm()
                          },
                          type: "date"
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
                            setFine(e.target.value)
                            sendForm()
                          }
                        }}
                      />
                    </Col>
                    <Col xs={4}>
                      <Select
                        label="Help:"
                        vertical={true}
                        data={[['week', 'Ultima Settimana'], ['month', 'Ultimo Mese'], ['year', 'Ultimo Anno']]}
                        inputProps={{
                          onChange: (e) => {
                            handleHelpChange(e);
                          }
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="my-8">
                    <Col xs={1}></Col>
                    <Col xs={5}>
                      <Select
                        name="operatore"
                        vertical={true}
                        data={data.operatori && data.operatori.map(op => [op.id, op.nome])}
                        inputProps={{ onChange: sendForm }}
                      />
                    </Col>
                    <Col xs={5}>
                      <Select
                        name="operazione"
                        vertical={true}
                        data={data.operazioni && data.operazioni.map(op => [op.id, op.nome])}
                        inputProps={{ onChange: sendForm }}
                      />
                    </Col>
                    <Col xs={1}></Col>
                  </Row>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Risultati della Ricerca
              </Card.Header>
              <Card.Body className="px-5">
                <Tabella 
                  headers={["Data", "Ora", "Operazione", "Operatore"]}
                  data={tableData}
                  setData={setData}
                  FormComponent={ManutenzioneForm}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default RicercaDatabase;
