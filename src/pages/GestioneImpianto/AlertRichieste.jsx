import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import "@components/Header/Header.css";
import useImpiantoQuery from "@hooks/useImpiantoQuery/useImpiantoQuery";
import { URLS } from "urls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "react-bootstrap";
const electron = window?.require ? window.require("electron") : null;

function AlertRichieste() {
  const bgClass = process.env.NODE_ENV === "development" ? "bg-[#8e2626]" : "bg-[#8e2626]";
  const richiesteQuery = useImpiantoQuery({ queryKey: [URLS.RICHIESTE_CORREZIONE_BAGNO, { eseguita: "false" }] });
  const handleView = () => {
    if (!richiesteQuery.data.results.length > 0) return;
    electron.ipcRenderer.invoke("alert-visualizza-richiesta", richiesteQuery.data.results[0].id);
  };
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar id="sg-header" className={`w-full ${bgClass}`}>
        <Container className="mx-12">
          <Nav></Nav>
          <h1 className="font-roboto text-white font-normal text-center m-0 text-[2rem]">
            Richiesta Correzione Bagno
          </h1>
          <Nav></Nav>
        </Container>
      </Navbar>
      <div className="flex items-center justify-center flex-grow">
        <Alert variant="danger" className="py-2 px-6 text-center flex justify-between items-center w-2/3">
          <span>Visualizza la richiesta di correzione bagno</span>
          <FontAwesomeIcon icon={faArrowCircleRight} size="xl" className="text-[#8e2626] cursor-pointer" onClick={handleView}/>
        </Alert>
      </div>
    </div>
  );
}

export default AlertRichieste;
