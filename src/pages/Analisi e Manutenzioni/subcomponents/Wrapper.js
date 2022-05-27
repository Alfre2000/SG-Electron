import React, { useContext, useState } from 'react'
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import useCheckAuth from '../../../hooks/useCheckAuth';
import { faComputer, faClipboardCheck, faToolbox, faChartLine } from '@fortawesome/free-solid-svg-icons'
import UserContext from '../../../UserContext';
import { PROGRAMMI } from '../../../programmi';

function Wrapper({ children, defaultNav }) {
  useCheckAuth();
  const { user } = useContext(UserContext)
  const [navOpen, setNavOpen] = useState(defaultNav !== undefined ? defaultNav : true)
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  const navbar = [
    { title: "Scheda controllo", icon: faClipboardCheck, links: [
      {name: 'Nuova Scheda', link: '/manutenzione/scheda/'},
    ]},
    { title: "Manutenzioni", icon: faToolbox, links: [
        {name: 'Fissaggio', link: '/manutenzione/fissaggio/'},
        {name: 'Manutenzioni', link: '/manutenzione/manutenzioni/'},
        {name: 'Analisi', link: '/manutenzione/analisi/'},
    ]},
    { title: "Informazioni", icon: faChartLine, links: [
        {name: 'Prossime Manutenzioni', link: '/manutenzione/prossime/'},
        {name: 'Andamento Produzione', link: '/manutenzione/produzione/'},
    ]},
  ];
  if (user.user && user.user.programmi.length > 1) {
    const links = user.user.programmi ? user.user.programmi.map(el => PROGRAMMI[el]) : []
    navbar.unshift({ title: "Programmi", icon: faComputer, links: [
      {name: 'HomePage', link: '/'},
      ...links
    ]})
  }
  
  return (
    <>
      <Navbar menu={navbar} navOpen={navOpen} />
      <div className="grow flex flex-col">
        <Header toggleNavbar={toggleNavbar} title="Analisi e Manutenzioni" />
        <div className="bg-gray-50 grow flex px-8 justify-center">
          {children}
        </div>
      </div>
    </>
  )
}

export default Wrapper