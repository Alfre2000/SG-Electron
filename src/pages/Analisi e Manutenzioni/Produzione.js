import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Form, Row, Stack } from 'react-bootstrap'
import { Bar, Pie } from 'react-chartjs-2'
import { apiGet } from '../../api/utils'
import { URLS } from '../../urls'
import { colors, getOperatoreName, capitalize } from '../../utils'
import Wrapper from './subcomponents/Wrapper'
import PasswordModal from "../../components/PasswordModal/PasswordModal";
import { useNavigate } from 'react-router-dom'

function Produzione() {
  const [data, setData] = useState({})
  const [frequenza, setFrequenza] = useState("day")
  const [authed, setAuthed] = useState(false)
  let navigate = useNavigate();
  useEffect(() => {
    apiGet(URLS.PRODUZIONE).then(data => setData(data))
    setInterval(() => apiGet(URLS.PRODUZIONE).then(data => {
      setData(data)
      console.log('Data updated !');
    }), 1000 * 60 * 10)
  }, [])
  const getProduzioneChartData = () => {return {
    labels: data.produzione.map(d => {
      let options;
      switch (frequenza) {
        case "day":
          options = { weekday: 'long', day: 'numeric', month: 'long' }
          break;
        case "month":
          options = { month: 'long', year: "numeric" }
          break;
        case "year":
          options = { year: "numeric" }
          break;
        default:
          break;
      }
      return capitalize(new Date(d.timeframe).toLocaleString('default', options))
    }).reverse(),
    datasets: [
      { 
        label: 'Quantità prodotta',
        data: data.produzione.map(el => el.produzione).reverse(),
        backgroundColor: '#0d93d1',
      }
    ],
  }}
  const getPieChartData = () => {return {
    labels: data.pezzi_per_operatore.map(el => getOperatoreName(el.operatore, data.operatori)),
    datasets: [
      { 
        label: 'Produzione per operatore',
        data: data.pezzi_per_operatore.map(el => el.n_pezzi),
        backgroundColor: colors
      }
    ],
  }}
  const updateChart = (freq) => {
    setFrequenza(freq)
    apiGet(URLS.PRODUZIONE + `?frequenza=${freq}`).then(data => setData(data))
  }
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        {authed ? (
          <Stack gap={5}>
          <Card>
            <Card.Header as="h6" className="font-semibold text-lg">
              Andamento produzione
            </Card.Header>
            <Card.Body className="px-5">
              {data.produzione && (
                <>
                  <div className="min-h-[300px]">
                    <Bar data={getProduzioneChartData()} options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      barPercentage: 0.9,
                      borderRadius: 2,
                      borderColor: "#007eb8",
                      hoverBorderWidth: 2,
                      scales: {
                        y: {
                          grace: "5%",
                          title: {
                            display: true,
                            text: "N° pezzi prodotti"
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            title: function (tooltipItems) {
                              return tooltipItems[0].label;
                            },
                            label: function (context) {
                              var label = context.dataset.label || "";
                              if (label) {
                                label += ": ";
                              }
                              if (context.parsed.y !== null) {
                                label += context.parsed.y.toLocaleString()
                              }
                              return label + ' pezzi';
                            },
                          },
                          backgroundColor: "rgba(245, 246, 247, 0.9)",
                          titleColor: "rgba(1, 54, 145, 1)",
                          bodyColor: "rgba(1, 54, 145, 1)",
                          footerColor: "rgba(1, 54, 145, 1)",
                          borderColor: "rgb(0, 46, 92)",
                          borderWidth: 1,
                          padding: {
                            y: 10,
                            left: 10,
                            right: 20,
                          },
                          displayColors: false,
                          titleFont: {
                            size: 13,
                          },
                          bodyFont: {
                            size: 13,
                          },
                          footerFont: {
                            size: 13,
                            weight: "normal",
                          },
                          footerMarginTop: 4,
                          cornerRadius: 4,
                          titleMarginBottom: 5,
                        },
                      },
                    }} />
                  </div>
                  <Row>
                    <Col xs={4}>
                      <Form.Group>
                        <Form.Label>Arco temporale:</Form.Label>
                        <Form.Select required size="sm" className="text-center" value={frequenza} onChange={(e) => updateChart(e.target.value)} >
                          <option value="day">Ultimo Mese</option>  
                          <option value="week">Ultimi 6 Mesi</option>  
                          <option value="month">Ultimi 3 anni</option>  
                          <option value="year">Da sempre</option>  
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
          <Card>
            <Card.Header as="h6" className="font-semibold text-lg">
              Produzione per operatore
            </Card.Header>
            <Card.Body className="px-5">
              {data.pezzi_per_operatore && (
                <div className="max-h-[300px]">
                  <Pie data={getPieChartData()} options={{maintainAspectRatio: false}} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Stack>
        ) : (
          <PasswordModal 
            show={authed === false}
            onSuccess={() => setAuthed(true)}
            onFail={() => navigate('/manutenzione/scheda/')}
          />
        )}
      </Container>
    </Wrapper>
  )
}

export default Produzione