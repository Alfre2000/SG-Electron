import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '../api/users';
import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import { Card, FloatingLabel, Form, Button, Alert } from 'react-bootstrap';

function Login({ from, afterLogin }) {
  let navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})

  const [navOpen, setNavOpen] = useState(true)
  const navbar = [];
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  const handleLogin = (e) => {
    e.preventDefault()
    login(username, password).then(data => {
      afterLogin();
      navigate("/");
    }).catch(err => setErrors(err))
  }
  if (JSON.parse(localStorage.getItem("token"))) {
    return <Navigate to={{ pathname: from || '/' }} />
  }
  return (
    <>
      <Navbar menu={navbar} navOpen={navOpen}></Navbar>
      <div className="grow flex flex-col">
        <Header toggleNavbar={toggleNavbar} title={"Login"} />
        <div className="bg-gray-50 grow flex flex-col">
          <div className="m-auto text-center w-[520px]">
            <Card className="p-4">
              <Card.Body>
                <h2 className="text-3xl text-nav-blue text-semibold mb-8">Accedi al Programma</h2>
                <Form onSubmit={handleLogin}>
                  <FloatingLabel label="Username" className="mb-8">
                    <Form.Control
                      type="username"
                      placeholder="Username"
                      className={errors.username || errors.non_field_errors ? "is-invalid" : ""}
                      onChange={(e) => setUsername(e.target.value)}
                      required />
                    <Form.Text className="text-danger">{errors.username}</Form.Text>
                  </FloatingLabel>
                  <FloatingLabel label="Password" className="mb-8">
                    <Form.Control
                      type="password" 
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password || errors.non_field_errors ? "is-invalid" : ""}
                      placeholder="Password" />
                      <Form.Text className="text-danger">{errors.password}</Form.Text>
                  </FloatingLabel>
                  <Button type="submit" className="bg-[#0d6efd] w-28 font-medium">Accedi</Button>
                </Form>
              </Card.Body>
            </Card>
            {errors.non_field_errors && (<Alert className="mt-4 w-4/5 mx-auto text-sm" variant="danger">{errors.non_field_errors}</Alert>)}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login