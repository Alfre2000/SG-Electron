import React, { useEffect, useState } from 'react'
import Navbar from "./../components/Navbar/Navbar";
import Header from "./../components/Header/Header";
import useCheckAuth from '../hooks/useCheckAuth';
import { faCheck, faComputer } from '@fortawesome/free-solid-svg-icons'
import { apiGet, apiPost } from '../api/utils';
import { URLS } from '../urls';
import { Col, Container, Row, Alert, Card, Placeholder, Form, Button, Table } from 'react-bootstrap';
import { dateToDatePicker, dateToTimePicker } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ManutenzioneRobot() {
  useCheckAuth();
  const [data, setData] = useState({})
  const [pezzi, setPezzi] = useState("")
  const [operatore, setOperatore] = useState("")
  const [note, setNote] = useState("")
  const [date, setDate] = useState(dateToDatePicker(new Date()))
  const [time, setTime] = useState(dateToTimePicker(new Date()))
  const [navOpen, setNavOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const navbar = [
    { title: "Programmi", icon: faComputer, links: [
      {name: 'HomePage', link: '/'},
      {name: 'Manutenzione Robot', link: '/robot'},
    ]},
  ];
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  useEffect(() => {
    apiGet(URLS.PEZZI).then(data => setData(data))
    setInterval(() => apiGet(URLS.PEZZI).then(data => {
      setData(data)
      console.log('Data updated !');
    }), 1000 * 60 * 10)
  }, [])
  const handleForm = (e) => {
    e.preventDefault();
    let datetime = new Date(date + " " + time).toISOString()
    apiPost(
      URLS.CREA_RECORD_LAVORAZIONE,
      { n_pezzi: pezzi, operatore, note, data: datetime }
    ).then(response => {
      response.operatore = { id: response.operatore, nome: data.operatori.filter(el => el.id === response.operatore)[0].nome}
      setData({...data, lavorazioni: [response, ...data.lavorazioni], n_pezzi: data.n_pezzi - pezzi})
      setPezzi("")
      setOperatore("")
      setNote("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    }).catch(err => console.log(err));
  }
  setInterval(() => {
    setTime(dateToTimePicker(new Date()))
  }, 1000 * 60)
  const manutenzioneUrgente = data.n_giorni <= 0 || data.n_pezzi <= 0
  return (
    <>
      <Navbar menu={navbar} navOpen={navOpen} />
      <div className="grow flex flex-col">
        <Header toggleNavbar={toggleNavbar} title="Manutenzione Robot" />
        <div className="bg-gray-50 grow flex px-8">
          <Container className="text-center my-10 lg: mx-2 xl:mx-10 2xl:mx-12">
            {manutenzioneUrgente && (
              <Row className="justify-center mb-2 -mt-3">
                <Col xs={12}>
                  <Alert variant="danger"><strong>É necessaria la manutenzione dell'impianto !</strong></Alert>
                </Col>
              </Row>)}
            <Row>
              <Col xs={4} className="pr-6">
                <Card>
                  <Card.Header className="font-semibold text-lg">N° pezzi alla manutenzione</Card.Header>
                  <Card.Body className="text-center">
                    {data.n_pezzi !== undefined ? (
                      <h5 className="text-2xl text-semibold">{data.n_pezzi}</h5>
                    )
                      : (
                      <Placeholder as="h5" animation="glow">
                        <Placeholder xs={4} className="rounded-md" />
                      </Placeholder>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={4} className="px-6">
                <Card className="h-full">
                  <Card.Header className="h-full grid items-center border-b-0">
                    {data.impianto ? (
                      <h3 className="text-3xl text-semibold">{data.impianto}</h3>
                    ) : (
                      <Placeholder as="h5" animation="glow">
                        <Placeholder xs={4} className="rounded-md" />
                      </Placeholder>
                    )}
                  </Card.Header>
                </Card>
              </Col>
              <Col xs={4} className="pl-6">
                <Card className="rounded-xl">
                  <Card.Header className="font-semibold text-lg">N° giorni alla manutenzione</Card.Header>
                  <Card.Body className="text-center">
                    {data.n_giorni !== undefined ? (
                      <h5 className="text-2xl text-semibold">{data.n_giorni}</h5>
                    )
                      : (
                      <Placeholder as="h5" animation="glow">
                        <Placeholder xs={4} className="rounded-md" />
                      </Placeholder>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-10">
              <Col xs={12}>
                <Card>
                  <Card.Header as="h6" className="font-semibold text-lg">Aggiungi lavorazione lotto</Card.Header>
                  <Card.Body className="px-5">
                    <Form onSubmit={handleForm}>
                      <Row className="mb-4">
                        <Col xs={2}>
                        <Form.Group>
                          <Form.Label>N° di pezzi</Form.Label>
                          <Form.Control type="number" className="text-center" required value={pezzi} onChange={e => setPezzi(e.target.value)} />
                        </Form.Group>
                        </Col>
                        <Col xs={4}>
                          <Form.Group>
                            <Form.Label>Operatore</Form.Label>
                            <Form.Select required className="text-center" value={operatore} onChange={e => setOperatore(e.target.value)}>
                                <option value=""></option>  
                                {data.operatori && data.operatori.map(operatore => (
                                  <option key={operatore.id} value={operatore.id}>{operatore.nome}</option>  
                                ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group>
                            <Form.Label>Data</Form.Label>
                            <Form.Control className="text-center" type="date" value={date} onChange={e => setDate(e.target.value)}/>
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group>
                            <Form.Label>Ora</Form.Label>
                            <Form.Control className="text-center" type="time" value={time} onChange={e => setTime(e.target.value)}/>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group>
                        <Row className="mb-4">
                          <Col xs={1} className="flex items-center">
                            <Form.Label>Note</Form.Label>
                          </Col>
                          <Col sm={11}>
                            <Form.Control as="textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} />
                          </Col>
                        </Row>
                      </Form.Group>
                      <Row className="mb-2 items-center">
                        <Col sx={4}></Col>
                        <Col sx={4}>
                          <Button type="submit" className="bg-[#0d6efd] w-28 font-medium">Salva</Button>
                        </Col>
                        <Col sx={4}>
                          {success && (
                            <Alert className="m-0 p-2" variant="success"><FontAwesomeIcon size="lg" className="mr-3" icon={faCheck} />Lavorazione aggiunta !</Alert>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-10">
              <Col xs={12}>
                <Card>
                  <Card.Header as="h6" className="font-semibold text-lg">Ultimi lotti lavorati</Card.Header>
                  <Card.Body>
                    <Table striped bordered>
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Ora</th>
                          <th>N° Pezzi</th>
                          <th>Operatore</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                      {data.lavorazioni ? data.lavorazioni.map(lavorazione => {
                        let data = new Date(lavorazione.data)
                        return (
                          <tr key={lavorazione.id}>
                            <td>{data.toLocaleDateString()}</td>
                            <td>{data.toLocaleTimeString()}</td>
                            <td>{lavorazione.n_pezzi}</td>
                            <td>{lavorazione.operatore ? lavorazione.operatore.nome : ""}</td>
                            <td>{lavorazione.note}</td>
                          </tr>
                        )}) : Array.from(Array(5)).map((_, idx) => (
                          <tr key={idx}>
                            <td colSpan="5">
                              <Placeholder as="p" animation="glow">
                                <Placeholder xs={12} className="rounded-md"/>
                              </Placeholder>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  )
}

export default ManutenzioneRobot