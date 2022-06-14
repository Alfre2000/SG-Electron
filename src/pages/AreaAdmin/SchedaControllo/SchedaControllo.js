import React from 'react'
import { Col, Container, Row, Card } from "react-bootstrap";
import PageTitle from '../../../components/PageTitle/PageTitle'
import useGetAPIData from '../../../hooks/useGetAPIData';
import { URLS } from '../../../urls';
import FormWrapper from '../../FormWrapper';
import Wrapper from '../../AreaAdmin/Wrapper'
import SchedaControlloForm from './SchedaControlloForm';

function SchedaControllo() {
  const [data, setData] = useGetAPIData([
    {nome: "articoli", url: URLS.ARTICOLI_NESTED},
    {nome: "schede_controllo", url: URLS.SCHEDE_CONTROLLO},
    {nome: "clienti", url: URLS.CLIENTI},
    {nome: "lavorazioni", url: URLS.LAVORAZIONI},
  ])
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Schede di Controllo</PageTitle>
        <Row className="mt-10">
          <Col xs={12}>
            <Card>
              <Card.Header as="h6" className="font-semibold text-lg">
                Nuova Scheda di Controllo
              </Card.Header>
              <Card.Body className="px-5">
                <FormWrapper data={data} setData={setData} url={URLS.SCHEDE_CONTROLLO}>
                  <SchedaControlloForm data={data} setData={setData} />
                </FormWrapper>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default SchedaControllo