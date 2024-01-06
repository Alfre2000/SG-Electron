import { faClone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { removeIdRecursively } from "../../../utils";
import { usePageContext } from "../../../contexts/PageContext";
import { Record } from "../../../interfaces/global";

function Copy({ record }: { record: Record }) {
  const { setCopyData } = usePageContext();

  const handleCopy = () => {
    const initialData = { ...record };
    removeIdRecursively(initialData);
    setCopyData(initialData);
    document.getElementById('sg-header')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <p className="hover:bg-gray-100 px-4 py-1.5 cursor-pointer text-sm" onClick={handleCopy}>
        <FontAwesomeIcon icon={faClone} size="sm" className="mr-3" />
        Copia
      </p>
      <hr className="w-full text-gray-900" />
    </>
  );
}

export default Copy;
