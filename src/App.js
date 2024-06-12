import "./App.css";
import { HashRouter, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import { useEffect, useReducer } from "react";
import RecordLavorazioneOssido from "./pages/GestioneImpianto/RecordLavorazioneOssido/RecordLavorazioneOssido";
import Analisi from "./pages/GestioneImpianto/Analisi/Analisi";
import Fissaggio from "./pages/GestioneImpianto/Fissaggio/Fissaggio";
import Manutenzione from "./pages/GestioneImpianto/Manutenzione/Manutenzione";
import Prossime from "./pages/GestioneImpianto/Prossime/Prossime";
import RecordLavorazione from "./pages/GestioneImpianto/RecordLavorazione/RecordLavorazione";
import SelezioneImpianto from "./pages/GestioneImpianto/SelezioneImpianto/SelezioneImpianto";
import ListaCorrezioniBagno from "./pages/GestioneImpianto/ListaCorrezioniBagno/ListaCorrezioniBagno";
import SchedaControllo from "./pages/AreaAdmin/SchedaControllo/SchedaControllo";
import Articolo from "./pages/AreaAdmin/Articolo/Articolo";
import LavorazioniInSospeso from "./pages/GestioneImpianto/LavorazioniInSospeso/LavorazioniInSospeso";
import RecordSchedaImpianto from "./pages/GestioneImpianto/RecordSchedaImpianto/RecordSchedaImpianto";
import AlertRichieste from "./pages/GestioneImpianto/AlertRichieste";
import CorrezioneBagno from "./pages/GestioneImpianto/CorrezioneBagno/CorrezioneBagno";
import VisualizzaDocumenti from "./pages/DatabaseDocumenti/VisualizzaDocumenti/VisualizzaDocumenti";
import SchedaImpianto from "./pages/AreaAdmin/SchedaImpianto/SchedaImpianto";
import GestisciDocumenti from "./pages/DatabaseDocumenti/GestisciDocumenti/GestisciDocumenti";
import NuovaRichiesta from "./pages/CorrezioneBagni/GestisciRichieste/GestisciRichieste";
import AdminAnalisi from "./pages/AreaAdmin/Analisi/Analisi";
import AdminManutenzione from "./pages/AreaAdmin/Manutenzione/Manutenzione";
import Cliente from "./pages/AreaAdmin/Cliente/Cliente";
import Operatore from "./pages/AreaAdmin/Operatore/Operatore";
import Certificato from "./pages/CertificatiQualità/Certificato/Certificato";
import CertificatiBolla from "./pages/CertificatiQualità/CertificatiBolla/CertificatiBolla";
import EtichetteMTA from "./pages/CertificatiQualità/EtichetteMTA/EtichetteMTA";
import Dashboards from "./pages/AndamentoProduzione/Dashboards/Dashboards";
import { QueryClient, QueryClientProvider } from "react-query";
import { defaultQueryFn } from "./api/queryFn";
import { Toaster, toast } from 'sonner';
import { UserContext } from "./contexts/UserContext";
import SelezioneCliente from "./pages/AndamentoProduzione/FocusCliente/SelezioneCliente";
import DatabaseCertificati from "./pages/CertificatiQualità/DatabaseCertificati/DatabaseCertificati";
import VerificaPrezzi from "./pages/CertificatiQualità/VerificaPrezzi/VerificaPrezzi";
import TaraturaStrumenti from "./pages/CertificatiQualità/TaraturaStrumenti/TaraturaStrumenti";
import FocusCliente from "./pages/AndamentoProduzione/FocusCliente/FocusCliente";
import MappaClienti from "@pages/AndamentoProduzione/MappaClienti/MappaClienti";
import Impianti from "@pages/AndamentoProduzione/Impianti/Impianti";
import VersioniProgramma from "@pages/Developer/VersioniProgramma/VersioniProgramma";
import Utilizzo from "@pages/Developer/Utilizzo/Utilizzo";
import Wrapper from "@ui/wrapper/Wrapper";
import InserimentoLotti from "@pages/AndamentoProduzione/InserimentoLotti/InserimentoLotti";
import Prelievo from "@pages/Magazzino/Prelievo/Prelievo";
import StatusMagazzino from "@pages/AndamentoProduzione/StatusMagazzino/StatusMagazzino";
import Giacenza from "@pages/Magazzino/Giacenza/Giacenza";
import Home from "@pages/Magazzino/Home/Home";
const electron = window?.require ? window.require("electron") : null;

function reducer (state, userInfo) {
  return userInfo
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60, // 60 seconds
    },
  },
})

const RouteWrapper = () => (
  <Wrapper>
    <div className="my-10 lg:mx-2 xl:mx-6 2xl:mx-12 w-full relative">
      <Outlet />
    </div>
  </Wrapper>
)

function App() {
  const userData = JSON.parse(localStorage.getItem("user")) || {}
  const [user, setUser] = useReducer(reducer, userData)
  const loginSuccess = () => {
    toast.success("Login avvenuto con successo !")
  }
  return (
    <QueryClientProvider client={queryClient}>
    <UserContext.Provider value={{ user, setUser}}>
      <div className="flex" style={{userSelect: "none"}}>
        <HashRouter>
          <Routes>
          <Route element={<ElectronWrapper />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="login/" element={<Login afterLogin={loginSuccess} />}></Route>
            {/* Gestione Impianto */}
            <Route path="manutenzione/">
              <Route path="analisi/" element={<Analisi />}></Route>
              <Route path="fissaggio/" element={<Fissaggio />}></Route>
              <Route path="manutenzioni/" element={<Manutenzione />}></Route>
              <Route path="prossime/" element={<Prossime />}></Route>
              <Route path="record-lavorazione/" element={<RecordLavorazione />}></Route>
              <Route path="record-lavorazione-ossido/" element={<RecordLavorazioneOssido />}></Route>
              <Route path="record-lavorazione-in-sospeso/" element={<LavorazioniInSospeso />}></Route>
              <Route path="selezione-impianto/" element={<SelezioneImpianto />}></Route>
              <Route path="record-scheda-impianto/" element={<RecordSchedaImpianto />}></Route>
              <Route element={<RouteWrapper />}>
                <Route path="visualizza/" element={<VisualizzaDocumenti />}></Route>
              </Route>
              <Route path="richiesta-correzione-bagno/:richiestaID/" element={<CorrezioneBagno />}></Route>
              <Route path="alert-richieste/" element={<AlertRichieste />}></Route>
              <Route path="lista-correzioni-bagno/" element={<ListaCorrezioniBagno />}></Route>
            </Route>
            {/* Area Admin */}
            <Route path="area-admin/">
              <Route path="scheda-controllo/" element={<SchedaControllo />}></Route>
              <Route path="articolo/" element={<Articolo />}></Route>
              <Route path="scheda-impianto/" element={<SchedaImpianto />}></Route>
              <Route path="analisi/" element={<AdminAnalisi />}></Route>
              <Route path="manutenzione/" element={<AdminManutenzione />}></Route>
              <Route path="cliente/" element={<Cliente />}></Route>
              <Route path="operatore/" element={<Operatore />}></Route>
              <Route path="certificato/" element={<Certificato />}></Route>
            </Route>
            {/* Certificati Qualità */}
            <Route path="certificati-qualita/">
              <Route path="record-certificato/" element={<CertificatiBolla />}></Route>
              <Route path="certificato/" element={<Certificato />}></Route>
              <Route path="etichette-mta/" element={<EtichetteMTA />}></Route>
              <Route path="database-certificati/" element={<DatabaseCertificati />}></Route>
              <Route path="verifica-prezzi/" element={<VerificaPrezzi />}></Route>
              <Route element={<RouteWrapper />}>
                {/* <Route path="taratura-strumenti/" element={<TaraturaStrumenti />}></Route> */}
              </Route>
            </Route>
            {/* Andamento Produzione */}
            <Route path="andamento-produzione/">
              <Route path="dashboards/" element={<Dashboards />}></Route>
              <Route path="focus-cliente/" element={<SelezioneCliente />}></Route>
              <Route path="focus-cliente/:cliente" element={<FocusCliente />}></Route>
              <Route path="mappa-clienti/" element={<MappaClienti />}></Route>
              <Route path="impianti/" element={<Impianti />}></Route>
              <Route path="inserimento-lotti/" element={<InserimentoLotti />}></Route>
              <Route element={<RouteWrapper />}>
                <Route path="status-magazzino/" element={<StatusMagazzino />}></Route>
              </Route>
            </Route>
            {/* Database Documenti */}
            <Route path="documenti/"  element={<RouteWrapper />}>
              <Route path="gestisci/" element={<GestisciDocumenti />}></Route>
              <Route path="visualizza/" element={<VisualizzaDocumenti />}></Route>
            </Route>
            {/* Correzione Bagni */}
            <Route path="correzione-bagni/" element={<RouteWrapper />}>
              <Route path="gestisci-richieste/" element={<NuovaRichiesta />}></Route>
            </Route>
            {/* Developer */}
            <Route path="developer/" element={<RouteWrapper />}>
              <Route path="versioni-programma/" element={<VersioniProgramma />}></Route>
              <Route path="utilizzo/" element={<Utilizzo />}></Route>
            </Route>
            {/* Developer */}
            <Route path="magazzino/" element={<RouteWrapper />}>
              <Route path="home/" element={<Home />}></Route>
              <Route path="prelievo/" element={<Prelievo />}></Route>
              <Route path="giacenza/" element={<Giacenza />}></Route>
            </Route>
            </Route>
          </Routes>
        </HashRouter>
      </div>
      <Toaster richColors />
    </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;


const ElectronWrapper = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleGetUser = (event) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Sending user", user);
      electron.ipcRenderer.send('send-user', user);
    };
    const handleAlertVisualizzaRichiesta = (event, richiestaID) => {
      navigate(`/manutenzione/richiesta-correzione-bagno/${richiestaID}`);
    }
    const handleGoToPage = (event, page) => {
      navigate(page);
    }
    electron.ipcRenderer.on('get-user', handleGetUser);
    electron.ipcRenderer.on('go-to-richiesta', handleAlertVisualizzaRichiesta);
    electron.ipcRenderer.on('go-to-page', handleGoToPage);
    return () => {
      electron.ipcRenderer.removeListener('get-user', handleGetUser);
      electron.ipcRenderer.removeListener('go-to-richiesta', handleAlertVisualizzaRichiesta);
      electron.ipcRenderer.removeListener('go-to-page', handleGoToPage);
    };
  }, [navigate]);
  return <Outlet />
}