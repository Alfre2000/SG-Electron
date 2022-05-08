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

export const getOperatoreName = (id, array) => {
  if (!array) return ""
  const matches = array.filter(el => el.id === id)
  return matches.length > 0 ? matches[0].nome : ""
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
