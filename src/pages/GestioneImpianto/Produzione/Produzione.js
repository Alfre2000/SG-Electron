import React, { useState } from "react";
import { Card, Container, Form, Stack } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import { URLS } from "../../../urls";
import { options } from "../../../charts/barOptions";
import { findElementFromID } from "../../../utils";
import Wrapper from "../Wrapper";
import PasswordModal from "../../../components/Modals/PasswordModal/PasswordModal";
import { useNavigate } from "react-router-dom";
import SearchSelect from "../../../components/form-components/SearchSelect";
import { colors, formatDate } from "../../../charts/utils";
import useImpiantoQuery from "../../../hooks/useImpiantoQuery/useImpiantoQuery";
import Loading from "../../../components/Loading/Loading";

const frequenzaOptions = [
  { value: "day", label: "Giornaliera" },
  { value: "week", label: "Settimanale" },
  { value: "month", label: "Mensile" },
  { value: "year", label: "Annuale" },
];

function Produzione() {
  const [frequenza, setFrequenza] = useState(frequenzaOptions[0]);

  const produzioneQuery = useImpiantoQuery({
    queryKey: [URLS.ANDAMENTO_PRODUZIONE, { frequenza: frequenza.value }],
  });
  const pezziOperatoreQuery = useImpiantoQuery({
    queryKey: URLS.PRODUZIONE_PER_OPERATORE,
  });
  const operatoriQuery = useImpiantoQuery({ queryKey: URLS.OPERATORI });

  const [authed, setAuthed] = useState(false);
  let navigate = useNavigate();
  const getProduzioneChartData = () => ({
    labels: produzioneQuery.data
      .map((d) => formatDate(d.timeframe, frequenza.value))
      .reverse(),
    datasets: [
      {
        label: "Quantità prodotta",
        data: produzioneQuery.data.map((el) => el.produzione).reverse(),
        backgroundColor: "#0d93d1",
      },
    ],
  });
  const getPieChartData = () => ({
    labels: pezziOperatoreQuery.data.map(
      (el) => findElementFromID(el.operatore, operatoriQuery.data)?.nome
    ),
    datasets: [
      {
        label: "Produzione per operatore",
        data: pezziOperatoreQuery.data.map((el) => el.n_pezzi),
        backgroundColor: colors,
      },
    ],
  });
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
                <div className="min-h-[300px]">
                  {produzioneQuery.isLoading && (
                    <Loading className="relative top-28" />
                  )}
                  {produzioneQuery.isSuccess && (
                    <Bar data={getProduzioneChartData()} options={options} />
                  )}
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
                          onChange: setFrequenza,
                        }}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Produzione per operatore
              </Card.Header>
              <Card.Body className="px-5">
                {pezziOperatoreQuery.isSuccess && (
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
