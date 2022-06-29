export const dateToDatePicker = (date) => {
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  return date.getFullYear()+"-"+(month)+"-"+(day) ;
}

export const dateToTimePicker = (date) => {
  let hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  let min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min; 
  return hour + ":" + min
}

export const findElementFromID = (id, array) => {
  if (!array) return ""
  return array.find(el => el.id === id) || ""
}

export const capitalize = s => (s && s[0].toUpperCase() + s.slice(1)) || ""

export const colors = [
  "rgba(255, 99, 132, 0.9)",
  "rgba(255, 159, 64, 0.9)",
  "rgba(255, 205, 86, 0.9)",
  "rgba(75, 192, 192, 0.9)",
  "rgba(54, 162, 235, 0.9)",
  "rgba(153, 102, 255, 0.9)",
  "rgba(201, 203, 207, 0.9)",
  "#8549ba",
  "#58595b",
];

export const updateQueryStringParameter = (uri, key, value) => {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

export const isDateRecent = (date) => {
  const recordDate = new Date(date)
  const now = new Date()
  return Math.abs(now - recordDate) / 36e5 < 2;
}

export const convertPeso = (prev, current, amount) => {
  if (prev === current) return amount;
  let result;
  if (current === "g" && prev === "kg") result = amount * 1000
  if (current === "mg" && prev === "kg") result = amount * 1000 * 1000
  if (current === "kg" && prev === "g") result = amount / 1000
  if (current === "mg" && prev === "g") result = amount * 1000
  if (current === "kg" && prev === "mg") result = amount / 1000 / 1000
  if (current === "g" && prev === "mg") result = amount / 1000
  return result
}
export const convertSuperficie = (prev, current, amount) => {
  if (prev === current) return amount;
  let result;
  if (current === "m" && prev === "dm") result = amount / 100
  if (current === "cm" && prev === "dm") result = amount * 100
  if (current === "dm" && prev === "m") result = amount * 100
  if (current === "cm" && prev === "m") result = amount * 100 * 100
  if (current === "m" && prev === "cm") result = amount / 100 / 100
  if (current === "dm" && prev === "cm") result = amount / 100
  return result
}

export const toTableArray = (array) => {
  let resArray = []
  for (let i = 0; i < array.length; i += 2) {
    resArray.push([array[i], array[i + 1]])
  }
  return resArray
}