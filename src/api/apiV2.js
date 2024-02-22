import axios from "axios";
import { getHeaders } from "./utils";
import { apiGet } from "./api";

export const apiPost = async (url, body = {}) => {
  return axios.post(url, body, { headers: getHeaders() });
};

export const apiDelete = async (url) => {
  return axios.delete(url, { headers: getHeaders() });
};

export const apiUpdate = async (url, body) => {
  return axios.patch(url, body, { headers: getHeaders() });
};

export const apiUpdateWithGet = async (url, body) => {
  const data = await apiGet(url);
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      delete data[key];
    }
  });
  const finalBody = { ...data, ...body };
  console.log("finalBody", finalBody);
  return axios.patch(url, finalBody, { headers: getHeaders() });
}