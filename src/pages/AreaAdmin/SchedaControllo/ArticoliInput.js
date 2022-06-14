import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { Col, Row, ListGroup } from "react-bootstrap";
import Input from '../../../components/form-components/Input';
import SearchSelect from '../../../components/form-components/SearchSelect';
import { findElementFromID } from '../../../utils';

function ArticoliInput({ data }) {
  const [ricerca, setRicerca] = useState("")
  const [cliente, setCliente] = useState(null)
  const [articoli, setArticoli] = useState([])
  const handleAddArticolo = (event) => {
    const selectedArticolo = findElementFromID(event.target.getAttribute("value"), data.articoli)
    setArticoli([...articoli, selectedArticolo])
  }
  const handleRemoveArticolo = (event) => {
    const selectedArticolo = findElementFromID(event.target.getAttribute("value"), data.articoli)
    setArticoli(articoli.filter(articolo => articolo.id !== selectedArticolo.id))
  }
  const idSelezionati = articoli.map(articolo => articolo.id)
  const articoliPossibili = data?.articoli 
    ? data.articoli.filter(articolo => (!cliente?.value || articolo.cliente.nome === cliente?.value) && (articolo.nome.toLowerCase().includes(ricerca) || articolo.codice.toLowerCase().includes(ricerca)) && !idSelezionati.includes(articolo.id)) 
    : []
  const clienti = data?.articoli ? new Set(data?.articoli.map(articolo => articolo.cliente.nome)) : new Set([]);
  return (
    <>
      <Row className="mb-4 bg-slate-100 py-3 rounded-lg px-4">
        <Col xs={6}>
          <SearchSelect 
            label="Filtra per cliente:"
            labelProps={{ className: "text-left" }}
            labelCols={5}
            options={[...clienti].map(cliente => ({ value: cliente, label: cliente}))}
            inputProps={{
              onChange: (e) => setCliente(e),
              value: cliente,
              className: "mt-[3px]"
            }}
          />
        </Col>
        <Col xs={6}>
          <Input
            label="Ricerca articolo:"
            labelCols={5}
            inputProps={{ 
              className: "text-left px-3 mt-[3px]",
              onChange: (e) => setRicerca(e.target.value.toLowerCase()),
              value: ricerca,
            }}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={5}>
          <div className="py-2 text-sm border-t-0 border-r-0 border-l-0 font-semibold uppercase text-white bg-nav-blue rounded-t-md">
            Articoli Selezionabili
          </div>
          <ListGroup className="text-sm max-h-[250px] h-[250px] overflow-scroll rounded-t-none border-t-0 border border-slate-300">
            {articoliPossibili.map(articolo => (
              <ListGroup.Item
                key={articolo.id}
                value={articolo.id}
                className="py-1.5 cursor-pointer border-t-0 border-r-0 border-l-0"
                onClick={handleAddArticolo}
              >
                {`${articolo.nome} (${articolo.codice})`}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col xs={2}></Col>
        <Col xs={5}>
          <div className="py-2 text-sm border-t-0 border-r-0 border-l-0 font-semibold uppercase text-white bg-nav-blue rounded-t-md">
            Articoli Selezionati
          </div>
          <ListGroup className="text-sm max-h-[250px] h-[250px] overflow-scroll border border-slate-300 rounded-t-none border-t-0">
            {articoli.map(articolo => (
              <ListGroup.Item
                key={articolo.id}
                value={articolo.id}
                className="py-1.5 cursor-pointer border-t-0 border-r-0 border-l-0"
                onClick={handleRemoveArticolo}
              >
                {`${articolo.nome} (${articolo.codice})`}
              </ListGroup.Item>
            ))}
            <ListGroup.Item
                className="py-1.5 cursor-pointer border-t-0 border-r-0 border-l-0 font-semibold"
              >
                <FontAwesomeIcon icon={faPlus} size="lg" className="pr-2"/>  Nuovo Articolo
              </ListGroup.Item>
          </ListGroup>
        </Col>
        <select type="hidden" name="articoli" multiple className="hidden">
          {articoli && articoli.map((articolo) => (
            <option key={articolo.id} value={articolo.id} selected={true}></option>
          ))}
          <option></option>
        </select>
      </Row>
    </>
  )
}

export default ArticoliInput