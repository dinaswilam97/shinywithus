"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export function CartHydrator() {
  const { hydrate } = useCart();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
