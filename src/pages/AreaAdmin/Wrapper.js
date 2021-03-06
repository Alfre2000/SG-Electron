import React, { useContext, useState } from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import useCheckAuth from '../../hooks/useCheckAuth/useCheckAuth';
import { getNavItems } from './navbar';
import UserContext from '../../UserContext';

function Wrapper({ children, defaultNav }) {
  const pendingAuth = useCheckAuth();
  const [navOpen, setNavOpen] = useState(defaultNav !== undefined ? defaultNav : true)
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  const { user } = useContext(UserContext)
  const navItems = getNavItems(user.user)
  const title = "Area Admin"
  return (
    <>
      <Navbar menu={[...navItems]} navOpen={navOpen} />
      <div className="grow flex flex-col overflow-scroll max-h-screen">
        <Header toggleNavbar={toggleNavbar} title={title} />
        <div className="bg-gray-50 grow flex px-8 justify-center">
          {!pendingAuth && children}
        </div>
      </div>
    </>
  )
}

export default Wrapper