import { useState, useEffect } from "react";
import axios from "axios";
import { filterGames } from "../helpers/helperFunctions";

//fetches game deals from cheapshark api based on options and a search query

export default function useGetGames(options, query, pageNumber) {
  const [gamesListLoading, setGamesListLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [gameListError, setGameListError] = useState(null);
  const [hasMoreGames, setHasMoreGames] = useState(true);

  useEffect(() => {
    setGames([]);
    setHasMoreGames(true);
  }, [query, options]);

  useEffect(() => {
    setGameListError(null);
    let controller = new AbortController();
    if (hasMoreGames && options) {
      const fetchData = async () => {
        try {
          setGamesListLoading(true);
          const res = await axios({
            method: "GET",
            url: "https://www.cheapshark.com/api/1.0/deals",
            params: { ...options, title: query, pageNumber: pageNumber },
            signal: controller.signal
          });
          if (pageNumber >= res.headers["x-total-page-count"]) {
            setHasMoreGames(false);
          }
          setGames(prevGames => {
            return filterGames([...prevGames, ...res.data]);
          });
          setGamesListLoading(false);
        } catch (err) {
          setGamesListLoading(false);
          setGameListError(err);
          console.log(err);
        }
      };
      fetchData();
    }
    return () => controller.abort();
  }, [options, query, pageNumber]);

  return { gamesListLoading, games, gameListError };
}
