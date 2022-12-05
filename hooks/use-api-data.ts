import axios from "axios";
import { useEffect, useRef, useState } from "react";

export const useApiData = <T>(
  path: string,
  defaultValue: any,
  dependencies = [],
  debounceDuration = 200
): T => {
  const [data, setData] = useState<T>(defaultValue);
  const timerId = useRef(null);
  useEffect(() => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      axios
        .get<T>(path)
        .catch((err) => err.response)
        .then((response) => {
          setData(response.data);
        });
    }, debounceDuration);

    return () => {
      clearTimeout(timerId.current);
    };
  }, dependencies);

  return data;
};

export default useApiData;
