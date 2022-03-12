import React, { useContext, useState, useEffect } from "react";
import useGetWishlistGameData from "../hooks/useGetWishlistGameData";
import useGetStoreData from "../hooks/useGetStoreData";

const GlobalContext = React.createContext();

export function useGlobalState() {
  return useContext(GlobalContext);
}


export function GlobalStateProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const {wishlistLoading, wishlistError, wishlistData} = useGetWishlistGameData();
  const { storeLoading, stores, storeError } = useGetStoreData();

  useEffect(()=>{
    if(wishlistData && !wishlistError)
      setWishlist(wishlistData)
  }, [wishlistData])

  const value = {
    wishlist,
    setWishlist,
    wishlistLoading,
    wishlistError,
    stores,
    storeLoading, 
    storeError
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
