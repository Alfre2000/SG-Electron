import { IconDefinition, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import useOutsideAlerter from "../../hooks/useOutsideAlerter/useOutsideAlerter";
import { Link, useNavigate } from "react-router-dom";
import { LinkType } from "./Navbar";

type MenuProps = {
  title: string;
  icon: IconDefinition;
  links: LinkType[];
  navOpen?: boolean;
};

function Menu({ title, icon, links, navOpen = false }: MenuProps) {
  const active = title === "Programmi" ? false : links.map((l) => l.link).includes(window.location.hash.slice(1));

  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLUListElement>(null);
  useOutsideAlerter(wrapperRef, (e) => {
    if (!navOpen && wrapperRef.current && !wrapperRef.current.parentElement!.contains(e.target as Node)) {
      setOpen(false);
    }
  });
  const handleClick = () => {
    if (links.length === 1) {
      if (links[0].link) {
        navigate(links[0].link);
      } else if (links[0].action) {
        links[0].action();
      }
    } else {
      setOpen(!open);
    }
  };
  return (
    <div
      className={`mt-3 dropdown ${open ? "open" : ""} cursor-pointer`}
      onClick={handleClick}
      data-testid="container"
    >
      <div
        className={`flex justify-between py-2 px-4 sg-nav-link rounded-md ${active ? "sg-nav-link-active" : ""}`}
      >
        <div className="flex items-center">
          <FontAwesomeIcon icon={icon} />
          <div className="pl-4 title">{title}</div>
        </div>
        {links.length > 1 && (
          <div className="text-right caret">
            <FontAwesomeIcon data-testid="caret-icon" icon={faCaretDown} className={`caret ${open ? "up" : ""}`} />
          </div>
        )}
      </div>
      <ul className="pl-6 pr-2 ml-[1.15em] list-disc" ref={wrapperRef}>
        {links.map((el) => {
          if (!el) return null;
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
