import React, { useState, useEffect } from "react";
import axios from "axios";

const filterGames = games => {
  const titles = [];
  const filteredGames = [];
  for (let i = 0; i < games.length; i++) {
    if (!titles.includes(games[i].title)) filteredGames.push(games[i]);
    titles.push(games[i].title);
  }
  return filteredGames;
};

export default function useGetGames(options, query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setGames([]);
    setHasMore(true);
  }, [query, options]);

  useEffect(() => {
    let controller = new AbortController();
    setLoading(true);
    setError(null);
    if (hasMore && options) {
      axios({
        method: "GET",
        url: "https://www.cheapshark.com/api/1.0/deals",
        params: { ...options, title: query, pageNumber: pageNumber },
        signal: controller.signal
      })
        .then(res => {
          if (pageNumber >= res.headers["x-total-page-count"]) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          setGames(prevGames => {
            return filterGames([...prevGames, ...res.data]);
          });
          console.log(res);
          setLoading(false);
        })
        .catch(err => {
          if (err.message != "canceled") {
            setLoading(false);
            setError(err);
            console.log(err);
          }
        });
    }
    return () => controller.abort();
  }, [options, query, pageNumber]);

  return { loading, games, error };
}
