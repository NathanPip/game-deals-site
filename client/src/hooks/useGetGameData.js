import { useEffect, useState } from "react";
import axios from "axios";

//fetches data for specific game from cheapshark as well as steam api
//and combines alol relevant data into single object

export default function useGetGameData(game) {
  const [steamLoading, setSteamLoading] = useState(false);
  const [hasExtras, setHasExtras] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [gameDataLoading, setGameDataLoading] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [gameDataError, setGameDataError] = useState(null);

  //fetches trailer video and description from games store page
  useEffect(() => {
    let controller = new AbortController();
    setHasExtras(false);
    setGameData(null);
    setGameDataError(null);
    const fetchSteamData = async () => {
      if (game && game.steamAppID) {
        try {
          setHasExtras(true);
          setSteamLoading(true);
          setGameDataLoading(true);
          const res = await axios({
            method: "GET",
            url: `/steamData?steamID=${game.steamAppID}`,
            signal: controller.signal
          });
          const data = res.data;
          const details = data[game.steamAppID].data;
          setGameData(prev => ({
            ...prev,
            thumbnail: details.header_image
          }));
          if (details.short_description)
            setGameData(prev => ({
              ...prev,
              desc: details.short_description
            }));
          if (details.movies) {
            setGameData(prev => ({ ...prev, video: details.movies[0] }));
          }
          setSteamLoading(false);
          if (!gameLoading) setGameDataLoading(false);
        } catch (err) {
          setHasExtras(false);
          setGameDataError(err);
          setSteamLoading(false);
          if (!gameLoading) setGameDataLoading(false);
        }
      }
    };
    fetchSteamData();
    return () => controller.abort();
  }, [game]);

  //fetches all the store price data for game
  useEffect(() => {
    let controller = new AbortController();
    setGameData(null);
    setGameDataError(null);
    const fetchGameData = async () => {
      if (game) {
        try {
        setGameLoading(true);
        setGameDataLoading(true);
        const res = await axios({
          method: "GET",
          url: "https://www.cheapshark.com/api/1.0/games",
          params: { id: game.gameID },
          signal: controller.signal
        });
        const deals = res.data.deals;
        setGameData(prev => ({ ...prev, deals: deals }));
        setGameLoading(false);
        if (!steamLoading) setGameDataLoading(false);
      }catch(err) {
          setGameDataError(err);
          setGameLoading(false);
          if (!steamLoading) setGameDataLoading(false);
        };
      }
    };
    fetchGameData();
    return () => controller.abort();
  }, [game]);

  return { gameData, gameDataLoading, gameDataError, hasExtras };
}
