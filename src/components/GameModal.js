import React, { useState, useEffect } from "react";
import useGetGameData from "../hooks/useGetGameData.js";

export default function GameModal({ game }) {
  const { data, loading, error } = useGetGameData(game);
  const [ details, setDetails ] = useState(null);

  useEffect(() => {
    setDetails(({ ...game, ...data }));
    console.log(details);
  }, [data]);

  return (
    <div className="modal-bg">
      <div className="modal-card">
        <div className="modal-head"></div>
        <div className="modal-main"></div>
        <div className="modal-foot"></div>
      </div>
    </div>
  );
}
