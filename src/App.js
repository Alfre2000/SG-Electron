import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { faComputer, faUserPlus, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import Header from "./components/Header/Header";
import { useState } from "react";
import Card from "./components/Card/Card";
import Budget from "./images/budget.png";
import Evaluation from "./images/evaluation.png";
import Inventory from "./images/inventory.png";
import WorkInProgress from "./images/work-in-progress.png";

function App() {
  const [navOpen, setNavOpen] = useState(true)
  const navbar = [
    { title: "Programmi", icon: faComputer, links: [
      {name: 'Gestione Inventario', link: '#'},
      {name: 'Analisi e Manutenzioni', link: '#'},
      {name: 'Gestione Preventivi', link: '#'},
      {name: 'Programma 4', link: '#'},
      {name: 'Programma 5', link: '#'},
      {name: 'Programma 6', link: '#'},
    ]},
    { title: "Admin", icon: faUserPlus, links: [
      {name: 'Pannello Amministratore', link: '#'},
      {name: 'Riepilogo Programmi', link: '#'},
      {name: 'Analisi Anomalie', link: '#'},
    ] },
    { title: "Assistenza", icon: faBookOpen, links: [
      {name: "Email all'Assistenza", link: '#'},
      {name: 'Invia Screenshot', link: '#'},
    ] },
  ];
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  return (
    <div className="flex" style={{userSelect: "none"}}>
      <Navbar menu={navbar} navOpen={navOpen}></Navbar>
      <div className="grow flex flex-col">
        <Header toggleNavbar={toggleNavbar} />
        <div className="bg-gray-50 grow flex">
          <div className="flex flex-wrap gap-y-16 gap-x-24 justify-center m-auto p-10"> 
            <Card title="Gestione Inventario" icon={Inventory} link="#" />
            <Card title="Analisi e Manutenzioni" icon={Evaluation} link="#" />
            <Card title="Gestione Preventivi" icon={Budget} link="#" />
            <Card title="Programma 4" icon={WorkInProgress} link="#" />
            <Card title="Programma 5" icon={WorkInProgress} link="#" />
            <Card title="Programma 6" icon={WorkInProgress} link="#" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
