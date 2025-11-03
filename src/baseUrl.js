// Prefer environment variable when available (Vite: VITE_API_BASE_URL)
export const baseUrl =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "https://amincard.net/api";