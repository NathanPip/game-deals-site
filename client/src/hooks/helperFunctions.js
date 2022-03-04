import axios from "axios";

export async function postUserProfile(user) {
  try {
    const res = await axios.post("/user/signup", {
      uid: user.uid,
      email: user.email
    });
    return await res;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserWishlist(user) {
  try {
    const res = await axios.post("/user/games/get", {
      uid: user.uid
    })
    return await res;
  } catch (err) {
    console.log(err);
  }
}

export async function addGameToWishlist(game, user) {
  try {
    const wishlist = await getUserWishlist(user);
    for(let item of wishlist) {
      if(wishlist[item].game_id === game.gameID){
        throw Error("game already in wishlist")
      }
    }
    const res = await axios.post('/user/games', {
      uid: user.uid,
      game_id: game.gameID
    })
    return await res;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteGameFromWishlist(game, user) {
  try {
    const res = await axios.delete("user/games", {
      uid: user.uid,
      game_id: game.gameID
    });
    return await res;  
  } catch (err) {
    console.log(err);
  }
}