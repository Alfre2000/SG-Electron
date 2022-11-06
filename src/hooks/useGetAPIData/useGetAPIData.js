import { useCallback, useContext, useEffect, useState } from "react";
import { apiGet } from "../../api/api";
import UserContext from "../../UserContext";

// [ { nome, url, parser }, ... ]
function useGetAPIData(requests, needsImpianto) {
  const { user } = useContext(UserContext);
  const impianto = user?.user?.impianto;
  const [data, setData] = useState({});
  const setNewData = useCallback((request, newData) => {
    newData = request.parser ? request.parser(newData) : newData;
    if (request.nome) {
      setData((previousState) => ({
        ...previousState,
        [request.nome]: newData,
      }));
    } else {
      setData((previousState) => ({ ...previousState, ...newData }));
    }
  }, []);

  const update = useCallback(() => {
    if (needsImpianto && !impianto) return;
    requests.forEach((req) => {
      const url = new URL(req.url);
      if (impianto?.id) url.searchParams.append("impianto", impianto.id);
      if (req.nome === "records") url.searchParams.append("page", 1);
      apiGet(url.toString()).then((response) => setNewData(req, response));
    });
    console.log("Updating...");
  }, [impianto, needsImpianto, setNewData]);

  useEffect(() => {
    update();
  }, [setNewData, impianto, needsImpianto]);

  useEffect(() => {
    setInterval(() => {
      update();
    }, 1000 * 60 * 10); // Update every 10 minutes
  }, []);
  return [data, setData];
}

export default useGetAPIData;
