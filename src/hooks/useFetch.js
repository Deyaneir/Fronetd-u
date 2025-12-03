// src/hooks/useFetch.js
import axios from "axios";
import { toast } from "react-toastify";

export function useFetch() {
  const fetchDataBackend = async (url, data = null, method = "POST", headers = {}) => {
    const loadingToast = toast.loading("Procesando solicitud...");

    try {
      const options = {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        data,
      };

      const response = await axios(options);

      toast.dismiss(loadingToast);
      return response.data;

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error(error.response?.data?.msg || "Ocurrió un error inesperado");
      throw error;
    }
  };

  return fetchDataBackend;
}
