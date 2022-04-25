import axios from "axios";

export const apiGet = async (url) => {
  try {
    const { data } = await axios.get(
        url,
        { headers: getHeaders()}
    );
    return data
  } catch (error) {
      throw getErrors(error)
  }
}

export const apiPost = async (url, body = {}) => {
  try {
    const { data } = await axios.post(
        url,
        body,
        { headers: getHeaders()}
    );
    return data
  } catch (error) {
      throw getErrors(error)
  }
}


export const getHeaders = (auth = true) => {
    const headers = {
        "Content-type": "application/json",
    }
    if (auth) {
        const authToken = JSON.parse(localStorage.getItem("token"))
        headers["Authorization"] = `Token ${authToken}`
    }
    return headers
}

const getErrors = (error) => {
  return error.response && error.response.data
    ? error.response.data
    : error.message
}