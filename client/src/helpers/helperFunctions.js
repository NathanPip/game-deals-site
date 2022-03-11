
//convert game ids into a string to be passed as a url parameter for cheapshark api
export const convertIDs = ids => {
    let string = "";
    let arr = [];
    for (let id in ids) {
      arr.push(ids[id].game_id);
    }
    for (let id of arr) {
      string += `${id},`;
    }
    return string.substring(0, string.length - 1);
  };

//filters stores and only returns stores that are currently active
export const filterActive = (stores) => {
    const filtered = [];
    for(let i=0; i<stores.length; i++){
        if (stores[i].isActive)
            filtered.push(stores[i])
    }
    return filtered;
} 

//filters games based on title so duplicates do not show up
export const filterGames = games => {
  const titles = [];
  const filteredGames = [];
  for (let i = 0; i < games.length; i++) {
    if (!titles.includes(games[i].title)) filteredGames.push(games[i]);
    titles.push(games[i].title);
  }
  return filteredGames;
};