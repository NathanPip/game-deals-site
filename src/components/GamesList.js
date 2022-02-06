import React, { useState, useEffect, useRef, useCallback } from "react";
import GamesListItem from "./GamesListItem.js";
import GameModal from "./GameModal.js";
import OptionsMenu from "./OptionsMenu";
import useGetGames from "../hooks/useGetGames.js";

export default function GamesList({}) {
  //options and stores set by the options menu
  const [options, setOptions] = useState(null);
  const [stores, setStores] = useState(null);
  //tracks pagination
  const [pageNumber, setPageNumber] = useState(0);
  //search query
  const [query, setQuery] = useState(null);
  //for testing when set to true infinite scroll is disabled
  const [noScroll] = useState(false);
  //the game taht will be displayed in the modal
  const [selectedGame, setSelectedGame] = useState(null);
  //call returns game deals based on options and query, returns deals sorted by deal rating by default
  const { loading, games, error } = useGetGames(options, query, pageNumber);

  //handles the observation to signal when to fire another api call for another page
  //currently set to view a specific list item and fire when that list item is visible
  const observer = useRef();
  const handleObservation = useCallback(
    node => {
      if (loading || noScroll) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPageNumber(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );
  //handles search query
  const handleSearch = e => {
    setQuery(e.target.value != "" ? e.target.value : null);
    setPageNumber(0);
  };

  const displayGames = () => {
    return games.map((game, index) => {
      if (index === games.length - 12) {
        return (
          <div key={game.gameID} ref={handleObservation}>
            <GamesListItem
              key={game.title}
              game={game}
              setSelected={setSelectedGame}
            />
          </div>
        );
      }
      return (
        <GamesListItem
          key={game.title}
          game={game}
          setSelected={setSelectedGame}
        />
      );
    });
  };

  return (
    <div className="games-list">
      <div className="input-group">
        <input
          className="search-input"
          type="text"
          onChange={handleSearch}
          placeholder="search for a game"
        ></input>
        <OptionsMenu setOptions={setOptions} setAllStores={setStores} />
      </div>
      {displayGames()}
      <h1>{loading && "Loading..."}</h1>
      <GameModal
        game={selectedGame}
        stores={stores}
        setSelected={setSelectedGame}
      />
    </div>
  );
}
