import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFormContext } from "../../../contexts/FormContext";

function PlusIcon({ onClick }) {
  const { view } = useFormContext();
  return (
    <FontAwesomeIcon
      icon={faCirclePlus}
      data-testid="icon-plus"
      size="lg"
      className={`${
        view ? "cursor-not-allowed" : "cursor-pointer"
      } text-nav-blue hover:text-blue-800`}
      onClick={() => !view && onClick()}
    />
  );
}

export default PlusIcon;
