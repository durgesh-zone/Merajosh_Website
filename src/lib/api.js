import axios from 'axios';

export const APP_NAME = 'shop';

/**
 * Axios instance for the API. Auth lives in httpOnly cookies; when the access token
 * expires we transparently call /auth/refresh once and replay the failed request.
 */
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  withCredentials: true,
  headers: { 'X-App': APP_NAME },
});

let refreshing = null;
const listeners = new Set();
export const onSessionExpired = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.startsWith('/auth/');
    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        refreshing ||= api.post('/auth/refresh').finally(() => {
          refreshing = null;
        });
        await refreshing;
        return api(original);
      } catch {
        listeners.forEach((fn) => fn());
      }
    }
    return Promise.reject(error);
  },
);

/** Extracts a human-friendly error message from an API error. */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;
  if (error.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection.';
  return error.response?.data?.message || error.message || fallback;
};

/** Field-level errors from the API ({ field, message }[]), keyed by field. */
export const getFieldErrors = (error) =>
  Object.fromEntries((error?.response?.data?.errors || []).map((e) => [e.field, e.message]));

/** Unwraps `{ success, data, meta }` responses. */
export const unwrap = (promise) => promise.then((res) => res.data.data);
export const unwrapWithMeta = (promise) => promise.then((res) => ({ data: res.data.data, meta: res.data.meta }));
