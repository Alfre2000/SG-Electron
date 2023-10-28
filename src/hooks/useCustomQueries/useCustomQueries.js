import { useQueries } from "react-query";
import UserContext from "../../UserContext";
import { useContext } from "react";
import { defaultQueryFn } from "../../api/queryFn";

function useCustomQueries(queries, impiantoFilter = false) {
  const { user } = useContext(UserContext);
  const impianto = user?.user?.impianto?.id;
  const names = [];
  const queriesResults = useQueries(
    Object.entries(queries).map(([name, queryKey]) => {
      if (!Array.isArray(queryKey)) queryKey = [queryKey];
      if (impiantoFilter) queryKey.push({ impianto: impianto });
      names.push(name);
      return { queryKey: queryKey, queryFn: defaultQueryFn };
    })
  );
  const res = {};
  queriesResults.forEach((query, index) => {
    res[names[index]] = query;
  });
  return res;
}

export default useCustomQueries;
