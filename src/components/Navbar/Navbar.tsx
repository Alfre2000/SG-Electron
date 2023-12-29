import { Link } from "react-router-dom";
import "./Navbar.css";
import Menu from "./Menu";
import { PROGRAMMI } from "../../programmi";
import { IconDefinition, faComputer } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../../contexts/UserContext";
import Icona from "../../images/icona.png";


export type LinkType = {
  name: string;
  link?: string;
  action?: () => void
};

export type MenuType = {
  title: string;
  icon: IconDefinition;
  links: LinkType[];
};

type NavbarProps = {
  menu: MenuType[];
  navOpen: boolean;
};

function Navbar({ menu, navOpen }: NavbarProps) {
  const userContext = useUserContext();
  if (!userContext) return null;
  const { user } = userContext;

  const copyright = navOpen ? "Copyright" : "©";
  const versione = navOpen ? "Versione Software" : "Versione";

  // Se c'è più di un programma aggiungi il dropdown dei programmi e la possibilità di tornare alla homepage
  if (user.user && user.user.programmi?.length > 1) {
    const links = user.user.programmi
      ? user.user.programmi.map((el) => PROGRAMMI[el])
      : [];
    menu.unshift({
      title: "Programmi",
      icon: faComputer,
      links: [{ name: "HomePage", link: "/" }, ...links],
    });
  }
  const bgClass = process.env.NODE_ENV === "development" ? "bg-nav-lightblue" : "bg-nav-blue";
  return (
    <div
      id="navbar"
      className={`${bgClass} min-h-screen ${
        navOpen ? "" : "closed"
      } flex flex-col font-poppins text-white`}
      style={{ maxWidth: "15rem" }}
    >
      <Link to="/">
        <img src={Icona} alt="Icona SuperGalvanica" className="mx-auto mt-5" />
      </Link>
      <div id="navbar-content" className="px-2 mt-2">
        {menu.map((menu) => (
          <Menu {...menu} key={menu.title} navOpen={navOpen} />
        ))}
      </div>
      <div
        id="navbar-footer"
        className="text-center mt-auto mb-4 px-2 pt-4 text-xs"
      >
        {navOpen && <p className="text-base mb-1.5">SUPERGALVANICA S.R.L.</p>}
        {user.user && user.user.username && navOpen && (
          <p className="my-1.5 text-[14px]">
            Utente:{" "}
            {user.user.username.charAt(0).toUpperCase() +
              user.user.username.slice(1)}
          </p>
        )}
        <p className="my-1.5">
          {copyright} {new Date().getFullYear()}
        </p>
        <p className="mt-1.5">
          {versione}: {process.env.REACT_APP_VERSION}
        </p>
      </div>
    </div>
  );
}

export default Navbar;
