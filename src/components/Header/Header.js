import {
  faBars,
  faExpand,
  faPrint,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/users";
import useOutsideAlerter from "../../hooks/useOutsideAlerter/useOutsideAlerter";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./Header.css";
import { UserContext } from "../../contexts/UserContext";
const electron = window?.require ? window.require("electron") : null;

function Header({ title, toggleNavbar }) {
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [userOpen, setUserOpen] = useState(false);
  const setFullScreen = () => {
    electron.ipcRenderer.invoke("toggle-fullscreen");
  };
  const saveScreenShot = () => {
    electron.ipcRenderer.invoke("save-schreenshot");
  };
  const dropdownRef = useRef(null);
  useOutsideAlerter(dropdownRef, (e) => {
    if (userOpen) {
      setUserOpen(null);
    }
  });
  const handleLogout = (e) => {
    e.preventDefault();
    setUserOpen(null);
    logout().then((data) => {
      setUser({});
      navigate("/login", { from: "/" });
    });
  };
  const bgClass = process.env.NODE_ENV === "development" ? "bg-nav-lightblue" : "bg-nav-blue";
  return (
    <Navbar id="sg-header" className={bgClass}>
      <Container className="mx-12">
        <Nav>
          <Nav.Link className="px-4 text-white" onClick={toggleNavbar}>
            <FontAwesomeIcon size="lg" icon={faBars} data-testid="toggle-nav" />
          </Nav.Link>
          <Nav.Link className="px-4 text-white mr-8" onClick={setFullScreen}>
            <FontAwesomeIcon size="lg" icon={faExpand} />
          </Nav.Link>
        </Nav>
        <h1 className="font-roboto text-white font-normal text-center m-0 text-[2.125rem]">
          {title}
        </h1>
        <Nav>
          <Nav.Link className="px-4 text-white" onClick={saveScreenShot}>
            <FontAwesomeIcon size="lg" icon={faPrint} />
          </Nav.Link>
          <NavDropdown
            className="px-4 text-white"
            title={
              <FontAwesomeIcon data-testid="dropdown" className="text-white" size="lg" icon={faUser} />
            }
          >
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            {user.user && user.user.is_staff && (
              <NavDropdown.Item
                onClick={() => electron.ipcRenderer.invoke("open-admin")}
              >
                Area Admin
              </NavDropdown.Item>
            )}
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
