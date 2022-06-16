import { useCallback, useContext, useEffect, useState } from "react";
import { apiGet } from "../api/utils";
import UserContext from "../UserContext";

// [ { nome, url, initialData, parser }, ... ]
function useGetAPIData(requests, neeedsImpianto) {
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
    if (neeedsImpianto && !impianto) return
    requests.forEach(req => {
      let params = {}
      if (impianto?.id) params.impianto = impianto.id
      if (req.nome === 'records') params.page = 1
      params = new URLSearchParams(params)
      const url = req.url + '?' + params.toString()
      apiGet(url).then((response) => setNewData(req, response));
    })
  }, [setNewData, impianto])
  return [data, setData]
}

export default useGetAPIData