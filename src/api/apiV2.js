import axios from "axios";
import { getHeaders } from "./utils";

export const apiPost = async (url, body = {}) => {
  return axios.post(url, body, { headers: getHeaders() });
};

export const apiDelete = async (url) => {
  return axios.delete(url, { headers: getHeaders() });
};

export const apiUpdate = async (url, body) => {
  return axios.patch(url, body, { headers: getHeaders() });
};
