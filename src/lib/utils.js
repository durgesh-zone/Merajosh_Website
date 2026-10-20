import clsx from 'clsx';

export const cn = (...args) => clsx(...args);

const API_URL = import.meta.env.VITE_API_URL || '';

/** Resolves server-relative upload URLs (/uploads/...) against the API origin. */
export const assetUrl = (url) => {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${API_URL}${url}`;
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Turns a URLSearchParams into a plain object, dropping empty values. */
export const paramsToObject = (params) => Object.fromEntries([...params.entries()].filter(([, v]) => v !== ''));
