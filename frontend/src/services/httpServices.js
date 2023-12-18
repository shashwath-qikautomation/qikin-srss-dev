import axios from "axios";
import { LOGOUT } from "../redux/action";
import { store } from "../redux/store";

axios.interceptors.request.use(function (config) {
  const headers = {
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers["x-access-token"] = token;
  }
  config.headers = headers;
  return config;
});

axios.interceptors.response.use(null, (error) => {
  if (
    error.response.data.message === "Unauthorized!" &&
    error.response.status === 401
  ) {
    store.dispatch({ type: LOGOUT, payload: null });
  }

  return Promise.reject(error);
});

const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};

export default http;
