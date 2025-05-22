import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// claculate the price in word
export function convertToIndianWords(num) {
  if (!num) return '';

  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const tensAndUnits = num % 100;

  const parts = [];

  if (crores) parts.push(`${crores} Crore${crores > 1 ? 's' : ''}`);
  if (lakhs) parts.push(`${lakhs} Lakh${lakhs > 1 ? 's' : ''}`);
  if (thousands) parts.push(`${thousands} Thousand`);
  if (hundreds) parts.push(`${hundreds} Hundred`);
  if (tensAndUnits) parts.push(`${tensAndUnits}`);

  return parts.join(' ') + ' only';
}
