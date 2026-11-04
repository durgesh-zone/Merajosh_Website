// All server addresses for this app live here (no .env needed).
// `npm run dev`  -> requests go through the Vite proxy to http://localhost:5050
// `npm run build` -> requests go straight to the live API below

export const LIVE_API_URL = 'https://merajosh-server-2.onrender.com';
export const LOCAL_API_URL = 'http://localhost:5050';

// Base origin for API calls, sockets and uploaded files ('' = same origin via the dev proxy).
export const API_URL = import.meta.env.DEV ? '' : LIVE_API_URL;
export const API_BASE_URL = `${API_URL}/api`;
export const SOCKET_URL = API_URL || '/';
