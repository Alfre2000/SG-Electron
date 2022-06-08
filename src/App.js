import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import { useReducer, useState } from "react";
import SchedaControlloOssido from "./pages/Analisi e Manutenzioni/SchedaControlloOssido/SchedaControlloOssido";
import Analisi from "./pages/Analisi e Manutenzioni/Analisi/Analisi";
import Fissaggio from "./pages/Analisi e Manutenzioni/Fissaggio/Fissaggio";
import Manutenzione from "./pages/Analisi e Manutenzioni/Manutenzione/Manutenzione";
import Prossime from "./pages/Analisi e Manutenzioni/Prossime/Prossime";
import Produzione from "./pages/Analisi e Manutenzioni/Produzione/Produzione";
import UserContext from "./UserContext";
import MyToast from "./components/MyToast/MyToast";
import RicercaDatabase from "./pages/Analisi e Manutenzioni/RicercaDatabase/RicercaDatabase";
import SchedaControllo from "./pages/Analisi e Manutenzioni/SchedaControllo/SchedaControllo";
import SelezioneImpianto from "./pages/Analisi e Manutenzioni/SelezioneImpianto/SelezioneImpianto";

function reducer (state, userInfo) {
  return userInfo
}

function App() {
  const userData = JSON.parse(localStorage.getItem("user")) || {}
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useReducer(reducer, userData)
  const impianto = user?.user?.impianto || null
  const loginSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000)
  }
  console.log(impianto);
  return (
    <UserContext.Provider value={{ user, setUser}}>
      <div className="flex" style={{userSelect: "none"}}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="login/" element={<Login afterLogin={loginSuccess} />}></Route>
            {/* Analisi e Manutenzioni */}
            <Route path="manutenzione/">
              <Route path="analisi/" element={<Analisi />}></Route>
              <Route path="fissaggio/" element={<Fissaggio />}></Route>
              <Route path="manutenzioni/" element={<Manutenzione />}></Route>
              <Route path="prossime/" element={<Prossime />}></Route>
              <Route path="produzione/" element={<Produzione />}></Route>
              <Route path="ricerca/" element={<RicercaDatabase />}></Route>
              <Route path="scheda/" 
                element={impianto?.nome.toLowerCase().includes('ossido')
                  ? <SchedaControlloOssido /> 
                  : <SchedaControllo />
                }>
              </Route>
              <Route path="selezione-impianto/" element={<SelezioneImpianto />}></Route>
            </Route>
          </Routes>
        </HashRouter>
        {success && (
          <MyToast>Login avvenuto con successo !</MyToast>
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
