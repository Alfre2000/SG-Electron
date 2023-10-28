import { useQuery } from "react-query";
import UserContext from "../../UserContext";
import { useContext } from "react";

function useCustomQuery(params, options = {}, impiantoFilter = false) {
  const { user } = useContext(UserContext);
  const impianto = user?.user?.impianto?.id;
  let queryKey = params.queryKey;
  if (!Array.isArray(queryKey)) queryKey = [queryKey];
  if (impiantoFilter) queryKey.push({ impianto: impianto });
  if (params.queryKey) {
    queryKey = queryKey.filter((q) => {
      if (q && typeof q === "object") {
        return Object.values(q).some((v) => v !== "" && v !== undefined);
      }
      return q;
    });
  }
  const query = useQuery({ queryKey: queryKey, ...options })
  return query;
}

export default useCustomQuery;
