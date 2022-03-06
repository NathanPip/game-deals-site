import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./authContext";

const GlobalContext = React.createContext();

export function useGlobalState() {
  return useContext(GlobalContext);
}

//convert game ids into a string to be passed as a url parameter for cheapshark api
const convertIDs = ids => {
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

export function GlobalStateProvider({ children }) {
  const [wishlistIDs, setWishlistIDs] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // takes wishlistids and makes a call up to cheapshark api to get corresponding game data. 
  // takes the response and creates a game object containing all the necessary data 
  // and adds that to an array, wishlist is then set to array
  useEffect(async () => {
    if (wishlistIDs) {
      let controller = new AbortController();
      const idString = convertIDs(Object.values(wishlistIDs));
      setError(null);
      try {
        const res = await axios.get(
          `https://www.cheapshark.com/api/1.0/games?ids=${idString}`
        );
        let data = Object.values(res.data);
        data = data.map((data, index) => ({ ...data.info, ...data.deals[0], gameID: wishlistIDs[index].game_id }));
        setWishlist(data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
        setLoading(false);
      }
      return () => controller.abort();
    }
  }, [wishlistIDs]);

  //makes a call up to the database to get all gameIDs in user wishlist and sets gameIDs to the response
  useEffect(() => {
    if (currentUser) {
      (async function() {
        let userWishlist = await getUserWishlist(currentUser);
        setWishlistIDs(userWishlist);
      })();
    }
  }, [currentUser]);

  //makes a post request up to the api when user signs up and adds user email and id to database
  async function postUserProfile(user) {
    try {
      const res = await axios.post("/user/signup", {
        uid: user.uid,
        email: user.email
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  //makes a post request to get user wishlist data from database.
  //Using a post request for security reasons as I do not want the users id to be passed as a URL parameter
  async function getUserWishlist(user) {
    try {
      const res = await axios.post("/user/games/get", {
        uid: user.uid
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }

  //checks to make sure game is not already in wishlist then makes a post request up to api and adds game to database
  //doing checks on client side so a request is not made everytime a user clicks add button
  async function addGameToWishlist(game, user) {
    try {
      for (let item in wishlist) {
        if (wishlist[item].title === game.title) {
          return null;
        }
      }
      setWishlist(prev => [...prev, game]);
      const res = await axios.post("/user/games", {
        uid: user.uid,
        game_id: game.gameID,
        game_title: game.title
      });
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  //makes a delete request up to api and deletes game with corresponding user id and title in database
  async function deleteGameFromWishlist(game, user) {
    setWishlist(prev => prev.filter(g => g.title !== game.title));
    try {
      const res = await axios.delete("/user/games", {
        data: {
          uid: user.uid,
          game_title: game.title
        }
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  const value = {
    wishlist,
    wishlistIDs,
    loading,
    error,
    setWishlist,
    postUserProfile,
    getUserWishlist,
    addGameToWishlist,
    deleteGameFromWishlist
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
