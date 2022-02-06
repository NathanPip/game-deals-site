import React, { useState, useEffect } from "react";
import useGetGameData from "../hooks/useGetGameData.js";

//converts epoch time to Day Month Year format
const timeConverter = time => {
  let date = new Date(time * 1000);
  return date.toDateString().substring(4);
};

export default function GameModal({ game, stores, setSelected }) {
  const { data, loading, error, hasExtras } = useGetGameData(game);
  const [mainContent, setMainContent] = useState(null);
  const [extraContent, setExtraContent] = useState(null);
  const [isShown, setIsShown] = useState(false);

  // when all data is resolved split data into main content
  // which will always be available and extra content which will only be available for games
  // listed on steam
  useEffect(() => {
    if (data && game) {
      setIsShown(true);
      setMainContent({
        title: game.title,
        image: game.thumb,
        mainStore: game.storeID,
        deals: data.deals,
        retail: game.normalPrice,
        salePrice: game.salePrice,
        savings: Math.floor(game.savings),
        release: timeConverter(game.releaseDate),
        metacriticScore: game.metacriticScore
      });
      if (hasExtras) {
        setExtraContent({
          desc: data.desc,
          steamRating: game.steamRatingPercent,
          steamRatingText: game.steamRatingText,
          steamRatingCount: game.steamRatingCount,
          mainVideo: data.video ? data.video.mp4.max : null,
          backupVideo: data.video ? data.video.webm.max : null,
          thumbnail: data.thumbnail
        });
      }
    }
  }, [data, loading, game]);

  //closes modal and sets the current selected game to null
  const closeModal = () => {
    setIsShown(false);
    setSelected(null);
  };

  //returns an array of list items that include deal price and store and href to the corresponding deal
  const displayDeals = () => {
    return mainContent.deals.map(deal => {
      let currentStore = stores.filter(store => store.storeID === deal.storeID);
      return (
        <a
          key={deal.storeID}
          href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
        >
          <li key={currentStore[0].storeName} className="deal-item">
            <p>
              <img
                src={`https://www.cheapshark.com${currentStore[0].images.icon}`}
              />{" "}
              {currentStore[0].storeName}
            </p>
            <p>${deal.price}</p>
          </li>
        </a>
      );
    });
  };

  //checks to make sure there is a game selected, all data is resolved, whether the modal is visible,
  // and that mainContent has values
  if (game && !loading && data && mainContent && isShown) {
    if (mainContent.deals) {
      return (
        <div className="modal-bg">
          <div className="modal-card">
            <button className="close-btn" onClick={closeModal}>
              X
            </button>
            {/* contains the title and video / thumbnail of game */}
            <div className="modal-head">
              <h2 className="title">{mainContent.title}</h2>
              {!hasExtras && <img className="image" src={mainContent.image} />}
              {hasExtras && (
                <video
                  className="video"
                  poster={extraContent.thumbnail}
                  controls
                >
                  <source src={extraContent.mainVideo} />
                  <source src={extraContent.backupVideo} />
                  )}
                </video>
              )}
            </div>
            {/* contains the reviews from both metacritic and steam, 
                the release date as well as a description of the game if available */}
            <div className="modal-main">
              <div className="reviews">
                {hasExtras && (
                  <p
                    className="steam-reviews"
                    title={`${extraContent.steamRating}% of ${extraContent.steamRatingCount} players rated this game positively`}
                  >
                    <strong>Reviews: </strong>
                    {`${extraContent.steamRatingText} (${extraContent.steamRatingCount})`}
                  </p>
                )}
                {mainContent.metacriticScore != 0 && (
                  <p className="metacritic">
                    <strong>
                      Metacritic Score: {mainContent.metacriticScore}
                    </strong>
                  </p>
                )}
              </div>
              <p className="release-date">
                <strong>release date:</strong> {mainContent.release}
              </p>
              {hasExtras && (
                <p className="desc">
                  <span className="desc-title">About The Game:</span>
                  {extraContent.desc}
                </p>
              )}
            </div>
            {/* contains all of the available deals displayed in a list */}
            <div className="modal-foot">
              <h3>Deals</h3>
              <ul className="deals-list">
                {mainContent.deals && displayDeals()}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
  //return null if the checks aren't met
  return null;
}
