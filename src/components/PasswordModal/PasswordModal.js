import React, { useState } from 'react'
import { Alert, Button, FloatingLabel, Form, Modal } from 'react-bootstrap'
import { adminLogin } from '../../api/users'

function PasswordModal({ show, handleClose }) {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const handleLogin = (e) => {
    e.preventDefault()
    adminLogin(password).then(data => {
      handleClose(true)
      setPassword("")
      setErrors({})
    }).catch(err => setErrors(err))
  }
  const closeModal = () => {
    handleClose(false)
    setPassword("")
    setErrors({})
  }
  return (
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
                    className={errors.username || errors.non_field_errors ? "is-invalid" : ""}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required />
                <Form.Text className="text-danger">{errors.username}</Form.Text>
                </FloatingLabel>
                <FloatingLabel label="Password" className="mb-8">
                <Form.Control
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    autoFocus
                    className={errors.password || errors.non_field_errors ? "is-invalid" : ""}
                    placeholder="Password" />
                    <Form.Text className="text-danger">{errors.password}</Form.Text>
                </FloatingLabel>
                {errors.non_field_errors && (<Alert className="mt-4 mx-auto text-sm" variant="danger">{errors.non_field_errors}</Alert>)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} className="bg-[#6e757c]">
            Chiudi
          </Button>
          <Button variant="primary" type="submit" className="bg-[#0d6efd]">
            Conferma
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
  )
}

export default PasswordModal