import React, { useState } from 'react'
import Navbar from "../../../components/Navbar/Navbar";
import Header from "../../../components/Header/Header";
import useCheckAuth from '../../../hooks/useCheckAuth';
import { NAVBAR_ITEMS } from '../navbar';

function Wrapper({ children, defaultNav }) {
  useCheckAuth();
  const [navOpen, setNavOpen] = useState(defaultNav !== undefined ? defaultNav : true)
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  const navbar = [...NAVBAR_ITEMS]
  return (
    <>
      <Navbar menu={navbar} navOpen={navOpen} />
      <div className="grow flex flex-col overflow-scroll max-h-screen">
        <Header toggleNavbar={toggleNavbar} title="Analisi e Manutenzioni" />
        <div className="bg-gray-50 grow flex px-8 justify-center">
          {children}
        </div>
      </div>
    </>
  )
}

export default Wrapper