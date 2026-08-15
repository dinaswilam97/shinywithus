"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icons";
import { formatPrice, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const { name, brand, price, oldPrice } = product;

  return (
    <div className="card">
      <Link href={`/products/${product.slug}`} className="card-link">
        <div className="card-media">
          <Icon name={product.icon} size={48} strokeWidth={1.1} style={{ opacity: 0.85 }} />
          <div className="sweep-sm" />
          {oldPrice !== undefined && <span className="badge-sale">خصم</span>}
        </div>
        <div className="card-body">
          <div className="card-brand">{brand}</div>
          <div className="card-name">{name}</div>
          <div className="card-price">
            {oldPrice !== undefined && <del>{formatPrice(oldPrice)}</del>}
            <span>{formatPrice(price)}</span>
          </div>
        </div>
      </Link>
      <button
        className={`wish-btn ${wished ? "active" : ""}`}
        aria-label={wished ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-pressed={wished}
        onClick={() => setWished((v) => !v)}
      >
        <Icon name="heart" size={15} filled={wished} />
      </button>
    </div>
  );
}
