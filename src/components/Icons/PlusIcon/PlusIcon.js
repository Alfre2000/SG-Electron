import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFormContext } from "../../../contexts/FormContext";

function PlusIcon({ onClick }) {
  const { view } = useFormContext();
  return (
    <div
      onClick={(e) =>
        !view &&
        onClick() && 
        e.stopPropagation()
      }
      className="plus-icon outline-blue-700"
    >
      <FontAwesomeIcon
        icon={faCirclePlus}
        data-testid="icon-plus"
        size="lg"
        className={`${
          view ? "cursor-not-allowed" : "cursor-pointer"
        } text-nav-blue hover:text-blue-800`}
      />
    </div>
  );
}

export default PlusIcon;
