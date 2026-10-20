/**
 * Guest cart persisted in localStorage. Merged into the server cart on sign in.
 * Exposed as a tiny external store so every component stays in sync.
 */
const KEY = 'shopnest_guest_cart';
const listeners = new Set();
let cache = null;

const read = () => {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(cache)) cache = [];
  } catch {
    cache = [];
  }
  return cache;
};

const write = (items) => {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage full or blocked: keep in memory */
  }
  listeners.forEach((fn) => fn());
};

export const lineId = (productId, variantId) => `${productId}:${variantId || ''}`;

export const guestCartStore = {
  subscribe(fn) {
    listeners.add(fn);
    const onStorage = (e) => {
      if (e.key === KEY) {
        cache = null;
        fn();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(fn);
      window.removeEventListener('storage', onStorage);
    };
  },
  getSnapshot: read,
  add({ productId, variantId = null, quantity = 1, isVirtual = false }) {
    const items = [...read()];
    const id = lineId(productId, variantId);
    const existing = items.find((i) => lineId(i.productId, i.variantId) === id);
    if (existing) existing.quantity = isVirtual ? 1 : Math.min(10, existing.quantity + quantity);
    else items.push({ productId, variantId, quantity: isVirtual ? 1 : Math.min(10, quantity) });
    write(items.map((i) => ({ ...i })));
  },
  update(id, quantity) {
    write(read().map((i) => (lineId(i.productId, i.variantId) === id ? { ...i, quantity } : i)));
  },
  remove(id) {
    write(read().filter((i) => lineId(i.productId, i.variantId) !== id));
  },
  clear() {
    write([]);
  },
};

export const readGuestCart = () => read();
export const clearGuestCart = () => guestCartStore.clear();
