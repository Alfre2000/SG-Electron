import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ManutenzioneRobot from "./pages/ManutenzioneRobot";
import Login from "./pages/Login";
import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";


function App() {
  const [success, setSuccess] = useState(false)
  const loginSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000)
  }
  return (
    <div className="flex" style={{userSelect: "none"}}>
       <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="login/" element={<Login afterLogin={loginSuccess} />}></Route>
          <Route path="robot/" element={<ManutenzioneRobot />}></Route>
        </Routes>
      </HashRouter>
      {success && (
        <ToastContainer position="bottom-end" className="p-2">
          <Toast className="bg-[#457b3b] text-center text-white w-80">
            <Toast.Body><FontAwesomeIcon size="lg" className="mr-3" icon={faCheck} />Login avvenuto con successo !</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </div>
  );
}

export default App;
