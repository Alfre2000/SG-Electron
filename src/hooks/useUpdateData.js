import { useEffect, useRef } from "react";
import { apiGet } from "../api/utils";

export default function useUpdateData(setData, link) {
  const FREQUENCY = 1000 // 10 minuti
  const intervalRef = useRef(null);
  useEffect(() => {
    apiGet(link).then((data) => setData(data));
    console.log('ok');
    intervalRef.current = setInterval(
      () =>
        console.log('ciai') &&
        apiGet(link).then((data) => {
          setData(data);
          console.log("Data updated !");
        }),
        FREQUENCY
    );
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [link, setData]);
}
