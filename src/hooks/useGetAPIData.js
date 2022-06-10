import { useCallback, useContext, useEffect, useState } from "react";
import { apiGet } from "../api/utils";
import UserContext from "../UserContext";

// [ { nome, url, initialData, parser }, ... ]
function useGetAPIData(requests) {
  const { user: { user: { impianto } } } = useContext(UserContext)
  const initialData = {}
  requests.forEach(req => {
    if (req.nome) initialData[req.nome] = req.initialData
  })
  const [data, setData] = useState(initialData)
  const setNewData = useCallback((request, newData) => {
    console.log(request.nome || 'Default', 'dati aggiornati');
    newData = request.parser ? request.parser(newData) : newData
    if (request.nome) {
      setData(previousState => {return {...previousState, [request.nome]: newData}})
    } else {
      setData(previousState => {return {...previousState, ...newData}})
    }
  }, [])
  useEffect(() => {
    requests.forEach(req => {
      apiGet(`${req.url}?${impianto?.id ? `impianto=${impianto.id}` : ""}`).then((response) => setNewData(req, response));
    })
  }, [setNewData, impianto])
  return [data, setData]
}

export default useGetAPIData