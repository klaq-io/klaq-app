import axios, { AxiosInstance } from "axios";

const webClient: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 8000,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache",
    contentType: "application/x-www-form-urlencoded",
  },
  withCredentials: true,
});

export default webClient;
