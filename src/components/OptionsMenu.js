import React, { useState } from "react";

export default function OptionsMenu() {
  const [priceRange] = useState([0, 61]);
  const [savingsRange] = useState([0, 100]);
  const [currentPrice, setCurrentPrice] = useState(priceRange[1]);
  const [currentSavings, setCurrentSavings] = useState(savingsRange[0]);
  const [hiding, setHiding] = useState(true);

  const handlePriceChange = e => {
    setCurrentPrice(e.target.value);
  };
  const handleSavingsChange = e => {
    setCurrentSavings(e.target.value);
  };

  const toggleHide = () => {
    setHiding(prev => !prev);
  }

  if(hiding){
    return (
      <button className="filter-button" onClick={toggleHide}>Filter</button>
    )
  }
  return (
    <div className="options-menu">
      <div className="options-item">
        <label htmlFor="store-select">Store</label>
        <select name="store-select" id="store-select">
          <option value="steam">Steam</option>
          <option value="epic">Epic</option>
          <option value="gog">GOG</option>
          <option value="greenman">Greenman Gaming</option>
        </select>
      </div>

      <div className="options-item">
        <label htmlFor="price-range">Price: {currentPrice == priceRange[1] ? `<$${priceRange[1]-1}` : `$${currentPrice}`}</label>
        <div className="range-values">
          <span className="range-minmax">${priceRange[0]}</span>
          <input
            className="slider"
            id="price-range"
            type="range"
            min={priceRange[0].toString()}
            max={priceRange[1].toString()}
            value={currentPrice}
            steps={1}
            onChange={handlePriceChange}
          ></input>
          <span className="range-minmax">{currentPrice == priceRange[1] ? `<$${priceRange[1]-1}` : `$${currentPrice}`}</span>
        </div>
      </div>

      <div className="options-item">
        <label htmlFor="savings-range">Savings: {currentSavings}%</label>
        <div className="range-values">
          <span className="range-minmax">{savingsRange[0]}%</span>
          <input
            className="slider"
            id="savings-range"
            type="range"
            min={savingsRange[0].toString()}
            max={savingsRange[1].toString()}
            value={currentSavings}
            steps={5}
            onChange={handleSavingsChange}
          ></input>
          <span className="range-minmax">{savingsRange[1]}%</span>
        </div>
      </div>
      <button className="filter-button hide-button" onClick={toggleHide}>Hide</button>
    </div>
  );
}
