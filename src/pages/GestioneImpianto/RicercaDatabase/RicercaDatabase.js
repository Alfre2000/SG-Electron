import React, { useContext, useRef, useState } from "react";
import { Col, Container, Row, Card, Form } from "react-bootstrap";
import Input from "../../../components/form-components/Input";
import { dateToDatePicker, findElementFromID, searchOptions } from "../../../utils";
import Wrapper from "../Wrapper";
import { URLS } from "../../../urls";
import { apiGet } from "../../../api/api";
import ManutenzioneForm from "./../Manutenzione/ManutenzioneForm";
import AnalisiForm from "./../Analisi/AnalisiForm";
import FissaggioForm from "./../Fissaggio/FissaggioForm";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import Tabella from "../../Tabella";
import PageTitle from "../../../components/PageTitle/PageTitle";
import UserContext from "../../../UserContext";
import SearchSelect from "../../../components/form-components/SearchSelect";

function RicercaDatabase() {
  const { user: { user: { impianto } } } = useContext(UserContext)
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "operazioni", url: URLS.OPERAZIONI_DEEP},
    {nome: "records", url: URLS.PAGINA_RICERCA_DATABASE}
  ])
  const [inizio, setInizio] = useState("")
  const [fine, setFine] = useState(dateToDatePicker(new Date()))
  const formRef = useRef(null)
  const handleHelpChange = (e) => {
    let timeframe;
    if (e.value === 'week') timeframe = 7
    else if (e.value === 'month') timeframe = 31
    else if (e.value === 'year') timeframe = 365
    else return
    const newDate = dateToDatePicker(new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000))
    setInizio(newDate)
    setFine(dateToDatePicker(new Date()))
    sendForm({inizio: newDate, fine: dateToDatePicker(new Date())})
  }
  const sendForm = (moreData={}) => {
    const formData = {...Object.fromEntries(new FormData(formRef.current).entries()), ...moreData, impianto: impianto.id}
    const searchParams = new URLSearchParams(formData);
    apiGet(`${URLS.PAGINA_RICERCA_DATABASE}?${searchParams.toString()}`).then(
      (res) => setData(prev => ({...prev, records:res}))
    )
  }
  const tabellaForms = { manutenzioni: ManutenzioneForm, analisi: AnalisiForm, fissaggi: FissaggioForm }
  const tabellaURLs = { manutenzioni: URLS.RECORD_MANUTENZIONE, analisi: URLS.RECORD_ANALISI, fissaggi: URLS.RECORD_FISSAGGIO}
  const dataTabella = data.records ? {...data, records: {...data.records, results: data.records.results.map(r => {
    const tipologia = findElementFromID(r.operazione, data.operazioni).tipologia
    return {...r, form: tabellaForms[tipologia], url: tabellaURLs[tipologia]}
  })}} : {}
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Ricerca nel Database</PageTitle>
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
                      <Form.Label>Help:</Form.Label>
                      <SearchSelect
                        label={false}
                        options={[{value: 'week', label: 'Ultima Settimana'}, { value: 'month', label: 'Ultimo Mese'}, { value: 'year', label: 'Ultimo Anno'}]}
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
                      <Form.Label>Operatore:</Form.Label>
                      <SearchSelect
                        label={false}
                        name="operatore"
                        options={searchOptions(data?.operatori, "nome")}
                        inputProps={{ onChange: (e) => sendForm({ operatore: e?.value || "" }) }}
                      />
                    </Col>
                    <Col xs={5}>
                      <Form.Label>Operazione:</Form.Label>
                      <SearchSelect
                        label={false}
                        name="operazione"
                        options={searchOptions(data?.operazioni, "nome")}
                        inputProps={{ onChange: (e) => sendForm({ operazione: e?.value || "" }) }}
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
                  headers={['Operazione', 'Operatore']}
                  valori={['operazione__operazioni', 'operatore__operatori']}
                  data={dataTabella}
                  setData={setData}
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
