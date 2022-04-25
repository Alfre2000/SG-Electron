import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '../api/users';
import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';

function Login({ from }) {
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
        <div className="bg-gray-50 grow flex">
          <Box component="form" onSubmit={handleLogin} className='m-auto text-center' style={{ width: 550 }}>
            <Paper elevation={2} style={{ padding: 40, borderRadius: 15, paddingTop: 50, paddingBottom: 50 }}>
              <Typography variant="h4" mb={2} style={{ color: '#0b0b55' }}>
                Accedi al Programma
              </Typography>
              <TextField
                margin="normal"
                fullWidth
                label="Username"
                name="username"
                autoFocus
                error={Boolean(errors.username || errors.non_field_errors)}
                onChange={(e) => setUsername(e.target.value)}
                helperText={errors.username}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                error={Boolean(errors.password || errors.non_field_errors)}
                onChange={(e) => setPassword(e.target.value)}
                helperText={errors.password}
                sx={{ mt: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 4, mb: 2, width: '25%' }}
              >
                Accedi
              </Button>
              {errors.non_field_errors && (<Alert sx={{ mt: 2 }} severity="error">{errors.non_field_errors}</Alert>)}
            </Paper>
          </Box>
        </div>
      </div>
    </>
  )
}

export default Login