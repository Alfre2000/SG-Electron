import React, { useState } from "react";
import { Card, Container, Form, Stack } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import { apiGet } from "../../../api/api";
import { URLS } from "../../../urls";
import { options } from "../../../charts/barOptions";
import { findElementFromID } from "../../../utils";
import Wrapper from "../Wrapper";
import PasswordModal from "../../../components/Modals/PasswordModal/PasswordModal";
import { useNavigate } from "react-router-dom";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { useUserContext } from "../../../UserContext";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { colors, formatDate } from "../../../charts/utils";

const frequenzaOptions = [
  { value: "day", label: "Giornaliera" },
  { value: "week", label: "Settimanale" },
  { value: "month", label: "Mensile" },
  { value: "year", label: "Annuale" },
];

function Produzione() {
  const { user } = useUserContext();
  const [data, setData] = useGetAPIData([
    { nome: "produzione", url: URLS.ANDAMENTO_PRODUZIONE },
    { nome: "pezzi_per_operatore", url: URLS.PRODUZIONE_PER_OPERATORE },
    { nome: "operatori", url: URLS.OPERATORI },
  ]);
  const [frequenza, setFrequenza] = useState(frequenzaOptions[0]);
  const [authed, setAuthed] = useState(false);
  let navigate = useNavigate();
  const getProduzioneChartData = () => ({
    labels: data.produzione
      .map((d) => formatDate(d.timeframe, frequenza.value))
      .reverse(),
    datasets: [
      {
        label: "Quantità prodotta",
        data: data.produzione.map((el) => el.produzione).reverse(),
        backgroundColor: "#0d93d1",
      },
    ],
  });
  const getPieChartData = () => ({
    labels: data.pezzi_per_operatore.map(
      (el) => findElementFromID(el.operatore, data.operatori)?.nome
    ),
    datasets: [
      {
        label: "Produzione per operatore",
        data: data.pezzi_per_operatore.map((el) => el.n_pezzi),
        backgroundColor: colors,
      },
    ],
  });
  const updateChart = (freq) => {
    setFrequenza(freq);
    const impianto = user?.user?.impianto?.id;
    const url = `${URLS.ANDAMENTO_PRODUZIONE}?frequenza=${freq.value}&${
      impianto ? `impianto=${impianto}` : ""
    }`;
    apiGet(url).then((response) => setData({ ...data, produzione: response }));
  };
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
                      <Bar data={getProduzioneChartData()} options={options} />
                    </div>
                    <Card className="px-0 mt-4 mb-2">
                      <Card.Header
                        as="h6"
                        className="font-semibold text-md text-left"
                      >
                        Impostazioni
                      </Card.Header>
                      <Card.Body className="px-5">
                        <Form.Group className="w-1/2 m-auto">
                          <Form.Label>Frequenza:</Form.Label>
                          <SearchSelect
                            options={frequenzaOptions}
                            inputProps={{
                              value: frequenza,
                              onChange: (e) => updateChart(e),
                            }}
                          />
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
                    <Pie
                      data={getPieChartData()}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          </Stack>
        ) : (
          <PasswordModal
            show={authed === false}
            onSuccess={() => setAuthed(true)}
            onFail={() => navigate("/manutenzione/record-lavorazione/")}
          />
        )}
      </Container>
    </Wrapper>
  );
}

export default Produzione;
