import React, { useEffect, useState } from 'react'
import Navbar from "./../components/Navbar/Navbar";
import Header from "./../components/Header/Header";
import useCheckAuth from '../hooks/useCheckAuth';
import { faComputer } from '@fortawesome/free-solid-svg-icons'
import { apiGet, apiPost } from '../api/utils';
import { URLS } from '../urls';
import { Alert, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';

function ManutenzioneRobot() {
  useCheckAuth();
  const [data, setData] = useState({})
  const [pezzi, setPezzi] = useState("")
  const [operatore, setOperatore] = useState("")
  const [note, setNote] = useState("")
  const [navOpen, setNavOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const navbar = [
    { title: "Programmi", icon: faComputer, links: [
      {name: 'HomePage', link: '/'},
      {name: 'Manutenzione Robot', link: '/robot'},
    ]},
  ];
  console.log(data);
  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }
  useEffect(() => {
    apiGet(URLS.PEZZI).then(data => setData(data))
    setInterval(() => apiGet(URLS.PEZZI).then(data => {
      setData(data)
      console.log('Data updated !');
    }), 1000 * 60 * 10)
  }, [])
  const handleForm = (e) => {
    e.preventDefault();
    apiPost(
      URLS.CREA_RECORD_LAVORAZIONE,
      { n_pezzi: pezzi, operatore, note }
    ).then(response => {
      response.operatore = { id: response.operatore, nome: data.operatori.filter(el => el.id === response.operatore)[0].nome}
      setData({...data, lavorazioni: [response, ...data.lavorazioni], n_pezzi: data.n_pezzi - pezzi})
      setPezzi("")
      setOperatore("")
      setNote("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    }).catch(err => console.log(err));
  }
  const manutenzioneUrgente = data.n_giorni <= 0 || data.n_pezzi <= 0
  return (
    <>
      <Navbar menu={navbar} navOpen={navOpen}></Navbar>
      <div className="grow flex flex-col">
        <Header toggleNavbar={toggleNavbar} title="Manutenzione Robot" />
        <div className="bg-gray-50 grow flex px-8">
          <Container className="text-center my-10">
            <Grid container spacing={6}>
              {manutenzioneUrgente && <Grid item xs={12} sx={{ mb: -2 }}>
                <Alert severity="error" sx={{ width: "75%", m: "auto", justifyContent:"center" }}><strong>É necessaria la manutenzione dell'impianto !</strong></Alert>
              </Grid>}
              <Grid item xs={4}>
                <Paper elevation={2} sx={{ borderRadius: 3, p: 1 }}>
                  <Typography variant="h6">N° pezzi alla manutenzione</Typography>
                  {data.n_pezzi !== undefined ? (
                    <Typography variant="h5">{data.n_pezzi}</Typography>
                  ) : (
                    <Skeleton className="m-auto" variant="text" width={100} height={30}/>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={2} sx={{ borderRadius: 3 }} className="h-full flex items-center justify-center">
                  <Typography variant="h5" style={{ color: '#0b0b55', fontSize: 30 }}>{data.impianto ||  <Skeleton className="m-auto" variant="text" width={150} height={50}/>}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={2} sx={{ borderRadius: 3, p: 1 }}>
                  <Typography variant="h6">N° giorni alla manutenzione</Typography>
                  <Typography variant="h5">{data.n_giorni !== undefined ? data.n_giorni : <Skeleton className="m-auto" variant="text" width={100} height={30}/>}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} align="left" sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6">Aggiungi lavorazione lotto</Typography>
                  <Box component="form" onSubmit={handleForm}>
                    <Grid container sx={{ mt: -1 }} spacing={4}>
                      <Grid item xs={2.5}>
                        <TextField 
                          type="number"
                          label="Numero Pezzi"
                          value={pezzi}
                          onChange={(e) => setPezzi(e.target.value)}
                          InputProps={{
                            required: true,
                            step: "100",
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel id="operatore-label">Operatore</InputLabel>
                          <Select
                              labelId="operatore-label"
                              label="Operatore"
                              value={operatore}
                              onChange={(e) => setOperatore(e.target.value)}
                              required
                            >
                              {data.operatori && data.operatori.map(operatore => (
                                <MenuItem key={operatore.id} value={operatore.id}>{operatore.nome}</MenuItem>  
                              ))}
                            </Select>
                          </FormControl>
                      </Grid>
                      <Grid item xs={6.5}>
                        <TextField
                          type="text" 
                          label="Note" 
                          fullWidth
                          value={note}
                          onChange={(e) => setNote(e.target.value)} />
                      </Grid>
                      <Grid item xs={2} alignItems="center">
                        <Button sx={{ mt: 0.5 }} color="primary" variant="contained" type="submit">Aggiungi</Button>
                      </Grid>
                      {success && (
                        <Grid item xs={6}>
                          <Alert severity="success">Lavorazione aggiunta !</Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} align="left" sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6">Ultimi lotti lavorati</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Data</TableCell>
                        <TableCell align="center">Ora</TableCell>
                        <TableCell align="center">N° pezzi</TableCell>
                        <TableCell align="center">Operatore</TableCell>
                        <TableCell align="center">Note</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.lavorazioni ? data.lavorazioni.map(lavorazione => {
                        let data = new Date(lavorazione.data)
                        return (
                          <TableRow key={lavorazione.id}>
                            <TableCell align="center">{data.toLocaleDateString()}</TableCell>
                            <TableCell align="center">{data.toLocaleTimeString()}</TableCell>
                            <TableCell align="center">{lavorazione.n_pezzi}</TableCell>
                            <TableCell align="center">{lavorazione.operatore ? lavorazione.operatore.nome : ""}</TableCell>
                            <TableCell align="center">{lavorazione.note}</TableCell>
                          </TableRow>
                      )}) : Array.from(Array(5)).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell colSpan="5">
                            <Skeleton />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </>
  )
}

export default ManutenzioneRobot