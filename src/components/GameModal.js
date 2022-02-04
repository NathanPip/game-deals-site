import React, { useState, useEffect } from "react";
import useGetGameData from "../hooks/useGetGameData.js";

const timeConverter = time => {
  let date = new Date(time * 1000);
  return date.toDateString().substring(4);
};

export default function GameModal({ game, stores, setSelected }) {
  const { data, loading, error, hasExtras } = useGetGameData(game);
  const [mainContent, setMainContent] = useState(null);
  const [extraContent, setExtraContent] = useState(null);
  const [isShown, setIsShown] = useState(false);

  const closeModal = () => {
    setIsShown(false);
    setSelected(null);
  };

  useEffect(() => {
    if (data && !loading && game && data) {
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
      // console.log(mainContent)
    }
    console.log(loading);
    console.log(data);
    console.log(isShown);
  }, [data, loading, game]);
  console.log(mainContent);
  if (game && !loading && data && mainContent && isShown) {
    if (mainContent.deals) {
      return (
        // background for modal
        <div className="modal-bg">
          <div className="modal-card">
            <button className="close-btn" onClick={closeModal}>
              X
            </button>

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

            <div className="modal-main">
              <div className="reviews">
                {hasExtras && (
                  <p
                    className="steam-reviews"
                    title={`${extraContent.steamRating}% of ${extraContent.steamRatingCount} players rated this game positively`}
                  ><strong>Reviews: </strong>{`${extraContent.steamRatingText} (${extraContent.steamRatingCount})`}</p>
                )}
                <p className="metacritic">
                  {mainContent.metacriticScore != 0
                    ? `Metacritic Score: ${mainContent.metacriticScore}`
                    : null}
                </p>
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

            <div className="modal-foot">
              <h3>Deals</h3>
              <ul className="deals-list">
                {mainContent.deals &&
                  mainContent.deals.map(deal => {
                    let currentStore = stores.filter(
                      store => store.storeID === deal.storeID
                    );
                    return (
                      <a
                        href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                      >
                        <li
                          key={currentStore[0].storeName}
                          className="deal-item"
                        >
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
                  })}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
  return null;
}
