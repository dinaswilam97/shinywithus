// Small read-only helpers over the generated catalog (data/products.ts). Keeping them here means
// the generated file stays pure data and can be regenerated at any time.
import { products } from "./products";
import type { Product } from "@/types/product";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

/** Products manually flagged with `Featured = TRUE` in products-master.csv. Empty until curated. */
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
