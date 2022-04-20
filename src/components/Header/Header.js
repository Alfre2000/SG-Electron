import { faBars, faExpand, faPrint, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
const electron = window.require('electron');

function Header(props) {
  const setFullScreen = () => {
    electron.ipcRenderer.invoke('toggle-fullscreen')
  }
  const saveScreenShot = () => {
    electron.ipcRenderer.invoke('save-schreenshot')
  }
  return (
    <div className="h-20 bg-gray-200 flex flex-row items-center gap-10 px-20 text-center">
        <div className="hover:bg-gray-400 p-3 rounded-md cursor-pointer" onClick={props.toggleNavbar}>
            <FontAwesomeIcon icon={faBars} size="xl" />
            </div>
        <div className="hover:bg-gray-400 p-3 rounded-md cursor-pointer" onClick={setFullScreen}>
            <FontAwesomeIcon icon={faExpand} size="xl" />
        </div>
        <div className="grow text-nav-blue font-semibold text-4xl"><span className="text-6xl">S</span><span>UPER</span><span className="text-6xl">G</span><span>ALVANICA</span></div>
        <div className="hover:bg-gray-400 p-3 rounded-md cursor-pointer">
            <FontAwesomeIcon icon={faPrint} size="xl" onClick={saveScreenShot}/>
        </div>
        <div className="hover:bg-gray-400 p-3 rounded-md cursor-pointer">
            <FontAwesomeIcon icon={faUser} size="xl" />
        </div>
    </div>
  )
}

export default Header