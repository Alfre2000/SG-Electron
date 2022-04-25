import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function useCheckAuth() {
  let navigate = useNavigate();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("token"))) {
      navigate('/login')
    }
  }, [navigate])
}

export default useCheckAuth