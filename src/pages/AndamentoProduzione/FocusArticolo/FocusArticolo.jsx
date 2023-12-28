import React from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import Wrapper from "../Wrapper";
import { URLS } from "@/urls";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading/Loading";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import LavorazioniRichieste from "./components/LavorazioniRichieste";
import ImmagineSpessore from "./components/ImmagineSpessore";
import DocumentiSupporto from "./components/DocumentiSupporto";
import PrimoUltimoLotto from "./components/PrimoUltimoLotto";
import NumeroLotti from "./components/NumeroLotti";
import NumeroPezzi from "./components/NumeroPezzi";
import UltimiRecordLavorazione from "./components/UltimiRecordLavorazione";

function FocusArticolo() {
  const { articoloId } = useParams();
  const articoliQuery = useQuery([`${URLS.ARTICOLI}${articoloId}`]);
  const articolo = articoliQuery.data;
  return (
    <Wrapper>
      <Container className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 px-0">
        {articoliQuery.isLoading && <Loading className="m-auto" />}
        {articoliQuery.isSuccess && (
          <>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-2xl whitespace-nowrap overflow-hidden text-ellipsis max-w-lg">
                  {articolo.descrizione || articolo.nome}
                </h1>
                <hr className="w-1/2 mt-2 pt-[3px] bg-nav-blue opacity-100" />
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faUserTie}
                  className="mr-4 text-xl text-nav-blue"
                />
                <h2 className="text-xl">{articolo.cliente}</h2>
              </div>
            </div>
            <Stack gap={4}>
              <Row>
                <Col>
                  <LavorazioniRichieste articolo={articolo} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <ImmagineSpessore articolo={articolo} />
                </Col>
                <Col>
                  <DocumentiSupporto articolo={articolo} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <PrimoUltimoLotto />
                </Col>
                <Col>
                  <NumeroLotti />
                </Col>
                <Col>
                  <NumeroPezzi />
                </Col>
              </Row>
              <Row>
                <Col>
                  <UltimiRecordLavorazione />
                </Col>
              </Row>
            </Stack>
          </>
        )}
      </Container>
    </Wrapper>
  );
}

export default FocusArticolo;
