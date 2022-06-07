import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import { useReducer, useState } from "react";
import SchedaControlloOssido from "./pages/Analisi e Manutenzioni/SchedaControllo/SchedaControllo";
import Analisi from "./pages/Analisi e Manutenzioni/Analisi/Analisi";
import Fissaggio from "./pages/Analisi e Manutenzioni/Fissaggio/Fissaggio";
import Manutenzione from "./pages/Analisi e Manutenzioni/Manutenzione/Manutenzione";
import Prossime from "./pages/Analisi e Manutenzioni/Prossime/Prossime";
import Produzione from "./pages/Analisi e Manutenzioni/Produzione/Produzione";
import UserContext from "./UserContext";
import MyToast from "./components/MyToast/MyToast";
import RicercaDatabase from "./pages/Analisi e Manutenzioni/RicercaDatabase/RicercaDatabase";
import SchedaControllo from "./pages/SchedaControllo/SchedaControllo/SchedaControllo";


function reducer (state, userInfo) {
  return userInfo
}

function App() {
  const userData = JSON.parse(localStorage.getItem("user")) || {}
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useReducer(reducer, userData)
  const loginSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000)
  }
  return (
    <UserContext.Provider value={{ user, setUser}}>
      <div className="flex" style={{userSelect: "none"}}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="login/" element={<Login afterLogin={loginSuccess} />}></Route>
            {/* Analisi e Manutenzioni */}
            <Route path="manutenzione/scheda/" element={<SchedaControlloOssido />}></Route>
            <Route path="manutenzione/analisi/" element={<Analisi />}></Route>
            <Route path="manutenzione/fissaggio/" element={<Fissaggio />}></Route>
            <Route path="manutenzione/manutenzioni/" element={<Manutenzione />}></Route>
            <Route path="manutenzione/prossime/" element={<Prossime />}></Route>
            <Route path="manutenzione/produzione/" element={<Produzione />}></Route>
            <Route path="manutenzione/ricerca/" element={<RicercaDatabase />}></Route>
            {/* Scheda Controllo */}
            <Route path="scheda-controllo/" element={<SchedaControllo />}></Route>
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
