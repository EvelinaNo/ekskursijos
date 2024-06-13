import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useFetch = (url, storageKey, onDataUpdate) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(url);
      setData(response.data);
      setLoading(false);
      sessionStorage.setItem(storageKey, JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [url, storageKey]);

  useEffect(() => {
    const storedData = sessionStorage.getItem(storageKey);
    if (storedData) {
      setData(JSON.parse(storedData));
      setLoading(false);
    } else {
      fetchData();
    }
  }, [fetchData, storageKey]);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  useEffect(() => {
    if (typeof onDataUpdate === "function") {
      onDataUpdate(data);
    }
  }, [data, onDataUpdate]);

  return { data, loading, refetch };
};