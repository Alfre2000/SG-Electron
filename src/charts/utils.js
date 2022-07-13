import { capitalize } from "../utils";

export const formatDate = (date, format) => {
  let options;
  switch (format) {
    case "day":
      options = { weekday: "short", day: "numeric", month: "long" };
      break;
    case "week":
      options = { month: "long", year: "numeric" };
      break;
    case "month":
      options = { month: "long", year: "numeric" };
      break;
    case "year":
      options = { year: "numeric" };
      break;
    default:
      break;
  }
  return capitalize(new Date(date).toLocaleString("default", options));
};

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