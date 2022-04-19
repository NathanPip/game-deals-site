import React, { useState } from "react";
import { useGlobalState } from "../contexts/globalContext.jsx";
import { useAuth } from "../contexts/authContext.jsx";
import GamesListItem from "./GamesListItem.jsx";

export default function Wishlist({ setSelected }) {
  const [hiding, setHiding] = useState(true);
  const { wishlist, wishlistLoading } = useGlobalState();
  const { currentUser } = useAuth();
  //renders the games when wishlist is not loading
  function renderGames() {
    if (!currentUser) {
      return <p className="alert-text">must be signed in</p>;
    } else if (wishlistLoading && !wishlist) {
      return <p className="alert-text">loading</p>;
    } else if (!wishlist.length) {
      return <p className="alert-text">add games to to wishlist</p>;
    }
    return wishlist.map((game) => {
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
    setHiding((prev) => !prev);
  };
  //if options are hiding then display show button
  if (hiding) {
    return (
      <button className="form-btn wishlist__button" onClick={toggleHide}>
        Wishlist
      </button>
    );
  }

  //if not hiding then display filter options
  return (
    <div className="wishlist__container">
      <div className="wishlist">
        <button className="wishlist-button hide-button" onClick={toggleHide}>
          Close
        </button>
        <h2 className="wishlist-title">Wishlist</h2>
        {renderGames()}
        {wishlist.length > 5 ? (
          <button className="wishlist-button hide-button hide-button-bottom" onClick={toggleHide}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
