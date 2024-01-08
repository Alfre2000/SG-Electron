import { Button, Modal } from "react-bootstrap";

type ModifyModalProps = {
  show: boolean;
  handleClose: (value: boolean) => void;
  children: React.ReactNode;
};

function ModifyModal({ show, handleClose, children }: ModifyModalProps) {
  return (
    <Modal centered size="xl" show={show} onHide={() => handleClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica il record</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose(false)} className="bg-[#6e757c] ml-auto">
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModifyModal;
