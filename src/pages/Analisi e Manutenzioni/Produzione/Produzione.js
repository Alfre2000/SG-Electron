import React, { useContext, useState } from 'react'
import { Card, Container, Form, Stack } from 'react-bootstrap'
import { Bar, Pie } from 'react-chartjs-2'
import { apiGet } from '../../../api/utils'
import { URLS } from '../../../urls'
import { colors, findElementFromID, capitalize } from '../../../utils'
import Wrapper from '../Wrapper'
import PasswordModal from "../../../components/PasswordModal/PasswordModal";
import { useNavigate } from 'react-router-dom'
import useGetAPIData from '../../../hooks/useGetAPIData'
import UserContext from '../../../UserContext'

function Produzione() {
  const { user: { user: { impianto } } } = useContext(UserContext)
  const [data, setData] = useGetAPIData([
    {nome: "produzione", url: URLS.ANDAMENTO_PRODUZIONE},
    {nome: "pezzi_per_operatore", url: URLS.PRODUZIONE_PER_OPERATORE},
    {nome: "operatori", url: URLS.OPERATORI},
  ])
  const [frequenza, setFrequenza] = useState("day")
  const [authed, setAuthed] = useState(false)
  let navigate = useNavigate();
  const getProduzioneChartData = () => {return {
    labels: data.produzione.map(d => {
      let options;
      switch (frequenza) {
        case "day":
          options = { weekday: 'short', day: 'numeric', month: 'long' }
          break;
        case "week":
            options = { month: 'long', year: "numeric" }
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
    labels: data.pezzi_per_operatore.map(el => findElementFromID(el.operatore, data.operatori)?.nome),
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
    const url = `${URLS.ANDAMENTO_PRODUZIONE}?frequenza=${freq}&impianto=${impianto?.id || 1000}`
    apiGet(url).then(response => setData({...data, produzione: response}))
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
                  <Card className="px-0 mt-4 mb-2">
                    <Card.Header as="h6" className="font-semibold text-md text-left">
                      Impostazioni
                    </Card.Header>
                    <Card.Body className="px-5">
                      <Form.Group className="w-1/2 m-auto">
                        <Form.Label>Arco temporale:</Form.Label>
                        <Form.Select required size="sm" className="text-center" value={frequenza} onChange={(e) => updateChart(e.target.value)} >
                          <option value="day">Ultimo Mese</option>  
                          <option value="week">Ultimi 6 Mesi</option>  
                          <option value="month">Ultimi 3 anni</option>  
                          <option value="year">Da sempre</option>  
                        </Form.Select>
                      </Form.Group>
                    </Card.Body>
                  </Card>
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
                <div className="max-h-[300px] h-[200px]">
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