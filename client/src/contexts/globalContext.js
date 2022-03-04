import React, { useContext, useState } from "react";

const GlobalContext = React.createContext();

export function useGlobalState() {
  return useContext(GlobalContext);
}

export function GlobalStateProvider({ children }) {
  const [wishlist, setWishlist] = useState({});

  const value = {
    wishlist,
    setWishlist
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
