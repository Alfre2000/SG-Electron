import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import { Link, useNavigate } from "react-router-dom";

function Menu({ title, icon, links, navOpen }) {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, (e) => {
    if (!navOpen && !wrapperRef.current.parentElement.contains(e.target)) {
      setOpen(false);
    }
  });
  const handleClick = () => {
    if (links.length === 1) navigate(links[0].link);
    else setOpen(!open);
  };
  return (
    <div
      className={`mt-3 dropdown ${open ? "open" : ""} cursor-pointer`}
      onClick={handleClick}
      data-testid="container"
    >
      <div className="flex justify-between py-2 px-4 sg-nav-link rounded-md">
        <div className="flex items-center">
          <FontAwesomeIcon icon={icon} />
          <div className="pl-4 title">{title}</div>
        </div>
        {links.length > 1 && (
          <div className="text-right caret">
            <FontAwesomeIcon
              data-testid="caret-icon"
              icon={faCaretDown}
              className={`caret ${open ? "up" : ""}`}
            />
          </div>
        )}
      </div>
      <ul className="pl-6 pr-2 ml-[1.15em] list-disc" ref={wrapperRef}>
        {links.map((el) => {
          if (el.link) {
            return (
              <li className="text-sm mb-2 hover:underline" key={el.name}>
                <Link to={el.link}>{el.name}</Link>
              </li>
            );
          } else {
            return (
              <li className="text-sm mb-2 hover:underline" key={el.name}>
                <a href="." onClick={el.action}>
                  {el.name}
                </a>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}

export default Menu;
