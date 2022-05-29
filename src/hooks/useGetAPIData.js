import { useCallback, useEffect, useState } from "react";
import { apiGet } from "../api/utils";

function useGetAPIData(requests) {
  // [ { nome, url, initialData, parser }, ... ]
  const initialData = {}
  requests.forEach(req => initialData[req.nome] = req.initialData)
  const [data, setData] = useState(initialData)
  const setNewData = useCallback((request, newData) => {
    if (request.parser) setData(previousState => {return {...previousState, [request.nome]: request.parser(newData)}})
    else setData(previousState => {return {...previousState, [request.nome]: newData}})
  }, [])
  useEffect(() => {
    requests.forEach(req => {
      apiGet(req.url).then((response) => setNewData(req, response));
    })
  }, [setNewData,])
  return [data, setData]
}

export default useGetAPIData