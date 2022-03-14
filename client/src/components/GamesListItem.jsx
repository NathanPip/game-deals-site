import React from "react";
import { useAuth } from "../contexts/authContext.jsx";
import { useGlobalState } from "../contexts/globalContext.jsx";
import {
  addGameToWishlist,
  deleteGameFromWishlist
} from "../helpers/wishlistAPIFunctions";

//gets game data from games list
export default function GamesListItem({
  game,
  setSelected,
  isCard,
  isWishlist
}) {
  const { setWishlist, wishlist, setAlert } = useGlobalState();
  const { currentUser } = useAuth();

  async function addToWishlist(e) {
    e.stopPropagation();
    const addGameRes = await addGameToWishlist(
      game,
      currentUser,
      setWishlist,
      wishlist
    );
    if (addGameRes === "in-wishlist") setAlert("game already in wishlist");
    if(addGameRes === "no-user") setAlert("must be signed in");
  }

  async function removeFromWishlist(e) {
    e.stopPropagation();
    await deleteGameFromWishlist(game, currentUser, setWishlist);
  }

  //if the list is in grid mode isCard = true
  if (isCard) {
    return (
      <div className="game list-item card" onClick={() => setSelected(game)}>
        <div className="item-head">
          <img
            className="item-img"
            src={game.thumb}
            alt={`${game.title} cover`}
          />
          <h2 className="item-title">{game.title}</h2>
          <button
            className="wishlist-add-btn"
            onClick={isWishlist ? removeFromWishlist : addToWishlist}
          >
            {isWishlist ? "Remove From Wishlist" : "Add to wishlist"}
          </button>
        </div>
        <div className="item-foot">
          <p className="item-original">
            Original Price:
            {Math.round(game.savings) !== 0 &&
              ` $${game.retailPrice ? game.retailPrice : game.normalPrice}`}
          </p>
          <p className="item-price">
            {game.salePrice !== "0.00"
              ? `Sale Price: $${game.price ? game.price : game.salePrice}`
              : "Sale Price: FREE"}
          </p>
          {Math.round(game.savings) !== 0 && (
            <p className="item-savings">Savings: {Math.round(game.savings)}%</p>
          )}
        </div>
      </div>
    );
  }

  //if the list is in not in grid mode isCard = true
  if (!isCard) {
    return (
      <div className="game list-item" onClick={() => setSelected(game)}>
        <div className="item-head">
          <img
            className="item-img"
            src={game.thumb}
            alt={`${game.title} cover`}
          />
          <h2 className="item-title">{game.title}</h2>
        </div>
        <div className="item-foot">
          <button
            className="wishlist-add-btn"
            onClick={isWishlist ? removeFromWishlist : addToWishlist}
          >
            {isWishlist ? "-" : "+"}
          </button>
          <p className="item-price">
            {Math.round(game.savings) !== 0 && (
              <span className="normal-price">
                ${game.retailPrice ? game.retailPrice : game.normalPrice}
              </span>
            )}
            {game.salePrice !== "0.00"
              ? `$${game.price ? game.price : game.salePrice}`
              : "Free"}
          </p>
          {Math.round(game.savings) !== 0 && (
            <p className="item-savings">{Math.round(game.savings)}%</p>
          )}
        </div>
      </div>
    );
  }
}
