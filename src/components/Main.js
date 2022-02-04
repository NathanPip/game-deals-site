import React, { useState } from "react";
import GamesList from "./GamesList";
import OptionsMenu from "./OptionsMenu";

export default function Main() {
  const [options, setOptions] = useState(null);
  const [allStores, setAllStores] = useState(null);
  return (
    <div className="main">
      <OptionsMenu setOptions={setOptions} setAllStores={setAllStores}/>
      <GamesList options={options} stores={allStores}/>
    </div>
  );
}
