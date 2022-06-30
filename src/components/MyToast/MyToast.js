import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

function MyToast({ children }) {
  return (
    <ToastContainer position="bottom-end" className="p-2 fixed">
      <Toast className="bg-[#457b3b] text-center text-white w-80">
        <Toast.Body>
          <FontAwesomeIcon size="lg" className="mr-3" icon={faCheck} />
          {children}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default MyToast;
