import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function SectionHeader({ open, setOpen, title }) {
  return (
    <div className="bg-slate-100 rounded-t-lg uppercase text-nav-blue text-md flex justify-between px-3 py-2 mt-8 font-bold border-t-slate-300 border-t-0 border-l-[#dee2e6] border-r-[#dee2e6] border-r-1 border-l-1">
      <div></div>
      <div>{title}</div>
      <div>
        <FontAwesomeIcon
          className="cursor-pointer"
          icon={open ? faMinusCircle : faPlusCircle}
          size="lg"
          onClick={() => setOpen(!open)}
        />
      </div>
    </div>
  );
}

export default SectionHeader;
