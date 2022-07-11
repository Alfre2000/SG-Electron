import React, { useContext, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import useCheckAuth from "../../hooks/useCheckAuth/useCheckAuth";
import { getNavItems } from "./navbar";
import UserContext from "../../UserContext";
import useCheckImpianto from "../../hooks/useCheckImpianto/useCheckImpianto";

const Wrapper = React.forwardRef(({ children, defaultNav }, ref) => {
  const pendingAuth = useCheckAuth();
  const pendingImpianto = useCheckImpianto();
  const [navOpen, setNavOpen] = useState(
    defaultNav !== undefined ? defaultNav : true
  );
  const toggleNavbar = () => {
    setNavOpen(!navOpen);
  };
  const { user } = useContext(UserContext);
  const navItems = getNavItems(user.user);
  const title = `Gestione ${user?.user?.impianto?.nome || "Impianti"}`;
  return (
    <>
      <Navbar menu={[...navItems]} navOpen={navOpen} />
      <div
        className="grow flex flex-col overflow-scroll max-h-screen"
        ref={ref}
      >
        <Header toggleNavbar={toggleNavbar} title={title} />
        <div className="bg-gray-50 grow flex px-8 justify-center">
          {!pendingImpianto && !pendingAuth && children}
        </div>
      </div>
    </>
  );
});

export default Wrapper;
