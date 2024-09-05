import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const round = (num: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
};

export const durata = (start: Date, end: Date): string => {
  // Calcola la differenza in millisecondi
  const diffMs = end.getTime() - start.getTime();

  // Calcola la differenza in secondi, minuti e ore
  const diffSeconds = Math.floor(diffMs / 1000);
  const seconds = diffSeconds % 60;
  const diffMinutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  // Costruisci la stringa di output
  let result = "";
  if (hours > 0) {
    result += hours + " or" + (hours > 1 ? "e" : "a");
  }
  if (minutes > 0) {
    if (result.length > 0) {
      result += " e ";
    }
    result += minutes + " minut" + (minutes > 1 ? "i" : "o");
  }
  if (seconds > 0 && hours === 0 && minutes === 0) {
    if (result.length > 0) {
      result += " e ";
    }
    result += seconds + " second" + (seconds > 1 ? "i" : "o");
  }

  // Se la durata è inferiore a un secondo, predefinisci a '0 secondi'
  if (result.length === 0) {
    result = "0 secondi";
  }

  return result;
};

export const peso = (quantità_mg: number): string => {
  // Check if the quantity is less than 1000 milligrams
  if (quantità_mg < 1000) {
    return `${quantità_mg.toLocaleString("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} mg`;
  } else {
    // Convert to grams
    const grammi = quantità_mg / 1000;
    return `${grammi.toLocaleString("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} g`;
  }
};

export const spessori = (minimo?: number, massimo?: number): string => {
  if (minimo && massimo) {
    return `${minimo} - ${massimo} µm`;
  } else if (minimo) {
    return `min. ${minimo} µm`;
  } else if (massimo) {
    return `max. ${massimo} µm`;
  } else {
    return "";
  }
}
