import { useState, useEffect } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return;
    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw Error("error fetching from resource: " + url);
      const fetchedData = await res.json();

      setData(fetchedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(url);
    return () => abortController.abort();
  }, []);

  return { data, loading, error, fetchData };
}
