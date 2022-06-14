import React from 'react'
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from '../../../components/PageTitle/PageTitle'
import useGetAPIData from '../../../hooks/useGetAPIData';
import { URLS } from '../../../urls';
import FormWrapper from '../FormWrapper';
import Wrapper from '../../AreaAdmin/Wrapper'
import ArticoloForm from './ArticoloForm';
import Tabella from '../../Tabella';

function Articolo() {
  const [data, setData] = useGetAPIData([
    {nome: "records", url: URLS.ARTICOLI},
    {nome: "clienti", url: URLS.CLIENTI},
    {nome: "lavorazioni", url: URLS.LAVORAZIONI},
    {nome: "schede_controllo", url: URLS.SCHEDE_CONTROLLO},
  ])
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Articoli</PageTitle>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Nuovo Articolo
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setData} url={URLS.ARTICOLI}>
                  <ArticoloForm data={data} />
                </FormWrapper>
              </Card.Body>
            </Card>
          </Col>
        </Row>  
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Ultimi articoli creati
              </Card.Header>
              <Card.Body>
                <Tabella
                  date={false}
                  headers={["Nome", "Codice", "Cliente"]}
                  valori={['nome', 'codice', 'cliente']}
                  data={data}
                  setData={setData}
                  FormComponent={ArticoloForm}
                  url={URLS.ARTICOLI}
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

export default Articolo