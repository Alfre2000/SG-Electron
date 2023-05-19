import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
const { motion } = require("framer-motion");

function MyToast({ children }) {
  return (
    <ToastContainer position="bottom-end" className="p-2 fixed z-50">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: "tween" }}
      >
        <Toast className="bg-[#457b3b] text-center text-white w-80">
          <Toast.Body>
            <FontAwesomeIcon size="lg" className="mr-3" icon={faCheck} />
            {children}
          </Toast.Body>
        </Toast>
      </motion.div>
    </ToastContainer>
  );
}

export default MyToast;
