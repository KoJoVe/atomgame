import { useEffect, useRef, useState } from "react";

export const useAnimationFrame = () => {
  const [time, setTime] = useState(0);
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);
  
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        setTime(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return time;
}
