"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { IconName } from "@/components/Icons";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  icon: IconName;
  size?: string;
  color?: string;
  qty: number;
};

export type CartStore = {
  subscribe: (cb: () => void) => () => void;
  getItems: () => CartItem[];
  getServerItems: () => CartItem[];
  hydrate: () => void;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (slug: string, size?: string, color?: string) => void;
  updateQty: (
    slug: string,
    size: string | undefined,
    color: string | undefined,
    delta: number
  ) => void;
  clear: () => void;
};

const STORAGE_KEY = "shinywithus-cart";
const EMPTY: CartItem[] = [];

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
  const key = (slug: string, size?: string, color?: string) =>
    `${slug}|${size ?? ""}|${color ?? ""}`;

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
        items = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
      } catch {
        items = EMPTY;
      }
      emit();
    },
    addItem(item) {
      const k = key(item.slug, item.size, item.color);
      const existing = items.find(
        (i) => key(i.slug, i.size, i.color) === k
      );
      items = existing
        ? items.map((i) =>
            key(i.slug, i.size, i.color) === k
              ? { ...i, qty: i.qty + (item.qty ?? 1) }
              : i
          )
        : [...items, { ...item, qty: item.qty ?? 1 }];
      persist();
      emit();
    },
    removeItem(slug, size, color) {
      const k = key(slug, size, color);
      items = items.filter((i) => key(i.slug, i.size, i.color) !== k);
      persist();
      emit();
    },
    updateQty(slug, size, color, delta) {
      const k = key(slug, size, color);
      items = items
        .map((i) =>
          key(i.slug, i.size, i.color) === k
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
