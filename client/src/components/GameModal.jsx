import React, { useState, useEffect, useRef } from "react";
import useGetGameData from "../hooks/useGetGameData.js";
import { timeConverter } from "../helpers/helperFunctions.js";
import { useGlobalState } from "../contexts/globalContext.jsx";


export default function GameModal({ game, setSelected }) {
  const { gameData, gameDataLoading, hasExtras } = useGetGameData(game);
  const [mainContent, setMainContent] = useState(null);
  const [extraContent, setExtraContent] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const {stores, storeLoading} = useGlobalState();
  const videoRef = useRef();

  // when all data is resolved split data into main content
  // which will always be available and extra content which will only be available for games
  // listed on steam
  useEffect(() => {
    if (gameData && game) {
      setIsShown(true);
      setMainContent({
        title: game.title,
        image: game.thumb,
        mainStore: game.storeID,
        deals: gameData.deals,
        retail: game.normalPrice,
        salePrice: game.salePrice,
        savings: Math.floor(game.savings),
        release: timeConverter(game.releaseDate),
        metacriticScore: game.metacriticScore
      });
      if (hasExtras) {
        if(videoRef.current) videoRef.current.volume = .2;
        setExtraContent({
          desc: gameData.desc,
          steamRating: game.steamRatingPercent,
          steamRatingText: game.steamRatingText,
          steamRatingCount: game.steamRatingCount,
          mainVideo: gameData.video ? gameData.video.mp4.max : null,
          backupVideo: gameData.video ? gameData.video.webm.max : null,
          thumbnail: gameData.thumbnail
        });
      }
    }
  }, [gameData, gameDataLoading, game, hasExtras]);

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
                alt={currentStore[0].storeName}
              />{" "}
              {currentStore[0].storeName}
            </p>
            <p>${deal.price}</p>
          </li>
        </a>
      );
    });
  };

  const displayModalContent = () => (
    <div className="modal-card">
      <button className="close-btn" onClick={closeModal}>
        Close X
      </button>
      {/* contains the title and video / thumbnail of game */}
      <div className="modal-head">
        <h2 className="title">{mainContent.title}</h2>
        {!hasExtras ? (
          <img
            className="image"
            src={mainContent.image}
            alt={`${mainContent.title} cover`}
          />
        ) : null}
        {hasExtras ? (
          <video
            className="video"
            poster={extraContent.thumbnail}
            src={extraContent.backupVideo}
            type="video/webm"
            name="media"
            controls
            autoPlay
            ref={videoRef}
          >
            {/* <source src={extraContent.backupVideo} type="video/webm" />
            <source src={extraContent.mainVideo} type="video/mp4" /> */}
          </video>
          ) : null}
      </div>
      {/* contains the reviews from both metacritic and steam, 
                the release date as well as a description of the game if available */}
      <div className="modal-main">
        <div className="reviews">
          {hasExtras && extraContent.steamRating ? (
            <p
              className="steam-reviews"
              title={`${extraContent.steamRating}% of ${extraContent.steamRatingCount} players rated this game positively`}
            >
              <strong>Reviews: </strong>
              {`${extraContent.steamRatingText} (${extraContent.steamRatingCount})`}
            </p>
          ) : null}
          {mainContent.metacriticScore ? (
            <p className="metacritic">
              <strong>Metacritic Score: {mainContent.metacriticScore}</strong>
            </p>
          ) : null}
        </div>
        <p className="release-date">
          <strong>release date:</strong> {mainContent.release}
        </p>
        {hasExtras ? (
          <p className="desc">
            <span className="desc-title">About The Game:</span>
            {extraContent.desc}
          </p>
        ) : null}
      </div>
      {/* contains all of the available deals displayed in a list */}
      <div className="modal-foot">
        <h3>Deals</h3>
        <ul className="deals-list">{mainContent.deals && !storeLoading ? displayDeals() : null}</ul>
      </div>
    </div>
  );

  //checks to make sure there is a game selected, all data is resolved, whether the modal is visible,
  // and that mainContent has values
  if (isShown) {
      return <div className="modal-bg">
        {!gameDataLoading ? displayModalContent() : <p className="loading">loading</p>}
      </div>;
  }
  //return null if the checks aren't met
  return null;
}
