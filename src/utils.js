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

export const isDateRecent = (date, hours) => {
  const recordDate = new Date(date)
  const now = new Date()
  return Math.abs(now - recordDate) / 36e5 < hours;
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

export const searchOptions = (array, labelKey, same = false) => {
  if (same) return array?.map((el) => ({ value: el[labelKey], label: el[labelKey] }));
  return array?.map((el) => ({ value: el.id, label: el[labelKey] }));
}

export const isNumeric = (str) => {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export const min = (array) => {
  return array.length > 0 ? Math.min(...array).toFixed(2) : "-"
}
export const max = (array) => {
  return array.length > 0 ? Math.max(...array).toFixed(2) : "-"
}
export const mean = (array) => {
  return array.length > 0 ? (array.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / array.length).toFixed(2) : "-"
}
