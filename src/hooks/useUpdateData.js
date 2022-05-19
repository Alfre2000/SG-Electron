import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet } from "../api/utils";

export default function useUpdateData(link, parser) {
  const setNewData = useCallback((newData) => {
    if (parser) setData(parser(newData))
    else setData(newData)
  }, [parser])
  const [data, setData] = useState({})
  const FREQUENCY = 1000 * 60 * 10 // 10 minuti
  const intervalRef = useRef(null);
  useEffect(() => {
    apiGet(link).then((data) => setNewData(data));
    intervalRef.current = setInterval(
      () =>
        apiGet(link).then((data) => {
          setNewData(data);
          console.log("Data updated !");
        }),
        FREQUENCY
    );
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [link, setData, FREQUENCY, parser, setNewData]);
  return [data, setData];
}
