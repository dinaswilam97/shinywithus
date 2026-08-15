"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      icon: product.icon,
      size,
      color,
      qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      {product.sizes && product.sizes.length > 0 && (
        <>
          <div className="opt-label">المقاس</div>
          <div className="opt-row" role="radiogroup" aria-label="المقاس">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                className={`opt-btn ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {product.colors && product.colors.length > 0 && (
        <>
          <div className="opt-label">اللون</div>
          <div className="opt-row" role="radiogroup" aria-label="اللون">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={color === c}
                className={`opt-btn ${color === c ? "active" : ""}`}
                onClick={() => setColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

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
