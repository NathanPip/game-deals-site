import React, { useContext, useState, useEffect } from "react";
import useGetWishlistGameData from "../hooks/useGetWishlistGameData.js";
import useGetStoreData from "../hooks/useGetStoreData.js";

const GlobalContext = React.createContext();

export function useGlobalState() {
  return useContext(GlobalContext);
}

export function GlobalStateProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { wishlistLoading, wishlistError, wishlistData } =
    useGetWishlistGameData();
  const [alert, setAlert] = useState("");
  const { storeLoading, stores, storeError } = useGetStoreData();
  //the game taht will be displayed in the modal
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (wishlistData && !wishlistError) setWishlist(wishlistData);
  }, [wishlistData]);

  const value = {
    wishlist,
    setWishlist,
    wishlistLoading,
    wishlistError,
    stores,
    storeLoading,
    storeError,
    alert,
    setAlert,
    selectedGame,
    setSelectedGame,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
