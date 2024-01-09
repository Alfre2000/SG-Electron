import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Wrapper from "../Wrapper";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { URLS } from "../../../urls";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import { RicaviType } from "../../../interfaces/global";
import { colors, formatDate } from "../../../charts/utils";

type Dati = {
  impianto__nome: string;
  dati: {
    month: string;
    ricavi: number;
  }[];
}[];

function DashboardRicavi() {
  const query = useQuery<RicaviType>({ queryKey: [URLS.RICAVI] });
  const groupedByImpianto = query.data?.reduce((accumulator: any, { impianto__nome, month, ricavi }) => {
    if (!(impianto__nome in accumulator)) accumulator[impianto__nome] = [];
    accumulator[impianto__nome].push({ month, ricavi });
    return accumulator;
  }, {});
  const transformedData = groupedByImpianto ? Object.entries(groupedByImpianto).map(([impianto__nome, dati]) => ({ impianto__nome, dati })) as unknown as Dati : [];

  for (let i = 1; i < 13; i++) {
    const month = formatDate(new Date().setMonth(new Date().getMonth() - i), "month");
    transformedData.forEach((impianto) => {
      if (!impianto.dati.find((record) => formatDate(record.month, "month") === month)) impianto.dati.push({ month, ricavi: 0 });
    });
  }
  transformedData.forEach((impianto) => {
    impianto.dati.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  });

  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12 px-0 flex flex-col gap-8">
        <Row className="gap-8">
          <Col className="px-0">
            <Card className="text-center">
              <Card.Header>Ricavi</Card.Header>
              <Card.Body className="flex flex-col">
                {query.isError && <Error />}
                {query.isLoading && <Loading className="m-auto" />}
                {query.isSuccess && (
                  <Bar
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      borderColor: "#007eb8",
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          grace: "5%",
                          stacked: true,
                          title: {
                            display: true,
                            text: "Ricavi",
                          },
                          ticks: {
                            callback: function (value) {
                              return value.toLocaleString() + " €";
                            },
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: "chartArea",
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
                                label += context.parsed.y.toLocaleString();
                              }
                              return label + " €";
                            },
                          },
                          backgroundColor: "rgba(245, 246, 247, 0.9)",
                          titleColor: "rgba(1, 54, 145, 1)",
                          bodyColor: "rgba(1, 54, 145, 1)",
                          footerColor: "rgba(1, 54, 145, 1)",
                          borderColor: "rgb(0, 46, 92)",
                          borderWidth: 1,
                          padding: {
                            left: 10,
                            top: 10,
                            bottom: 10,
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
                    }}
                    data={{
                      labels: transformedData[0]?.dati.map((record) => formatDate(record.month, "month")),
                      datasets: transformedData?.map((data, i) => ({
                        label: data.impianto__nome,
                        data: data.dati.map((record) => record.ricavi),
                        backgroundColor: colors[i],
                        borderColor: colors[i],
                        borderWidth: 1,
                      })),
                    }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
}

export default DashboardRicavi;
