"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/format";
import type { Product } from "@/types/product";

/** Swatches shown before the rest collapse into a `+N` chip. */
const MAX_VISIBLE_SWATCHES = 4;

/**
 * Dense catalog card. It owns the selected color locally so a swatch tap swaps *this* card's
 * image and quick-add target without navigating or touching any other card.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);
  const [colorSlug, setColorSlug] = useState(
    product.defaultColor || product.colors[0]?.slug || ""
  );
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const color =
    product.colors.find((c) => c.slug === colorSlug) ?? product.colors[0];
  const thumbnail = color?.images[0];
  const detailHref = color
    ? `/products/${product.slug}?color=${color.slug}`
    : `/products/${product.slug}`;
  const visibleColors = product.colors.slice(0, MAX_VISIBLE_SWATCHES);
  const hiddenColors = product.colors.length - visibleColors.length;

  const quickAdd = () => {
    if (!color) return;
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty: 1,
      color: { name: color.name, slug: color.slug },
      ...(product.brand ? { brand: product.brand } : {}),
      ...(product.size ? { size: product.size } : {}),
      ...(thumbnail ? { image: thumbnail } : {}),
    });
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="card">
      <div className="card-media">
        <Link href={detailHref} className="card-media-link" aria-label={product.name}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.name}
              fill
              sizes="(max-width: 560px) 50vw, (max-width: 760px) 33vw, (max-width: 980px) 25vw, (max-width: 1179px) 20vw, 16vw"
              style={{ objectFit: "cover" }}
              priority={priority}
            />
          ) : (
            <span className="media-fallback">
              <Icon name="bag" size={40} strokeWidth={1.1} style={{ opacity: 0.7 }} />
            </span>
          )}
        </Link>

        {product.oldPrice !== undefined && <span className="badge-sale">خصم</span>}

        <button
          type="button"
          className={`quick-add ${added ? "done" : ""}`}
          aria-label={
            color
              ? `أضيفي ${product.name} - ${color.name} للسلة`
              : `أضيفي ${product.name} للسلة`
          }
          onClick={quickAdd}
        >
          <Icon name={added ? "check" : "bag"} size={17} strokeWidth={1.7} />
        </button>

        {added && (
          <span className="card-toast" role="status">
            اتضاف للسلة ✓
          </span>
        )}
      </div>

      <div className="card-body">
        <Link href={detailHref} className="card-name">
          {product.name}
        </Link>
        <div className="card-price">
          {product.oldPrice !== undefined && <del>{formatPrice(product.oldPrice)}</del>}
          <span>{formatPrice(product.price)}</span>
        </div>

        {product.colors.length > 1 && (
          <div className="card-swatches" role="radiogroup" aria-label="اللون">
            {visibleColors.map((c) => (
              <button
                key={c.slug}
                type="button"
                role="radio"
                aria-checked={c.slug === color?.slug}
                aria-label={c.name}
                title={c.name}
                className={`swatch ${c.slug === color?.slug ? "active" : ""}`}
                onClick={() => setColorSlug(c.slug)}
              >
                {c.images[0] && (
                  <Image src={c.images[0]} alt="" fill sizes="34px" style={{ objectFit: "cover" }} />
                )}
              </button>
            ))}
            {hiddenColors > 0 && (
              <Link
                href={`/products/${product.slug}`}
                className="swatch-more"
                aria-label={`${hiddenColors} ألوان أخرى`}
                title={`${hiddenColors} ألوان أخرى`}
              >
                +{hiddenColors}
              </Link>
            )}
          </div>
        )}
      </div>

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
