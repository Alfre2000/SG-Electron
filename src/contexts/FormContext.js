import { createContext, useContext } from "react";

const Context = createContext();

function FormContext({ children, errors, initialData, view, isValidated }) {
  return (
    <Context.Provider value={{ errors, initialData, view, isValidated }}>
      {children}
    </Context.Provider>
  );
}

export default FormContext;

export const useFormContext = () => useContext(Context);
