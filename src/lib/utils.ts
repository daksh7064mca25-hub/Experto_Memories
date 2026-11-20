import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(prefix: string = "gift"): string {
  const clean = prefix
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${clean || "apology"}-${randomStr}`;
}

