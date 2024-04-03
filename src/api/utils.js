export const getHeaders = (auth = true) => {
  const headers = {
    'App-Version': process.env.REACT_APP_VERSION || 'unknown'
  };
  if (auth) {
    const authToken = JSON.parse(localStorage.getItem("user"))?.key;
    headers["Authorization"] = `Token ${authToken}`;
  }
  return headers;
};

export const getErrors = (error) => {
  return error.response && error.response.data
    ? error.response.data
    : error.message
    ? error?.message
    : error;
};
