import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

/** Dense, continuous-wall catalog grid (2 → 6 columns depending on viewport). */
export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[];
  priorityCount?: number;
}) {
  return (
    <div className="product-grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
