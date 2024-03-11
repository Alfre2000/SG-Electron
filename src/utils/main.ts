export const toCamelCase = <T>(str: T) => {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

type RecursiveObject = { [key: string]: any };

export function removeIdRecursively(data: RecursiveObject | RecursiveObject[]): void {
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

export const toEuro = (value: string | number, decimals: number = 2) => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  return value.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const toFormattedNumber = (value: string | number) => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  return value.toLocaleString("it-IT", {maximumFractionDigits: 4});
};
