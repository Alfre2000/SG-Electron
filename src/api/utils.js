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

export const apiDelete = async (url) => {
  try {
    const { data } = await axios.delete(
        url,
        { headers: getHeaders()}
    );
    return data
  } catch (error) {
      throw getErrors(error)
  }
}

export const apiUpdate = async (url, body) => {
  try {
    const { data } = await axios.patch(
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
        // "Content-type": "multipart/form-data",
    }
    if (auth) {
        const authToken = JSON.parse(localStorage.getItem("user")).key
        headers["Authorization"] = `Token ${authToken}`
    }
    return headers
}

const getErrors = (error) => {
  return error.response && error.response.data
    ? error.response.data
    : error.message
}