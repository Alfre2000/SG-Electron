import { createContext, useContext, useState } from "react";
import { usePageContext } from "./PageContext";

const Context = createContext();

function FormContext({ children, errors, initialData, view, isValidated }) {
  const pageContext = usePageContext();
  initialData = initialData || pageContext?.copyData;

  const [startingData, setInitialData] = useState(initialData)
  initialData = startingData
  return (
    <Context.Provider value={{ errors, initialData, view, isValidated, setInitialData }}>
      {children}
    </Context.Provider>
  );
}

export default FormContext;

export const useFormContext = () => useContext(Context);
