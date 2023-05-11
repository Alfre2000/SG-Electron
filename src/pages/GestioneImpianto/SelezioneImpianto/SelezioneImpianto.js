import React, { useState } from "react";
import { Alert, Container, ListGroup } from "react-bootstrap";
import Wrapper from "../Wrapper";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import { findElementFromID } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../UserContext";
import { useEffect } from "react";

function SelezioneImpianto() {
  let navigate = useNavigate();
  const [impiantoID, setImpiantoID] = useState("");
  const { user, setUser } = useUserContext();
  const [data] = useGetAPIData([{ nome: "impianti", url: URLS.IMPIANTI }]);

  const handelSelection = (event) => {
    const id = parseInt(event.target.id);
    setImpiantoID(id);
    const impianto = findElementFromID(id, data.impianti);
    setUser({ ...user, user: { ...user.user, impianto: impianto } });
    setTimeout(() => navigate("/manutenzione/record-lavorazione/"), 150);
  };

  // Se l'utente ha già un'impianto selezionato rimanda alla pagina record lavorazione
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"))
    if (user?.user?.impianto && userData?.user?.impianto && !impiantoID) {
      navigate("/manutenzione/record-lavorazione/");
    }
  }, [navigate, user?.user?.impianto, impiantoID]);
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Selezione Impianto</PageTitle>
        <Alert
          variant="info"
          className="w-3/5 mx-auto mt-12 py-2 bg-slate-200 border-slate-300"
        >
          Seleziona l'impianto che desideri impersonare per utilizzare il
          programma di gestione degli impianti.
        </Alert>
        <ListGroup className="cursor-pointer w-1/2 mx-auto mt-8">
          {data.impianti &&
            data.impianti.map((impianto) => (
              <ListGroup.Item
                active={impianto.id === impiantoID}
                key={impianto.id}
                onClick={handelSelection}
                id={impianto.id}
              >
                {impianto.nome}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Container>
    </Wrapper>
  );
}

export default SelezioneImpianto;
