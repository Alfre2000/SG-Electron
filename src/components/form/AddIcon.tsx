import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type AddIconProps = {
  onClick: () => void;
  disabled?: boolean;
};

function AddIcon({ onClick, disabled }: AddIconProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      onClick();
      e.stopPropagation();
    }
  };
  return (
    <div className="minus-icon outline-blue-700">
      <FontAwesomeIcon
        onClick={handleClick}
        icon={faCirclePlus}
        data-testid="icon-minus"
        size="lg"
        className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"} text-nav-blue hover:text-blue-800`}
      />
    </div>
  );
}

export default AddIcon;
