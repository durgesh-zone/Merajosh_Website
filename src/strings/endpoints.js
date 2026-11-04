// All server addresses for this app live here (no .env needed).
export const LIVE_API_URL = 'https://merajosh-server-2.onrender.com';

// `npm run dev`   -> relative URLs, forwarded to LIVE_API_URL by the Vite proxy (vite.config.js)
// `npm run build` -> requests go straight to LIVE_API_URL
export const API_URL = import.meta.env.DEV ? '' : LIVE_API_URL;
export const API_BASE_URL = `${API_URL}/api`;
export const SOCKET_URL = API_URL || '/';
