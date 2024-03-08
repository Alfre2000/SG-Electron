import { createContext, useContext, useState } from "react";

const Context = createContext();

function PageContext({ children, impiantoFilter = false, FormComponent, FormComponentFn, getURL, postURL, queriesToInvalidate = [] }) {
  const [copyData, setCopyData] = useState(null)
  postURL = postURL || getURL
  return (
    <Context.Provider value={{ impiantoFilter, FormComponent, FormComponentFn, postURL, copyData, setCopyData, queriesToInvalidate }}>
      {children}
    </Context.Provider>
  );
}

export default PageContext;


export const usePageContext = () => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};
