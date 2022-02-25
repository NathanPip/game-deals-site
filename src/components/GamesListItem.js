import React from "react";

//gets game data from games list
export default function GamesListItem({ game, setSelected, isCard }) {
  if (isCard) {
    return (
      <div className="list-item card" onClick={() => setSelected(game)}>
        <div className="item-head">
          <img
            className="item-img"
            src={game.thumb}
            alt={`${game.title} cover`}
          />
          <h3 className="item-title">{game.title}</h3>
        </div>
        <div className="item-foot">
            <p className="item-original">Original Price: 
            {Math.round(game.savings) !== 0 && ` $${game.normalPrice}`}
            </p>
          <p className="item-price">
            {game.salePrice !== "0.00" ? `Sale Price: $${game.salePrice}` : "Sale Price: FREE"}
          </p>
          {Math.round(game.savings) !== 0 && (
            <p className="item-savings">Savings: {Math.round(game.savings)}%</p>
          )}
        </div>
      </div>
    );
  }

  if (!isCard) {
    return (
      <div className="list-item" onClick={() => setSelected(game)}>
        <div className="item-head">
          <img
            className="item-img"
            src={game.thumb}
            alt={`${game.title} cover`}
          />
          <h3 className="item-title">{game.title}</h3>
        </div>
        <div className="item-foot">
          <p className="item-price">
            {Math.round(game.savings) !== 0 && (
              <span className="normal-price">${game.normalPrice}</span>
            )}
            {game.salePrice !== "0.00" ? `$${game.salePrice}` : "Free"}
          </p>
          {Math.round(game.savings) !== 0 && (
            <p className="item-savings">{Math.round(game.savings)}%</p>
          )}
        </div>
      </div>
    );
  }
}
