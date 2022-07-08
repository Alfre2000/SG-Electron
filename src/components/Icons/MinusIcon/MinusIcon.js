import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFormContext } from "../../../contexts/FormContext";

function MinusIcon({ onClick }) {
  const { view } = useFormContext();
  return (
    <FontAwesomeIcon
      icon={faCircleMinus}
      data-testid="icon-minus"
      size="lg"
      className={`${
        view ? "cursor-not-allowed" : "cursor-pointer"
      } text-nav-blue hover:text-blue-800`}
      onClick={() => !view && onClick()}
    />
  );
}

export default MinusIcon;
