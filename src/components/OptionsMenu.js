import React from "react";

export default function OptionsMenu() {
  return (
    <div className="options-menu">
      <label for="store-select">Store:</label>
      <select name="store-select" id="store-select">
      <option value="steam">Steam</option>
      <option value="epic">Epic</option>
      <option value="gog">GOG</option>
      <option value="greenman">Greenman Gaming</option>
      </select>

      <label for="price-range">Price:</label>
      <input type="range" id="price-range"></input>

      <label for="release-range">Release Date</label>
      <input type="range" id="release-range"></input>

      <label for="savings-range">Savings</label>
      <input type="range" id="savings-range"></input>
    </div>
  );
}
