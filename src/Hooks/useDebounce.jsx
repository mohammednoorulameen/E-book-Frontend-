import { useRef } from "react";
import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeRef = useRef(null)

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current)
    }
    timeRef.current = setTimeout(()=>{
      setDebouncedValue(value)
    },delay)

    return () => {
      clearTimeout( timeRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}

export  {useDebounce};
