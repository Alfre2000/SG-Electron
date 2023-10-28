import { createContext, useContext, useState } from "react";
import UserContext from "../UserContext";

const Context = createContext();

function PageContext({ children, impiantoFilter = false, FormComponent, getURL, postURL, defaultFilters = [], queriesToInvalidate = [] }) {
  const [copyData, setCopyData] = useState(null)
  const [filters, setFilters] = useState({ ordering: "", filters: {} })
  const [page, setPage] = useState(1)

  const { user } = useContext(UserContext);
  const impianto = user?.user?.impianto?.id;
  
  const flatFilters = [{ordering: filters.ordering}, ...Object.entries(filters.filters).map(([k, v]) => ({[k]: v}))].filter(filter => Object.values(filter)[0] !== "")
  let queryKey = [getURL, { page: page }, ...defaultFilters, ...flatFilters]
  if (impiantoFilter) queryKey.push({ impianto: impianto });
  queryKey = queryKey.filter((q) => q && typeof q === "object" ? Object.values(q).some((v) => v !== "" && v !== undefined) : q)

  postURL = postURL || queryKey[0]
  return (
    <Context.Provider value={{ impiantoFilter, FormComponent, queryKey, page, postURL, filters, setFilters, setPage, copyData, setCopyData, queriesToInvalidate }}>
      {children}
    </Context.Provider>
  );
}

export default PageContext;

export const usePageContext = () => useContext(Context);
