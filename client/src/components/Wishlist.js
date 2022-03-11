import React, { useState } from "react";
import { useGlobalState } from "../contexts/globalContext";
import GamesListItem from "./GamesListItem";

export default function Wishlist({ setSelected }) {
  const [hiding, setHiding] = useState(true);
  const { wishlist, wishlistLoading } = useGlobalState();

  //renders the games when wishlist is not loading
  function renderGames() {
    if (!wishlist.length) {
      return <p className="alert-text">add games to to wishlist</p>;
    }
    return wishlist.map(game => {
      return (
        <GamesListItem
          key={game.title}
          game={game}
          setSelected={setSelected}
          isWishlist={true}
        />
      );
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
      <h2 className="wishlist-title">Wishlist</h2>
      <button className="wishlist-button hide-button" onClick={toggleHide}>
        Hide
      </button>
      {!wishlistLoading && wishlist ? renderGames() : <p>loading</p>}
      {wishlist.length > 5 ? (
        <button className="wishlist-button hide-button" onClick={toggleHide}>
          Hide
        </button>
      ) : null}
    </div>
  );
}
