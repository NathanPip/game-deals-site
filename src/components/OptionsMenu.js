import React from "react";

export default function OptionsMenu() {
  return (
    <div className="options-menu">
      <select className="store-select"></select>
      <input type="range" className="price-range"></input>
      <select className="release-select"></select>
      <select className="savings-select"></select>
    </div>
  );
}
