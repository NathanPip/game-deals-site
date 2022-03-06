import React, { useState } from "react";
import { useGlobalState } from "../contexts/globalContext";
import GamesListItem from "./GamesListItem";

export default function Wishlist({ setSelected }) {
  const [hiding, setHiding] = useState(true);
  const { wishlist, loading, wishlistIDs } = useGlobalState();

  //renders the games when wishlist is not loading
  function renderGames() {
      console.log(wishlistIDs);
    return wishlist.map((game) => {
      return <GamesListItem game={game} setSelected={setSelected} isWishlist={true}/>
    });
  }

  //toggles hiding
  const toggleHide = () => {
    setHiding(prev => !prev);
  };
  //if options are hiding then display show button
  if (hiding) {
    return (
      <button className="wishlist-button" onClick={toggleHide}>
        Wishlist
      </button>
    );
  }

  //if not hiding then display filter options
  return (
    <div className="wishlist">
      {(!loading && wishlist) ? renderGames() : <p>loading</p>}
      <button className="wishlist-button hide-button" onClick={toggleHide}>
        Hide
      </button>
    </div>
  );
}
