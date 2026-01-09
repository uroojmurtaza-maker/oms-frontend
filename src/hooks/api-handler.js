import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

const useApiHandler = (token) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [apiMessage, setApiMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  // ✅ Generic GET request
  const getData = useCallback(
    async (endpoint, params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params, // ✅ this adds query parameters dynamically
        });

        setData(response.data);
        setTotalPages(response?.data?.totalPages || 0);
        return response.data;
      } catch (err) {
        setError(true);
        setApiMessage(err?.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ✅ Generic POST request (custom URL or relative endpoint)
  const postData = useCallback(
    async (url, payload, isFullUrl = false, skipAuth = false) => {
      setLoading(true);
      setError(null);
      setApiMessage("");
      try {
        if (!isFullUrl && !BASE_URL) {
          throw new Error("BASE_URL is not defined. Please check your environment variables.");
        }

        const fullUrl = isFullUrl ? url : `${BASE_URL}${url}`;
        const headers = {};

        // If payload is FormData, don't set Content-Type (let browser set it with boundary)
        // Otherwise, set Content-Type to application/json
        if (!(payload instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }

        // Only add Authorization header if token exists and auth is not skipped
        if (token && !skipAuth) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.post(fullUrl, payload, {
          headers,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(true);
        const errorMessage = err?.response?.data?.message || err?.message || "POST request failed";
        setApiMessage(errorMessage);
        console.error("POST request error:", {
          url: isFullUrl ? url : `${BASE_URL}${url}`,
          error: err?.response?.data || err?.message,
          status: err?.response?.status,
        });
        throw err; // ✅ rethrow so the outer try/catch can handle it
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ✅ Generic PUT request
  const putData = useCallback(
    async (url, payload, isFullUrl = false) => {
      setLoading(true);
      setError(null);
      try {
        const fullUrl = isFullUrl ? url : `${BASE_URL}${url}`;
        const response = await axios.put(fullUrl, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(true);
        setApiMessage(err?.response?.data?.message || "PUT request failed");
        throw err; // ✅ rethrow so the outer try/catch can handle it

      } finally {
        setLoading(false);
      }
    },
    [token]
  );


  // ✅ Generic PUT request
  const patchData = useCallback(
    async (url, payload, isFullUrl = false) => {
      setLoading(true);
      setError(null);
      try {
        const fullUrl = isFullUrl ? url : `${BASE_URL}${url}`;
        const response = await axios.patch(fullUrl, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(true);
        setApiMessage(err?.response?.data?.message || "PUT request failed");
        throw err; // ✅ rethrow so the outer try/catch can handle it

      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // ✅ Generic DELETE request
  const deleteData = useCallback(
    async (url, payload = {}, isFullUrl = false) => {
      setLoading(true);
      setError(null);
      try {
        const fullUrl = isFullUrl ? url : `${BASE_URL}${url}`;
        const response = await axios.delete(fullUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: payload,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(true);
        setApiMessage(err?.response?.data?.message || "DELETE request failed");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return {
    data,
    loading,
    error,
    setError,
    apiMessage,
    setApiMessage,
    getData,
    postData,
    putData,
    patchData,
    deleteData,
    setData,
    totalPages,
  };
};

export default useApiHandler;