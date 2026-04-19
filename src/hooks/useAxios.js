import { useState, useEffect } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
});

export function useAxios(url) {
  const normalizedUrl = url ?? null;
  const [state, setState] = useState(() => ({
    data: null,
    error: null,
    loading: Boolean(normalizedUrl),
    url: normalizedUrl,
  }));

  const isStale = state.url !== normalizedUrl;
  const data = normalizedUrl ? (isStale ? null : state.data) : null;
  const loading = normalizedUrl ? isStale || state.loading : false;
  const error = normalizedUrl ? (isStale ? null : state.error) : null;

  useEffect(() => {
    if (!normalizedUrl) return;

    let cancelled = false;

    axiosInstance
      .get(normalizedUrl)
      .then((res) => {
        if (!cancelled) {
          setState({
            data: res.data,
            error: null,
            loading: false,
            url: normalizedUrl,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            error: err,
            loading: false,
            url: normalizedUrl,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedUrl]);

  return { data, loading, error };
}
