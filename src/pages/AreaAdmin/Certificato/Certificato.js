import { faArrowLeft, faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Container, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import MyToast from "../../../components/MyToast/MyToast";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import Wrapper from "../../AreaAdmin/Wrapper";
import FormWrapper from "../../FormWrapper";
import CertificatoForm from "./CertificatoForm";

function Certificato() {
  const [searchParams] = useSearchParams()
  const [data, setData] = useGetAPIData([
    { nome: "records", url: URLS.CERTIFICATI },
    { nome: "lavorazioni", url: URLS.LAVORAZIONI },
    { nome: "metalli", url: URLS.MATERIALI },
    { nome: "schede_controllo", url: URLS.SCHEDE_CONTROLLO },
  ]);
  const [scheda, setScheda] = useState(searchParams.get("scheda_controllo"));
  const [successToast, setSuccessToast] = useState(false)
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12 mb-52">
        <PageTitle>Modello Certificato</PageTitle>
        {scheda ? data?.records && data?.schede_controllo ? (
          <div className="relative">

            <Button 
              variant="secondary"
              className="absolute font-medium left-full bg-gray-400 border-gray-400 -translate-x-full -translate-y-[120%] flex items-center"
              onClick={() => setScheda(null)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="pr-2 mt-0.5" />
              Indietro
            </Button>
            <FormWrapper
              data={data}
              setData={setData}
              url={URLS.CERTIFICATI}
              initialData={data.records.results.find(r => r.scheda_controllo === scheda) || undefined}
              onSuccess={(newData) => {
                if (data.records.results.find(r => r.scheda_controllo === scheda)) {
                  setSuccessToast("modificato")
                } else {
                  setSuccessToast("creato")
                }
                setTimeout(() => setSuccessToast(false), 4000)
                setScheda(null)
                setData(newData)
              }}
            >
              <CertificatoForm data={data} scheda={scheda} />
            </FormWrapper>
          </div>
        ) : (
          <div className="h-[90vh] flex justify-center">
            <Spinner animation="border" role="status" className="mt-[20vh]" />
          </div>
        ) : (
          <>
            <p className="mt-16">
              Seleziona la scheda controllo di cui vuoi creare o modificare il
              certificato
            </p>
            <ListGroup className="w-2/3 mx-auto mt-8 hover:cursor-pointer">
              {data?.schede_controllo?.map((el) => (
                <ListGroupItem
                  key={el.id}
                  active={scheda === el.nome}
                  onClick={() => setScheda(el.id)}
                  className="flex justify-between"
                >
                  <div className="text-center w-[90%]">{el.nome}</div>
                  <div className="w-[10%] border-l pl-2">
                    {data?.records?.results?.map(r => r.scheda_controllo)?.includes(el.id) ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faClose} />
                    )}
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
            <p className="mt-3">
              <FontAwesomeIcon icon={faCheck} className="relative top-0.5 pr-1"/> = già creato
              <FontAwesomeIcon icon={faClose} className="pl-8 relative top-[1px] pr-1" /> = non ancora creato
            </p>
          </>
        )}
        {successToast && <MyToast>Certificato {successToast} con successo !</MyToast>}
      </Container>
    </Wrapper>
  );
}

export default Certificato;
