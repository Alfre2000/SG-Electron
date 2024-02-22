export const dateToDatePicker = (date) => {
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  return date.getFullYear() + "-" + month + "-" + day;
};

export const dateToTimePicker = (date) => {
  let hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  let min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  return hour + ":" + min;
};

export const dateToAPIdate = (date) => {
  if (date === undefined) return undefined;
  const [year, month, day] = date.split("-");
  return day + "/" + month + "/" + year;
};

export const dateToPickerDate = (date) => {
  if (!date) return undefined;
  const [day, month, year] = date.split("/");
  return year + "-" + month + "-" + day;
};

export const findElementFromID = (id, array) => {
  if (!array) return "";
  return array.find((el) => el.id === id) || "";
};

export const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || "";

export const isDateRecent = (date, hours) => {
  const recordDate = new Date(date);
  const now = new Date();
  if (hours === false) return true;
  return Math.abs(now - recordDate) / 36e5 < hours;
};

export const convertPeso = (prev, current, amount) => {
  if (prev === current) return amount;
  let result;
  if (current === "g" && prev === "kg") result = amount * 1000;
  if (current === "mg" && prev === "kg") result = amount * 1000 * 1000;
  if (current === "kg" && prev === "g") result = amount / 1000;
  if (current === "mg" && prev === "g") result = amount * 1000;
  if (current === "kg" && prev === "mg") result = amount / 1000 / 1000;
  if (current === "g" && prev === "mg") result = amount / 1000;
  return result;
};
export const convertSuperficie = (prev, current, amount) => {
  if (prev === current) return amount;
  let result;
  if (current === "m" && prev === "dm") result = amount / 100;
  if (current === "cm" && prev === "dm") result = amount * 100;
  if (current === "dm" && prev === "m") result = amount * 100;
  if (current === "cm" && prev === "m") result = amount * 100 * 100;
  if (current === "m" && prev === "cm") result = amount / 100 / 100;
  if (current === "dm" && prev === "cm") result = amount / 100;
  return result;
};

export const toTableArray = (array) => {
  let resArray = [];
  for (let i = 0; i < array.length; i += 2) {
    resArray.push([array[i], array[i + 1]]);
  }
  return resArray;
};

export const searchOptions = (array, labelKey, same = false) => {
  if (same) return array?.map((el) => ({ value: el[labelKey], label: el[labelKey] }));
  return array?.map((el) => ({ value: el.id, label: el[labelKey] }));
};

export const min = (array) => {
  return array.length > 0 ? Math.min(...array).toFixed(2) : "-";
};
export const max = (array) => {
  return array.length > 0 ? Math.max(...array).toFixed(2) : "-";
};
export const mean = (array) => {
  return array.length > 0
    ? (array.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / array.length).toFixed(2)
    : "-";
};

export function removeIdRecursively(data) {
  if (Array.isArray(data)) {
    data.forEach((el) => {
      if (el && typeof el === "object") {
        delete el.id;
        removeIdRecursively(el); // Recurse into nested objects or arrays
      }
    });
  } else if (data && typeof data === "object") {
    delete data.id;
    for (const key in data) {
      if (data[key] && typeof data[key] === "object") {
        removeIdRecursively(data[key]); // Recurse into nested objects or arrays
      }
    }
  }
}

export const toEuro = (amount) => {
  return amount !== undefined ? amount.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) : "-";
};

export const toPercentage = (amount, addSign = true, decimals = 0) => {
  const sign = addSign ? amount >= 0 ? "+" : "" : "";
  return amount !== undefined ? sign + amount.toLocaleString("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + " %" : "-";
}