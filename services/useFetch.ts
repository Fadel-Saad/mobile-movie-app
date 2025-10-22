import { useEffect, useState } from "react";

// A hook to abstract the logic of fetching data and cluttering other files
export default function useFetch<T>(fetchFunction: () => Promise<T>, autoFetch = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<T | null>(null);

  async function fetchData() {
    try {
      setLoading(false);
      setError(null);

      const result = await fetchFunction();

      setData(result);
    } catch (err) {
      // @ts-ignore
      setError(err instanceof Error ? err : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setData(null);
    setLoading(false);
    setError(null);
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return { data, loading, error, refetch: fetchData, reset };
}
