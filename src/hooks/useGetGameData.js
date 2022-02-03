import React, { useEffect, useState } from "react";
import axios from "axios";

export default function useGetGameData(game) {
  const [steamLoading, setSteamLoading] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  //fetches trailer video and description from games store page
  useEffect(() => {
    let controller = new AbortController();
    if (game) {
      setSteamLoading(true);
      setLoading(true);
      axios({
        method: "GET",
        url: `https://store.steampowered.com/api/appdetails?appids=${game.steamAppID}`,
        signal: controller.signal
      })
        .then(res => {
          return res.data;
        })
        .then(data => {
          return data[game.steamAppID];
        })
        .then(details => {
          setData(prev => ({ ...prev, desc: details.data.short_description }));
          if (details.data.movies) return details.data.movies;
          setData(prev => ({ ...prev, thumbnail: details.data.header_image }));
        })
        .then(movie => {
          if (movie) {
            setData(prev => ({ ...prev, video: movie[0] }));
          }
          setSteamLoading(false);
          if (!gameLoading) setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setError(err);
          setSteamLoading(false);
          if (!gameLoading) setLoading(false);
        });
    }
    return () => controller.abort();
  }, [game]);
  //fetches all the store price data for game
  useEffect(() => {
    let controller = new AbortController();
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
          setData(prev => ({ ...prev, deals: data.deals }));
          setGameLoading(false);
          if (!steamLoading) setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setError(err);
          setGameLoading(false);
          if (!steamLoading) setLoading(false);
        });
    }
    return () => controller.abort();
  }, [game]);

  return { data, loading, error };
}
