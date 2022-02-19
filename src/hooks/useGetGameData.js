import React, { useEffect, useState } from "react";
import axios from "axios";

//fetches data for specific game from cheapshark as well as steam api 
//and combines alol relevant data into single object

export default function useGetGameData(game) {
  const [steamLoading, setSteamLoading] = useState(false);
  const [hasExtras, setHasExtras] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  //fetches trailer video and description from games store page
  useEffect(() => {
    let controller = new AbortController();
    setHasExtras(false);
    if (!game) setData(null);
    if (game) {
      if (game.steamAppID) {
        setHasExtras(true);
        setSteamLoading(true);
        setLoading(true);
        axios({
          method: "GET",
          url: `/steamData?steamID=${game.steamAppID}`,
          signal: controller.signal
        })
          .then(res => {
            console.log(res.data);
            return res.data;
          })
          .then(data => {
            return data[game.steamAppID];
          })
          .then(details => {
            if(details.data.short_description)
              setData(prev => ({
                ...prev,
                desc: details.data.short_description
              }));
            setData(prev => ({
              ...prev,
              thumbnail: details.data.header_image
            }));
            if (details.data.movies) return details.data.movies;
            setSteamLoading(false);
            if (!gameLoading) setLoading(false);
          })
          .then(movie => {
            if (movie) setData(prev => ({ ...prev, video: movie[0] }));
            setSteamLoading(false);
            if (!gameLoading) setLoading(false);
          })
          .catch(err => {
            // console.log(err);
            setHasExtras(false);
            setError(err);
            setSteamLoading(false);
            if (!gameLoading) setLoading(false);
          });
      }
    }
    return () => controller.abort();
  }, [game]);
  //fetches all the store price data for game
  useEffect(() => {
    let controller = new AbortController();
    if (!game) setData(null);
    if (game) {
      setGameLoading(true);
      setLoading(true);
      axios({
        method: "GET",
        url: "https://www.cheapshark.com/api/1.0/games",
        params: { id: game.gameID },
        signal: controller.signal
      })
        .then(res => {
          return res.data;
        })
        .then(data => {
          return data.deals;
        })
        .then(deals => {
          setData(prev => ({ ...prev, deals: deals }));
          setGameLoading(false);
          if (!steamLoading) setLoading(false);
        }).then (
        )
        .catch(err => {
          console.log(err);
          setError(err);
          setGameLoading(false);
          if (!steamLoading) setLoading(false);
        });
    }
    return () => controller.abort();
  }, [game]);

  return { data, loading, error, hasExtras };
}
