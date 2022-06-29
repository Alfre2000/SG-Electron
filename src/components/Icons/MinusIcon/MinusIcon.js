import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function MinusIcon({ disabled, onClick }) {
  return (
    <FontAwesomeIcon
      icon={faCircleMinus}
      data-testid="icon"
      size="lg"
      className={`${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } text-nav-blue hover:text-blue-800`}
      onClick={() => !disabled && onClick()}
    />
  );
}

export default MinusIcon;
