import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ManutenzioneRobot from "./pages/ManutenzioneRobot";
import Login from "./pages/Login";


function App() {
  return (
    <div className="flex" style={{userSelect: "none"}}>
       <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="login/" element={<Login />}></Route>
          <Route path="robot/" element={<ManutenzioneRobot />}></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
