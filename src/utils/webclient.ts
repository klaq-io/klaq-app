import axios, { AxiosInstance } from "axios";

const webClient: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 16000,
  headers: {
    Accept: "application/json",
    contentType: "application/x-www-form-urlencoded",
  },
  withCredentials: true,
});

export default webClient;
