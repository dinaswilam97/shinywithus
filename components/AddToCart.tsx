"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import { useCart } from "@/context/CartContext";
import type { Product, ProductColor } from "@/types/product";

/**
 * Quantity picker + add-to-cart button. The color variant is chosen by the product page swatch row
 * (see ProductDetail) and passed in, so the gallery, the swatches and the cart always agree.
 */
export function AddToCart({ product, color }: { product: Product; color: ProductColor }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty,
      color: { name: color.name, slug: color.slug },
      ...(product.brand ? { brand: product.brand } : {}),
      ...(product.size ? { size: product.size } : {}),
      ...(color.images[0] ? { image: color.images[0] } : {}),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      {product.size && <div className="opt-label">الحجم: {product.size}</div>}

      <div className="opt-label">الكمية</div>
      <div className="qty-row">
        <button
          className="qty-btn"
          type="button"
          aria-label="إنقاص الكمية"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          <Icon name="minus" size={14} />
        </button>
        <span aria-live="polite">{qty}</span>
        <button
          className="qty-btn"
          type="button"
          aria-label="زيادة الكمية"
          onClick={() => setQty((q) => q + 1)}
        >
          <Icon name="plus" size={14} />
        </button>
      </div>

      <div className="pg-ctas">
        <button className="btn-solid" type="button" onClick={handleAdd}>
          {added ? "تمت الإضافة ✓" : "أضيفي للسلة"}
        </button>
        {added && <span className="added-note">اتضاف المنتج لسلتك 🛍</span>}
      </div>
    </>
  );
}
