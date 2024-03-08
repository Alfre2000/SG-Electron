import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import useCheckAuth from "../../hooks/useCheckAuth/useCheckAuth";
import { useGetNavItems, useGetTitle } from "navbar.config";

type WrapperProps = {
  children: React.ReactNode;
  defaultNav?: boolean;
};

function Wrapper({ children, defaultNav = true }: WrapperProps) {
  const items = useGetNavItems();
  const title = useGetTitle();
  const pendingAuth = useCheckAuth();
  const [navOpen, setNavOpen] = useState(defaultNav);
  const toggleNavbar = () => {
    setNavOpen(!navOpen);
  };
  return (
    <>
      <Navbar menu={items} navOpen={navOpen} />
      <div className="grow flex flex-col overflow-scroll max-h-screen" id="page">
        <Header toggleNavbar={toggleNavbar} title={title} />
        <div className="bg-gray-50 grow flex px-8 justify-center">{!pendingAuth && children}</div>
      </div>
    </>
  );
}

export default Wrapper;
