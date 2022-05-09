import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Placeholder, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { apiGet } from '../../api/utils'
import { URLS } from '../../urls'
import Wrapper from './subcomponents/Wrapper'

function Prossime() {
  const [data, setData] = useState({})
  useEffect(() => {
    apiGet(URLS.PROSSIME).then(data => parseOperazioni(data))
    setInterval(() => apiGet(URLS.PROSSIME).then(data => {
      parseOperazioni(data)
      console.log('Data updated !');
    }), 1000 * 60 * 10)
  }, [])
  const parseOperazioni = (res) => {
    if (!res) return;
    let parsedData = { ok: [], late: [] }
    res.operazioni.forEach(operazione => {
      const scadutaGiorni = operazione.giorni_mancanti && operazione.giorni_mancanti <= 0
      const scadutaPezzi = operazione.pezzi_mancanti && operazione.pezzi_mancanti <= 0
      if (scadutaGiorni || scadutaPezzi) {
        parsedData.late.push(operazione)
      } else {
        parsedData.ok.push(operazione)
      }
    })
    parsedData.ok = parsedData.ok.sort((a, b) => a.pezzi_mancanti - b.pezzi_mancanti)
    setData(parsedData)
  }
  return (
    <Wrapper defaultNav={false}>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <Row className="justify-center">
          <Col xs={8} className="px-6">
            <Card className="h-full min-h-[70px]">
              <Card.Header className="h-full grid items-center border-b-0 titolo-pagina">
                <h3 className="text-2xl text-nav-blue text-bold font-roboto">
                  Prossime Manutenzioni
                </h3>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Allarmi attivi
              </Card.Header>
              <Card.Body className="px-4 pb-0">
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Frequenza (n)</th>
                      <th>N° pezzi da ultima</th>
                      <th>Frequenza (g)</th>
                      <th>N° giorni da ultima</th>
                      <th>Esegui</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.late && data.late.length > 0 && data.late.map(operazione => {
                      const colorePezzi = operazione.pezzi_mancanti > 0 ? "#058020" : "#960c0c"
                      const coloreGiorni = operazione.giorni_mancanti > 0 ? "#058020" : "#960c0c"
                      let link = "/";
                      if (operazione.tipologia === "fissaggio") link = `/manutenzione/fissaggio/`;
                      if (operazione.tipologia === "analisi") link = `/manutenzione/analisi/?analisi=${operazione.id}`;
                      if (operazione.tipologia === "manutenzione") link = `/manutenzione/manutenzioni/?manutenzione=${operazione.id}`;
                      if (operazione.tipologia === "ossido") link = `/manutenzione/ossido/`;
                      const pezziDaUltima = operazione.intervallo_pezzi ? (operazione.intervallo_pezzi - operazione.pezzi_mancanti).toLocaleString() + ' pezzi' : "-"
                      const giorniDaUltima = operazione.intervallo_giorni ? operazione.intervallo_giorni - operazione.giorni_mancanti + ' giorni' : "-"
                      const intervalloPezzi = operazione.intervallo_pezzi ? operazione.intervallo_pezzi.toLocaleString() + ' pezzi' : "-"
                      const intervalloGiorni = operazione.intervallo_giorni ? operazione.intervallo_giorni + ' giorni' : "-"
                      return (
                        <tr key={operazione.id}>
                          <td>{operazione.nome}</td>
                          <td>{intervalloPezzi}</td>
                          <td className="font-semibold" style={{color: colorePezzi}}>{pezziDaUltima}</td>
                          <td>{intervalloGiorni}</td>
                          <td className="font-semibold" style={{color: coloreGiorni}}>{giorniDaUltima}</td>
                          <td to={link} className="cursor-pointer">
                            <Link to={link}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" /></Link>
                          </td>
                        </tr>
                    )})} 
                    {data.late && data.late.length === 0 && (
                      <tr>
                        <td colSpan="6">Nessun allarme attivo</td>
                      </tr>
                    )}
                    {!data.late && Array.from(Array(3)).map((_, idx) => (
                      <tr key={idx}>
                        <td colSpan={6}>
                          <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} className="rounded-md" />
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
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Prossime manutenzioni
              </Card.Header>
              <Card.Body className="px-4 pb-0">
              <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Frequenza (n)</th>
                      <th>Tra</th>
                      <th>Frequenza (g)</th>
                      <th>Tra</th>
                      <th>Esegui</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ok && data.ok.length > 0 && data.ok.map(operazione => {
                      const colorePezzi = operazione.pezzi_mancanti > 0 ? "#058020" : "#960c0c"
                      const coloreGiorni = operazione.giorni_mancanti > 0 ? "#058020" : "#960c0c"
                      let link = "/";
                      if (operazione.tipologia === "fissaggio") link = `/manutenzione/fissaggio/`;
                      if (operazione.tipologia === "analisi") link = `/manutenzione/analisi/?analisi=${operazione.id}`;
                      if (operazione.tipologia === "manutenzione") link = `/manutenzione/manutenzioni/?manutenzione=${operazione.id}`;
                      if (operazione.tipologia === "ossido") link = `/manutenzione/ossido/?manutenzione=${operazione.id}`;
                      const pezziMancanti = operazione.intervallo_pezzi ? operazione.pezzi_mancanti.toLocaleString() + ' pezzi' : "-"
                      const giorniMancanti = operazione.intervallo_giorni ? operazione.giorni_mancanti + ' giorni' : "-"
                      const intervalloPezzi = operazione.intervallo_pezzi ? operazione.intervallo_pezzi.toLocaleString() + ' pezzi' : "-"
                      const intervalloGiorni = operazione.intervallo_giorni ? operazione.intervallo_giorni + ' giorni' : "-"
                      return (
                        <tr key={operazione.id}>
                          <td>{operazione.nome}</td>
                          <td>{intervalloPezzi}</td>
                          <td className="font-semibold" style={{color: colorePezzi}}>{pezziMancanti}</td>
                          <td>{intervalloGiorni}</td>
                          <td className="font-semibold" style={{color: coloreGiorni}}>{giorniMancanti}</td>
                          <td to={link} className="cursor-pointer">
                            <Link to={link}><FontAwesomeIcon icon={faArrowCircleRight} size="lg" /></Link>
                          </td>
                        </tr>
                    )})}
                    {data.ok && data.ok.length === 0 && (
                      <tr>
                        <td colSpan="6">Nessuna manutenzione in coda</td>
                      </tr>
                    )}
                    {!data.ok && Array.from(Array(3)).map((_, idx) => (
                      <tr key={idx}>
                        <td colSpan={6}>
                          <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} className="rounded-md" />
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
    </Wrapper>
  )
}

export default Prossime