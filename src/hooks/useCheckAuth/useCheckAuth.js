import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useCheckAuth() {
  const [pending, setPending] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/login");
    }
    setPending(false);
  }, [navigate]);
  return pending;
}

export default useCheckAuth;
