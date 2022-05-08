import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../../UserContext';
import Icona from "./../../images/icona.png";
import './Navbar.css'
import Menu from './subcomponents/Menu';

function Navbar({ menu, navOpen }) {
  const { user } = useContext(UserContext)
  const copyright = navOpen ? "Copyright" : "©"
  const versione = navOpen ? "Versione Software" : "Versione"
  return (
    <div id="navbar" className={`bg-nav-blue min-h-screen ${navOpen ? "" : "closed"} flex flex-col font-poppins text-white`} style={{maxWidth: "15rem"}}>
        <Link to="/">
          <img src={Icona} alt="Icona SuperGalvanica" className="mx-auto mt-5" />
        </Link>
        <div id="navbar-content" className="px-2 mt-2">
            {menu.map(menu => <Menu {...menu} key={menu.title} navOpen={navOpen} />)}
        </div>
        <div id="navbar-footer" className="text-center mt-auto mb-4 px-2 pt-4 text-xs">
            {navOpen && <p className="text-base mb-1.5">SUPERGALVANICA S.R.L.</p>}
            {user.user && user.user.username && navOpen && <p className="my-1.5 text-[14px]">Utente: {user.user.username.charAt(0).toUpperCase() + user.user.username.slice(1)}</p>}
            <p className="my-1.5">{copyright} {new Date().getFullYear()}</p>
            <p className="mt-1.5">{versione}: {process.env.REACT_APP_VERSION}</p>
        </div>
    </div>
  )
}

export default Navbar