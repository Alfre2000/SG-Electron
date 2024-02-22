import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import View from "./actions/View";
import Modify from "./actions/Modify";
import Delete from "./actions/Delete";
import useOutsideAlerter from "../../hooks/useOutsideAlerter/useOutsideAlerter";
import { Link } from "react-router-dom";
import Copy from "./actions/Copy";

type MoreActionsProps<TData> = {
  record: TData;
  view?: boolean;
  modify?: boolean;
  del?: boolean;
  copy?: boolean;
  otherActions?: {
    label: string;
    icon: any;
    link?: string;
    onClick?: () => void;
  }[];
};

function MoreActions<TData extends {id: string | number }>({ record, view, modify, del, copy, otherActions }: MoreActionsProps<TData>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setIsMenuOpen(false));
  return (
    <>
      <div className="cursor-pointer" ref={menuRef} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FontAwesomeIcon icon={faEllipsis} />
        <div
          className={`absolute right-6 text-left bg-white shadow-lg rounded-md border-[1px] border-gray-400 z-50 ${
            isMenuOpen ? "" : "hidden"
          }`}
        >
          {view && <View record={record} />}
          {modify && <Modify record={record} />}
          {copy && <Copy record={record} />}
          {del && <Delete record={record} />}

          {otherActions &&
            otherActions.map((action, index) => (
              <div key={index}>
                <hr className="w-full text-gray-900" />
                {action.link && (
                  <p className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm">
                    <Link to={action.link}>
                      <FontAwesomeIcon icon={action.icon} size="sm" className="mr-3" />
                      {action.label}
                    </Link>
                  </p>
                )}
                {action.onClick && (
                  <p className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm" onClick={action.onClick}>
                    <FontAwesomeIcon icon={action.icon} size="sm" className="mr-3" />
                    {action.label}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default MoreActions;
