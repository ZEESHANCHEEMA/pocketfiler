// axios.js (interceptor setup)
import axios from "axios";
import { Navigate } from "react-router-dom";
import { store } from "./redux/store";
import { requestPermission } from "../utils/Firebase/firebase";

const api = axios.create();

if (typeof window !== "undefined") {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        window.location.href = "/";
        localStorage.clear();
        store.dispatch({ type: "RESET_STORE" });
        requestPermission();
      }

      return Promise.reject(error);
    }
  );
}

export default api;
