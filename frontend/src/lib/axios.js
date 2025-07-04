import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5200/api/v1/",
  withCredentials: true //! send cookies w request
})