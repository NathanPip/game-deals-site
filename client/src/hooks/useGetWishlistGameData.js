import {useState, useEffect} from 'react'
import { getUserWishlist } from '../helpers/wishlistAPIFunctions';
import { useAuth } from '../contexts/authContext';
import { convertIDs } from '../helpers/helperFunctions';
import axios from 'axios';

export default function useGetWishlistGameData() {
    const [wishlistLoading, setWishlistLoading] = useState(true);
    const [wishlistData, setWishlistData] = useState(null);
    const [wishlistError, setWishlistError] = useState(null);
    const [wishlistIDs, setWishlistIDs] = useState(null);
    const {currentUser} = useAuth();

    // takes wishlistids and makes a call up to cheapshark api to get corresponding game data. 
  // takes the response and creates a game object containing all the necessary data 
  // and adds that to an array, wishlist is then set to array
    useEffect(async () => {
    if (wishlistIDs) {
      let controller = new AbortController();
      const idString = convertIDs(Object.values(wishlistIDs));
      setWishlistError(null);
      try {
        const res = await axios.get(
          `https://www.cheapshark.com/api/1.0/games?ids=${idString}`
        );
        let data = Object.values(res.data);
        data = data.map((data, index) => ({ ...data.info, ...data.deals[0], gameID: wishlistIDs[index].game_id }));
        setWishlistData(data);
        setWishlistLoading(false);
      } catch (err) {
        console.log(err.message);
        setWishlistError(err.message);
        setWishlistLoading(false);
      }
      return () => controller.abort();
    }
  }, [wishlistIDs]);

  useEffect(() => {
    if (currentUser) {
      (async function() {
        let userWishlist = await getUserWishlist(currentUser);
        setWishlistIDs(userWishlist);
      })();
    }
  }, [currentUser]);

    return {wishlistLoading, wishlistData: wishlistData, wishlistError};
}
