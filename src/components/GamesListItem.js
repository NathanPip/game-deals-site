import React from 'react'

export default function GamesListItem({game, setSelected}) {
    
    return (
        <div className="list-item" onClick={() => setSelected(game)}>
            <div className="item-head">
                <img className="item-img" src={game.thumb}/>
                <h3 className="item-title">{game.title}</h3>
            </div>  
            <div className="item-middle"></div>  
            <div className="item-foot">
                <p className="item-price">
                <span className="normal-price">${game.normalPrice}</span>
                {game.salePrice !== "0.00" ? `$${game.salePrice}` : "Free"}
                </p>
                <p className="item-savings">{Math.round(game.savings)}%</p>
            </div>  
        </div>
    )
}
