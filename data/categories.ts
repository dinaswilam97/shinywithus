// Hand-written display metadata for the catalog categories. The slugs must match the `category`
// field generated in data/products.ts (CSV Category column, lowercased). Kept out of the
// generated file so `node scripts/generate-products-data.ts` never overwrites it.
import type { IconName } from "@/components/Icons";

export type CategoryMeta = {
  slug: string;
  /** Arabic display name. */
  name: string;
  /** Icon from components/Icons.tsx used in the categories strip. */
  icon: IconName;
};

export const CATEGORIES: CategoryMeta[] = [
  { slug: "eyes", name: "عيون", icon: "mascara" },
  { slug: "lips", name: "شفايف", icon: "lipstick" },
  { slug: "face", name: "بشرة", icon: "jar" },
  { slug: "hair", name: "شعر", icon: "hair-brush" },
];

export function getCategoryMeta(categorySlug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === categorySlug);
}
