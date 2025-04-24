import axios from "axios";

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
    return Promise.reject(error);
  }
);

export default axiosInstance;
