import React, { useState, useEffect } from "react";
import useGetStoreData from "../hooks/useGetStoreData.js";

export default function OptionsMenu({ setOptions }) {
  const [priceRange] = useState([0, 61]);
  const [savingsRange] = useState([0, 100]);
  const [currentPrice, setCurrentPrice] = useState(priceRange[1]);
  const [currentSavings, setCurrentSavings] = useState(savingsRange[0]);
  const [hiding, setHiding] = useState(true);
  const [currentStore, setCurrentStore] = useState(null);
  const { loading, stores, error } = useGetStoreData();
  const [options, setCurrentOptions] = useState({
    upperPrice: currentPrice == priceRange[1] ? null : currentPrice,
    steamRating: currentSavings,
    storeID: currentStore
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOptions(options);
    }, 500);
    console.log(options);
    return () => clearTimeout(timeout);
  }, [options]);

  const handlePriceChange = e => {
    setCurrentPrice(e.target.value);
    setCurrentOptions(prevOptions => ({
      ...prevOptions,
      upperPrice: currentPrice == priceRange[1] ? null : currentPrice
    }));
  };
  const handleSavingsChange = e => {
    setCurrentSavings(e.target.value);
    setCurrentOptions(prevOptions => ({
      ...prevOptions,
      steamRating: currentSavings
    }));
  };

  const handleStoreSelect = e => {
    setCurrentStore(e.target.value);
    setCurrentOptions(prevOptions => ({
      ...prevOptions,
      storeID: e.target.value == 0 ? null : e.target.value
    }));
  };

  const toggleHide = () => {
    setHiding(prev => !prev);
  };

  if (hiding) {
    return (
      <button className="filter-button" onClick={toggleHide}>
        Filter
      </button>
    );
  }
  return (
    <div className="options-menu">
      <div className="options-item">
        <label htmlFor="store-select">Store</label>
        <select
          name="store-select"
          id="store-select"
          value={currentStore}
          onChange={handleStoreSelect}
        >
          <option value={0}> select a store</option>
          {!loading &&
            !error &&
            stores.map(store => {
              return (
                <option key={store.storeName} value={store.storeID}>
                  {store.storeName}
                </option>
              );
            })}
        </select>
      </div>

      <div className="options-item">
        <label htmlFor="price-range">
          Price:{" "}
          {currentPrice == priceRange[1]
            ? `<$${priceRange[1] - 1}`
            : `$${currentPrice}`}
        </label>
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
          <span className="range-minmax">
            {currentPrice == priceRange[1]
              ? `<$${priceRange[1] - 1}`
              : `$${currentPrice}`}
          </span>
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
      <button className="filter-button hide-button" onClick={toggleHide}>
        Hide
      </button>
    </div>
  );
}
