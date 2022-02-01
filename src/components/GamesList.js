import React, { useState, useEffect, useRef, useCallback } from "react";
import GamesListItem from "./GamesListItem.js";
import useGetGames from '../hooks/useGetGames.js';

export default function GamesList(options) {
  const [pageNumber, setPageNumber] = useState(0);
  const [query, setQuery] = useState(null);
  const {loading, games, error} = useGetGames(options, query, pageNumber);

  const observer = useRef();

  const handleObservation = useCallback((node) => {
    if(loading) return
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setPageNumber(prev => prev+1);
        console.log('Visible');
      }
    });
    if (node) observer.current.observe(node);
  }, [loading])

  const handleSearch = (e) => {
    setQuery(e.target.value)
    setPageNumber(0);
  }

  return <div className="games-list">
    <input type="text" onChange={handleSearch}></input>
    {games.map( (game,index) => {
      if(index === games.length-1)
        return <GamesListItem key={game.title} game={game} />
      return <GamesListItem key={game.title} game={game} />
    })}
    {/* <h5 className="hide" ref={handleObservation}>'</h5> */}
    <h1>{loading && 'Loading...'}</h1>
    <h1>{error && 'Error'}</h1>
  </div>;
}
