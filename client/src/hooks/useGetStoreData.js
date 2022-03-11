import { useEffect, useState } from "react";
import axios from "axios";
import { filterActive } from "../helpers/helperFunctions";

//returns all active store data including, store id, store icon, and store name

export default function useGetStoreData() {
  const [storeLoading, setStoreLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [storeError, setStoreError] = useState(null);

  useEffect(() => {
    let controller = new AbortController();
    const fetchData = async () => {
      try {
        setStoreLoading(true);
        const res = await axios({
          method: "GET",
          url: "https://www.cheapshark.com/api/1.0/stores",
          signal: controller.signal
        });
        const data = res.data;
        setStores(filterActive(data));
        setStoreLoading(false);
      } catch (err) {
        setStoreLoading(false);
        setStoreError(err);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  return { storeLoading, stores, storeError };
}
