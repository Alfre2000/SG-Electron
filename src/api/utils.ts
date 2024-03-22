import { Error } from "@interfaces/global";

export const getHeaders = (auth = true) => {
  const headers: any = {};
  if (auth) {
    const authToken = JSON.parse(localStorage.getItem("user") ?? "")?.key;
    headers["Authorization"] = `Token ${authToken}`;
  }
  return headers;
};

export const getErrors = (error: any): Error => {
  return error.response && error.response.data
    ? error.response.data
    : error.message
    ? error?.message
    : error;
};
