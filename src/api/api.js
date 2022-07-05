import axios from "axios";
import { getErrors, getHeaders } from "./utils";

export const apiGet = async (url) => {
  try {
    const { data } = await axios.get(url, { headers: getHeaders() });
    return data;
  } catch (error) {
    throw getErrors(error);
  }
};

export const apiPost = async (url, body = {}) => {
  try {
    const { data } = await axios.post(url, body, { headers: getHeaders() });
    return data;
  } catch (error) {
    throw getErrors(error);
  }
};

export const apiDelete = async (url) => {
  try {
    const { data } = await axios.delete(url, { headers: getHeaders() });
    return data;
  } catch (error) {
    throw getErrors(error);
  }
};

export const apiUpdate = async (url, body) => {
  try {
    const { data } = await axios.patch(url, body, { headers: getHeaders() });
    return data;
  } catch (error) {
    throw getErrors(error);
  }
};
