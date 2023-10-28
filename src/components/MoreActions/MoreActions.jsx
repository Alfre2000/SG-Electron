import {
  faClone,
  faEllipsis,
  faMagnifyingGlass,
  faTrash,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import View from "./actions/View";
import Modify from "./actions/Modify";
import Delete from "./actions/Delete";
import useOutsideAlerter from "../../hooks/useOutsideAlerter/useOutsideAlerter";
import { usePageContext } from "../../contexts/PageContext";
import { removeIdRecursively } from "../../utils";
import { Link } from "react-router-dom";

function MoreActions({ record, view, modify, del, copy, onModify, onDelete, otherActions }) {
  const { setCopyData } = usePageContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setIsMenuOpen(false));

  const handleCopy = () => {
    const initialData = { ...record };
    removeIdRecursively(initialData);
    setCopyData(initialData);
    window.scrollTo(0, 0, { behavior: "smooth" });
  }
  return (
    <>
      {view   && <View   record={record} isOpen={isViewOpen}   setIsOpen={setIsViewOpen}   />}
      {modify && <Modify record={record} isOpen={isModifyOpen} setIsOpen={setIsModifyOpen} onModify={onModify} />}
      {del    && <Delete record={record} isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} onDelete={onDelete} />}
      <div
        className="cursor-pointer"
        ref={menuRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FontAwesomeIcon icon={faEllipsis} />
        {isMenuOpen && (
          <div className="absolute right-6 text-left bg-white shadow-lg rounded-md border-[1px] border-gray-400 z-50">
            {view && (
              <>
                <p
                  className="hover:bg-gray-100 hover:rounded-t-md px-4 py-1.5 cursor-pointer text-sm relative z-10"
                  onClick={() => setIsViewOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    size="sm"
                    className="mr-3"
                  />
                  Vedi
                </p>
                <hr className="w-full text-gray-900" />
              </>
            )}
            {modify && (
              <>
                <p
                  className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm"
                  onClick={() => setIsModifyOpen(true)}
                >
                  <FontAwesomeIcon icon={faWrench} size="sm" className="mr-3" />
                  Modifica
                </p>
                <hr className="w-full text-gray-900" />
              </>
            )}
            {copy && (
              <>
                <p
                  className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm"
                  onClick={handleCopy}
                >
                  <FontAwesomeIcon icon={faClone} size="sm" className="mr-3" />
                  Copia
                </p>
                <hr className="w-full text-gray-900" />
              </>
            )}
            {del && (
              <p
                className="hover:bg-gray-100 hover:rounded-b-md px-4 py-1.5 cursor-pointer text-sm"
                onClick={() => setIsDeleteOpen(true)}
              >
                <FontAwesomeIcon icon={faTrash} size="sm" className="mr-3" />
                Elimina
              </p>
            )}
            {otherActions && otherActions.map((action, index) => (
              <div key={index}>
                <hr className="w-full text-gray-900" />
                {action.link && (
                  <p
                  className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm"
                  >
                  <Link
                    to={action.link}
                  >
                    <FontAwesomeIcon icon={action.icon} size="sm" className="mr-3" />
                    {action.label}
                  </Link> 
                  </p>
                )}
                {action.onClick && (
                  <p
                    className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm"
                    onClick={action.onClick}
                  >
                    <FontAwesomeIcon icon={action.icon} size="sm" className="mr-3" />
                    {action.label}
                  </p>
                )}
              </div>
            ))
            }
          </div>
        )}
      </div>
    </>
  );
}

export default MoreActions;
