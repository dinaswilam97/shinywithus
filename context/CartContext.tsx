"use client";

import { useMemo, useSyncExternalStore } from "react";

/** The shopper-selected color variant carried into the cart. */
export type CartColor = {
  name: string;
  slug: string;
};

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  /** First image of the selected color, used as the cart thumbnail. */
  image?: string;
  /** Optional — the generated catalog has no brand data yet. */
  brand?: string;
  /** Single informational size per product (from the CSV Size column), when present. */
  size?: string;
  color?: CartColor;
};

export type CartStore = {
  subscribe: (cb: () => void) => () => void;
  getItems: () => CartItem[];
  getServerItems: () => CartItem[];
  hydrate: () => void;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (slug: string, size?: string, colorSlug?: string) => void;
  updateQty: (
    slug: string,
    size: string | undefined,
    colorSlug: string | undefined,
    delta: number
  ) => void;
  clear: () => void;
};

const STORAGE_KEY = "shinywithus-cart";
const EMPTY: CartItem[] = [];

/** Drops anything that doesn't match the current CartItem shape (e.g. carts stored by the old
 *  mock catalog, where `color` was a plain string and `icon` was required). */
function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return EMPTY;
  const items: CartItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const it = entry as Record<string, unknown>;
    if (typeof it.slug !== "string" || typeof it.name !== "string") continue;
    const qty = typeof it.qty === "number" && it.qty > 0 ? Math.floor(it.qty) : 1;
    const item: CartItem = {
      slug: it.slug,
      name: it.name,
      price: typeof it.price === "number" ? it.price : 0,
      qty,
    };
    if (typeof it.image === "string") item.image = it.image;
    if (typeof it.brand === "string") item.brand = it.brand;
    if (typeof it.size === "string") item.size = it.size;
    const color = it.color as { name?: unknown; slug?: unknown } | undefined;
    if (color && typeof color === "object" && typeof color.name === "string" && typeof color.slug === "string") {
      item.color = { name: color.name, slug: color.slug };
    }
    items.push(item);
  }
  return items;
}

function createStore(): CartStore {
  let items: CartItem[] = EMPTY;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const l of listeners) l();
  };
  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / availability errors */
    }
  };
  const key = (slug: string, size?: string, colorSlug?: string) =>
    `${slug}|${size ?? ""}|${colorSlug ?? ""}`;

  return {
    subscribe(cb) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    getItems: () => items,
    getServerItems: () => EMPTY,
    hydrate() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        items = raw ? sanitize(JSON.parse(raw)) : EMPTY;
      } catch {
        items = EMPTY;
      }
      emit();
    },
    addItem(item) {
      const k = key(item.slug, item.size, item.color?.slug);
      const existing = items.find(
        (i) => key(i.slug, i.size, i.color?.slug) === k
      );
      items = existing
        ? items.map((i) =>
            key(i.slug, i.size, i.color?.slug) === k
              ? { ...i, qty: i.qty + (item.qty ?? 1) }
              : i
          )
        : [...items, { ...item, qty: item.qty ?? 1 }];
      persist();
      emit();
    },
    removeItem(slug, size, colorSlug) {
      const k = key(slug, size, colorSlug);
      items = items.filter((i) => key(i.slug, i.size, i.color?.slug) !== k);
      persist();
      emit();
    },
    updateQty(slug, size, colorSlug, delta) {
      const k = key(slug, size, colorSlug);
      items = items
        .map((i) =>
          key(i.slug, i.size, i.color?.slug) === k
            ? { ...i, qty: Math.max(0, i.qty + delta) }
            : i
        )
        .filter((i) => i.qty > 0);
      persist();
      emit();
    },
    clear() {
      items = EMPTY;
      persist();
      emit();
    },
  };
}

const store = createStore();

export function useCart() {
  const items = useSyncExternalStore(
    store.subscribe,
    store.getItems,
    store.getServerItems
  );

  return useMemo(
    () => ({
      items,
      count: items.reduce((acc, i) => acc + i.qty, 0),
      total: items.reduce((acc, i) => acc + i.qty * i.price, 0),
      addItem: store.addItem,
      removeItem: store.removeItem,
      updateQty: store.updateQty,
      clear: store.clear,
      hydrate: store.hydrate,
    }),
    [items]
  );
}
