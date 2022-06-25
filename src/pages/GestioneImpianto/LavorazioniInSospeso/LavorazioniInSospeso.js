import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData";
import { URLS } from "../../../urls";
import FormWrapper from "../../AreaAdmin/FormWrapper";
import Tabella from "../../Tabella";
import Wrapper from "../Wrapper";
import RecordLavorazioneForm from "./../RecordLavorazione/RecordLavorazioneForm";

function LavorazioniInSospeso() {
  const [data, setData] = useGetAPIData([
    {nome: "operatori", url: URLS.OPERATORI},
    {nome: "articoli", url: URLS.ARTICOLI_NESTED},
    {nome: "records", url: URLS.RECORD_LAVORAZIONI_IN_SOSPESO},
  ])
  // console.log(data);
  return (
    <Wrapper title="Scheda di Controllo">
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Lavorazioni in sospeso</PageTitle>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Lavorazioni non completate
              </Card.Header>
              <Card.Body>
                <Tabella 
                  headers={["Lotto", "N° Pezzi", "Operatore"]}
                  valori={['n_lotto_cliente', 'n_pezzi_dichiarati', 'operatore__operatori']}
                  data={data}
                  setData={setData}
                  FormComponent={RecordLavorazioneForm}
                  url={URLS.RECORD_LAVORAZIONI}
                  FormWrapper={FormWrapper}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default LavorazioniInSospeso