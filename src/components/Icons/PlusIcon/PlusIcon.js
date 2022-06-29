import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function PlusIcon({ disabled, onClick }) {
  return (
    <FontAwesomeIcon
      icon={faCirclePlus}
      data-testid="icon"
      size="lg"
      className={`${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } text-nav-blue hover:text-blue-800`}
      onClick={() => !disabled && onClick()}
    />
  );
}

export default PlusIcon;
