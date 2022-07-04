import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";

function useCheckImpianto() {
  const [pending, setPending] = useState(true);
  let navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (!user?.user?.impianto) {
      navigate("/manutenzione/selezione-impianto/");
    }
    setPending(false);
  }, [navigate, user?.user?.impianto]);
  return pending;
}

export default useCheckImpianto;
