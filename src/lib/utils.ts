import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const round = (num: number, precision: number) => {
  const factor = Math.pow(10, precision)
  return Math.round(num * factor) / factor
}