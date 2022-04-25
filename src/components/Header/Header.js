import { faBars, faCircleInfo, faExpand, faPowerOff, faPrint, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/users';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import './Header.css'
const electron = window.require('electron');

function Header(props) {
  let navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false)
  const setFullScreen = () => {
    electron.ipcRenderer.invoke('toggle-fullscreen')
  }
  const saveScreenShot = () => {
    electron.ipcRenderer.invoke('save-schreenshot')
  }
  const dropdownRef = useRef(null);
  useOutsideAlerter(dropdownRef, (e) => {
    if (userOpen) {setUserOpen(false)};
  });
  const handleLogout = (e) => {
    e.preventDefault();
    logout().then(data => navigate('/login', { from: '/'}))
  }
  return (
    <header className="h-16 bg-gray-200 flex flex-row items-center gap-8 px-20 text-center">
        <div className="head-icon shadow-card p-2 px-2.5 rounded-md cursor-pointer" onClick={props.toggleNavbar}>
            <FontAwesomeIcon icon={faBars} size="xl" />
        </div>
        <div className="head-icon shadow-card p-2 px-2.5 rounded-md cursor-pointer" onClick={setFullScreen}>
            <FontAwesomeIcon icon={faExpand} size="xl" />
        </div>
        <div className="grow text-[#014690] font-semibold text-[33px] overflow-visible mx-[3%] lg:mx-[6%] xl:mx-[10%] mt-5 bg-gray-50 rounded-t-[1.3em] z-10 tracking-[3px] min-w-[5em] relative page-title" style={{ fontFamily: "'dm serif text',Sans-serif"}}><div className="relative top-2">{props.title}</div></div>
        <div className="head-icon shadow-card p-2 px-2.5 rounded-md cursor-pointer" onClick={saveScreenShot}>
            <FontAwesomeIcon icon={faPrint} size="xl"/>
        </div>
        <div ref={dropdownRef} className="head-icon shadow-card p-2 px-2.5 rounded-md cursor-pointer relative" onClick={() => setUserOpen(!userOpen)}>
            <FontAwesomeIcon icon={faUser} size="xl" />
            {userOpen && (
              <>
                <div className="absolute triangle-shape"></div>
                <ul className="absolute cursor-default top-12 bg-nav-blue text-sm rounded-md text-white w-max -left-[40px] p-3.5 text-left font-poppins bg-opacity-90">
                  <li className="mb-2"><a href="." className="relative"><FontAwesomeIcon icon={faCircleInfo} className="pr-2"/>Info Utente</a></li>
                  <li className="mt-2"><a href="."  onClick={handleLogout} className="relative"><FontAwesomeIcon icon={faPowerOff} className="pr-2"/>Logout</a></li>
                </ul>
              </>
            )}
        </div>
    </header>
  )
}

export default Header