import { useCallback, useEffect, useState } from "react";
import { apiGet } from "../api/utils";

function useGetAPIData(requests) {
  // [ { nome, url, initialData, parser }, ... ]
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
      apiGet(req.url).then((response) => setNewData(req, response));
    })
  }, [setNewData,])
  return [data, setData]
}

export default useGetAPIData