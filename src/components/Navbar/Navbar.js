import React from 'react'
import Icona from "./../../images/icona.png";
import './Navbar.css'
import Menu from './subcomponents/Menu';

function Navbar({ menu, navOpen }) {
  const copyright = navOpen ? "Copyright" : "©"
  const versione = navOpen ? "Versione Software" : "Versione"
  return (
    <div id="navbar" className={`bg-nav-blue min-h-screen ${navOpen ? "" : "closed"} flex flex-col font-poppins text-white`} style={{maxWidth: "15rem"}}>
        <a href="/">
          <img src={Icona} alt="Icona SuperGalvanica" className="mx-auto mt-5" />
        </a>
        <div id="navbar-content" className="px-2 mt-2">
            {menu.map(menu => <Menu {...menu} key={menu.title} navOpen={navOpen} />)}
        </div>
        <div id="navbar-footer" className="text-center mt-auto mb-4 px-2 pt-4 text-xs">
            {navOpen && <p className="text-base mb-1.5">SUPERGALVANICA S.R.L.</p>}
            <p className="my-1.5">{copyright} {new Date().getFullYear()}</p>
            <p className="mt-1.5">{versione}: {process.env.REACT_APP_VERSION}</p>
        </div>
    </div>
  )
}

export default Navbar