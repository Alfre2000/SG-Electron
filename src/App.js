import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import { useReducer } from "react";
import RecordLavorazioneOssido from "./pages/GestioneImpianto/RecordLavorazioneOssido/RecordLavorazioneOssido";
import Analisi from "./pages/GestioneImpianto/Analisi/Analisi";
import Fissaggio from "./pages/GestioneImpianto/Fissaggio/Fissaggio";
import Manutenzione from "./pages/GestioneImpianto/Manutenzione/Manutenzione";
import Prossime from "./pages/GestioneImpianto/Prossime/Prossime";
import RecordLavorazione from "./pages/GestioneImpianto/RecordLavorazione/RecordLavorazione";
import SelezioneImpianto from "./pages/GestioneImpianto/SelezioneImpianto/SelezioneImpianto";
import SchedaControllo from "./pages/AreaAdmin/SchedaControllo/SchedaControllo";
import Articolo from "./pages/AreaAdmin/Articolo/Articolo";
import LavorazioniInSospeso from "./pages/GestioneImpianto/LavorazioniInSospeso/LavorazioniInSospeso";
import RecordSchedaImpianto from "./pages/GestioneImpianto/RecordSchedaImpianto/RecordSchedaImpianto";
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
import FocusCliente from "./pages/AndamentoProduzione/FocusCliente/FocusCliente";
import MappaClienti from "@pages/AndamentoProduzione/MappaClienti/MappaClienti";
import Impianti from "@pages/AndamentoProduzione/Impianti/Impianti";

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
              <Route path="schede-sicurezza/" element={<VisualizzaDocumenti directory="Schede Sicurezza" />}></Route>
              <Route path="istruzioni-sicurezza/" element={<VisualizzaDocumenti directory="Istruzioni operative della sicurezza" />}></Route>
              <Route path="schede-tecniche/" element={<VisualizzaDocumenti directory="Schede tecniche" />}></Route>
              <Route path="controlli-finali/" element={<VisualizzaDocumenti directory="Istruzioni Controlli Finali" />}></Route>
              <Route path="richiesta-correzione-bagno/:richiestaID/" element={<CorrezioneBagno />}></Route>
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
            </Route>
            {/* Andamento Produzione */}
            <Route path="andamento-produzione/">
              <Route path="dashboards/" element={<Dashboards />}></Route>
              <Route path="focus-cliente/" element={<SelezioneCliente />}></Route>
              <Route path="focus-cliente/:cliente" element={<FocusCliente />}></Route>
              <Route path="mappa-clienti/" element={<MappaClienti />}></Route>
              <Route path="impianti/" element={<Impianti />}></Route>
            </Route>
            {/* Database Documenti */}
            <Route path="documenti/">
              <Route path="gestisci/" element={<GestisciDocumenti />}></Route>
              <Route path="visualizza/" element={<VisualizzaDocumenti />}></Route>
            </Route>
            {/* Correzione Bagni */}
            <Route path="correzione-bagni/">
              <Route path="gestisci-richieste/" element={<NuovaRichiesta />}></Route>
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
