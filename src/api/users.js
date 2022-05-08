import axios from "axios";
import { URLS } from "../urls";
import { getHeaders } from "./utils";

export const login = async (username, password) => {
  const authToken = JSON.parse(localStorage.getItem("token"))
  if (authToken) {
    return authToken
  }
  try {
    const { data } = await axios.post(
        URLS.LOGIN,
        { username, password },
        { headers: getHeaders(false)}
    );
    localStorage.setItem("user", JSON.stringify(data));
    return data
  } catch (error) {
      throw error.response && error.response.data
      ? error.response.data
      : error.message
  }
}

export const adminLogin = async (password) => {
  try {
    const { data } = await axios.post(
        URLS.LOGIN,
        { username: "admin", password },
        { headers: getHeaders(false)}
    );
    return data.key
  } catch (error) {
      throw error.response && error.response.data
      ? error.response.data
      : error.message
  }
}

export const logout = async () => {
  try {
    const { data } = await axios.post(
        URLS.LOGOUT,
        {},
        { headers: getHeaders(false)}
    );
    localStorage.removeItem("user")
    return data
  } catch (error) {
      return error.response && error.response.data
      ? error.response.data
      : error.message
  }
}