import React from "react";
import { Button, Modal } from "react-bootstrap";

function ConfirmModal({ show, handleClose }) {
  return (
    <Modal centered show={show} onHide={() => handleClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sei sicuro di volerlo eliminare ?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => handleClose(false)}
          className="bg-[#6e757c]"
        >
          Chiudi
        </Button>
        <Button variant="danger" onClick={() => handleClose(true)} className="bg-[#cb444b]">
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
