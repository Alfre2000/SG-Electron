import React, { useState } from 'react'
import Navbar from "../components/Navbar/Navbar";
import Header from "../components/Header/Header";
import useCheckAuth from '../hooks/useCheckAuth';

function Wrapper({ children, defaultNav, title, navItems }) {
  useCheckAuth();
  const [navOpen, setNavOpen] = useState(defaultNav !== undefined ? defaultNav : true)
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  return (
    <>
      <Navbar menu={[...(navItems || [])]} navOpen={navOpen} />
      <div className="grow flex flex-col overflow-scroll max-h-screen">
        <Header toggleNavbar={toggleNavbar} title={title} />
        <div className="bg-gray-50 grow flex px-8 justify-center">
          {children}
        </div>
      </div>
    </>
  )
}

export default Wrapper