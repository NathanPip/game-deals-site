import React from 'react'

export default function GamesListItem({game}) {
    
    return (
        <div className="list-item">
            <div className="item-head">
                <img className="item-img" src={game.thumb}/>
                <h3 className="item-title">{game.title}</h3>
            </div>  
            <div className="item-middle"></div>  
            <div className="item-foot">
                <h4 className="item-savings">{Math.round(game.savings)}</h4>
                <h4 className="item-price">${game.salePrice}</h4>
            </div>  
        </div>
    )
}
