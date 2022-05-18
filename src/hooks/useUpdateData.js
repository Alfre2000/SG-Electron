import { useEffect, useRef } from "react";
import { apiGet } from "../api/utils";

export default function useUpdateData(setData, link) {
  const FREQUENCY = 1000 * 60 * 10 // 10 minuti
  const intervalRef = useRef(null);
  useEffect(() => {
    apiGet(link).then((data) => setData(data));
    intervalRef.current = setInterval(
      () =>
        apiGet(link).then((data) => {
          setData(data);
          console.log("Data updated !");
        }),
        FREQUENCY
    );
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [link, setData, FREQUENCY]);
}
