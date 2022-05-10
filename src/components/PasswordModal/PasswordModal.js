import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { adminLogin } from "../../api/users";
import UserContext from "../../UserContext";

function PasswordModal({ show, onSuccess, onFail }) {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordType, setPasswordType] = useState("password")
  const { user } = useContext(UserContext)
  useEffect(() => {
    if (show && user.user.is_staff) {
      onSuccess();
      setPassword("");
      setErrors({});
    }
  }, [show, onSuccess, user.user.is_staff])
  const handleLogin = (e) => {
    e.preventDefault();
    adminLogin(password)
      .then((data) => {
        onSuccess();
        setPassword("");
        setErrors({});
      })
      .catch((err) => setErrors(err));
  };
  const closeModal = () => {
    onFail();
    setPassword("");
    setErrors({});
  };
  const handleEyePassword = () => {
    if (passwordType === "password") setPasswordType("text")
    else setPasswordType("password")
  }
  return (
    <>
      {show && !user.user.is_staff && (
        <Modal show={show} onHide={closeModal}>
        <Form onSubmit={handleLogin}>
          <Modal.Header closeButton>
            <Modal.Title>Area Riservata</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel label="Username" className="mb-8">
              <Form.Control
                type="username"
                placeholder="Username"
                className={
                  errors.username || errors.non_field_errors ? "is-invalid" : ""
                }
                value="admin"
                disabled
                required
              />
              <Form.Text className="text-danger">{errors.username}</Form.Text>
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-8">
              <Form.Control
                type={passwordType}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoFocus
                className={
                  errors.password || errors.non_field_errors ? "is-invalid" : ""
                }
                placeholder="Password"
              />
              <FontAwesomeIcon icon={faEye} onClick={handleEyePassword} className="absolute top-[23px] left-[90%] text-nav-blue cursor-pointer" />
              <Form.Text className="text-danger">{errors.password}</Form.Text>
            </FloatingLabel>
            {errors.non_field_errors && (
              <Alert className="mt-4 mx-auto text-sm" variant="danger">
                {errors.non_field_errors}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeModal}
              className="bg-[#6e757c]"
            >
              Chiudi
            </Button>
            <Button variant="primary" type="submit" className="bg-[#0d6efd]">
              Conferma
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      )}
    </>
  );
}

export default PasswordModal;
