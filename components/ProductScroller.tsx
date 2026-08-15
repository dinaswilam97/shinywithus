import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

export function ProductScroller({ products }: { products: Product[] }) {
  return (
    <div className="scroller">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
