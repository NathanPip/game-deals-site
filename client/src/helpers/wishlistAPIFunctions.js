import axios from 'axios';
  //makes a post request up to the api when user signs up and adds user email and id to database
export async function postUserProfile(user) {
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
  export async function getUserWishlist(user) {
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
 export async function addGameToWishlist(game, user, setWishlist, wishlist) {
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
 export  async function deleteGameFromWishlist(game, user, setWishlist) {
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