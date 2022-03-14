import React, { useLayoutEffect, useRef } from "react";
import { useGlobalState } from "../contexts/globalContext";

export default function Alert({ alert }) {
  const alertRef = useRef();
  const duration = 4000;
  const { setAlert } = useGlobalState();

  useLayoutEffect(() => {
    if (alert) {
      alertRef.current.classList.remove("fade-in-out");
      const startTimer = setTimeout(() => {
        alertRef.current.classList.add("fade-in-out");
      }, 50);
      const animationDurationTimer = setTimeout(() => {
        setAlert("");
      }, duration);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(animationDurationTimer);
      };
    }
  }, [alert]);

  return (
    <p ref={alertRef} className="alert">
      {alert}
    </p>
  );
}
