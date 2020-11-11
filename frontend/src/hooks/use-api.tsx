import { createApi } from "@synvox/api";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: "Bearer 123",
  },
});

export const { useApi, touch } = createApi(axios);
