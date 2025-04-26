import axios from "axios";
import { handleApiError } from "./handle-api-error";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // your backend
  withCredentials: true, // optional, if cookies involved
});
console.log(axiosInstance.defaults.baseURL);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("SERVER ERROR: ", error);
    handleApiError(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    // Add any custom headers or modify request config here
    // For example, you can add an Authorization header if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
