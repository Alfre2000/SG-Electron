import { faArrowLeft, faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Container, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import PageTitle from "../../../components/PageTitle/PageTitle";
import { URLS } from "../../../urls";
import Wrapper from "@ui/wrapper/Wrapper";
import Form from "../../Form";
import CertificatoForm from "./CertificatoForm";
import useCustomQuery from "../../../hooks/useCustomQuery/useCustomQuery";
import Loading from "../../../components/Loading/Loading";
import PageContext from "../../../contexts/PageContext";
import { toast } from "sonner";
import Input from "../../../components/form-components/Input";

function Certificato() {
  const [nome, setNome] = useState(null)
  const [searchParams] = useSearchParams()
  const schedeControlloQuery = useCustomQuery({ queryKey: [URLS.SCHEDE_CONTROLLO, {page: 1}, { nome: nome }] })
  const certificatiQuery = useCustomQuery({ queryKey: [URLS.CERTIFICATI, {page: 1}] })

  const [scheda, setScheda] = useState(searchParams.get("scheda_controllo"));
  return (
    <PageContext
      getURL={URLS.CERTIFICATI}
      FormComponent={CertificatoForm}
    >
      <Wrapper>
        <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12 mb-52">
          <PageTitle>Modello Certificato</PageTitle>
          {scheda ? certificatiQuery.isSuccess && schedeControlloQuery.isSuccess ? (
            <div className="relative">
              <Button 
                variant="secondary"
                className="absolute font-medium left-full bg-gray-400 border-gray-400 -translate-x-full -translate-y-[120%] flex items-center"
                onClick={() => setScheda(null)}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="pr-2 mt-0.5" />
                Indietro
              </Button>
              <Form
                initialData={certificatiQuery.data.results.find(r => r.scheda_controllo === scheda) || undefined}
                onSuccess={() => {
                  if (certificatiQuery.data.results.find(r => r.scheda_controllo === scheda)) {
                    toast.success("Certificato modificato con successo !")
                  } else {
                    toast.success("Certificato creato con successo !")
                  }
                  setScheda(null)
                }}
                componentProps={{ scheda: scheda}}
              />
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
              <div className="flex justify-center mt-8">
                <div className="w-1/2 items-center">
                  <Input
                    label="Ricerca"
                    labelProps={{ className: "pb-2" }}
                    inputProps={{
                      value: nome,
                      onChange: e => setNome(e.target.value)
                    }}
                  />
                </div>
              </div>
              <ListGroup className="w-2/3 mx-auto mt-8 hover:cursor-pointer">
                {schedeControlloQuery.isLoading && (
                  <Loading className="mb-10 relative top-5" />
                )}
                {schedeControlloQuery.isSuccess && schedeControlloQuery.data.results.map((el) => (
                  <ListGroupItem
                    key={el.id}
                    active={scheda === el.nome}
                    onClick={() => setScheda(el.id)}
                    className="flex justify-between"
                  >
                    <div className="text-center w-[90%]">{el.nome}</div>
                    <div className="w-[10%] border-l pl-2">
                      {certificatiQuery.data.results?.map(r => r.scheda_controllo)?.includes(el.id) ? (
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
        </Container>
      </Wrapper>
    </PageContext>
  );
}

export default Certificato;
