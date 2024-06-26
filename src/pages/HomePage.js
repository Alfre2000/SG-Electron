import React, { useContext, useEffect, useState } from 'react'
import Card from "./../components/Card/Card";
import Navbar from "./../components/Navbar/Navbar";
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import Header from "./../components/Header/Header";
import { PROGRAMMI } from '../programmi';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
const electron = window.require('electron');

function HomePage(props) {
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext)
  const [navOpen, setNavOpen] = useState(true)
  const [programmi, setProgrammi] = useState([])
  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user"))
    if (!userStorage) {
      navigate('/login')
      return
    } else if (!userStorage.user.hasOwnProperty('impianto')) {
      setUser({...user, user: {...user.user, impianto: null}})
    }
    const programs =  user.user.programmi ? user.user.programmi.map(el => PROGRAMMI[el]) : []
    setProgrammi(programs)
    if (programs.length === 1) {
      navigate(programs[0].link);
    }
  }, [navigate, user, setUser])
  const navbar = [];
  if (user.user && user.user.is_staff) {
    navbar.push({ title: "Admin", icon: faUserPlus, links: [
      {name: 'Pannello Amministratore', action: () => electron.ipcRenderer.invoke('open-admin')},
    ]})
  }

  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  return (
    <>
      <Navbar menu={navbar} navOpen={navOpen}></Navbar>
      <div className="grow flex flex-col">
        <Header toggleNavbar={toggleNavbar} title="HomePage" />
        <div className="bg-gray-50 grow flex">
          <div className="flex flex-wrap gap-y-16 gap-x-24 2xl:gap-x-40 justify-center m-auto p-10">
            {programmi && programmi.filter(p => !!p).map(programma => (
                <Card key={programma.name} title={programma.name} icon={programma.icon} link={programma.link} alertEndpoint={programma.alertEndpoint} />
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage