import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { useFormContext } from "../../../contexts/FormContext";

function PlusIcon({ onClick }) {
  const { view } = useFormContext();
  const btnRef = useRef(null);
  return (
    <button
      ref={btnRef}
      onClick={(e) =>
        !view &&
        btnRef.current === document.activeElement &&
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
    </button>
  );
}

export default PlusIcon;
