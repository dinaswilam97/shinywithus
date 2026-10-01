"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "./Icons";
import { AddToCart } from "./AddToCart";
import { formatPrice } from "@/data/format";
import type { Product } from "@/types/product";

/**
 * Owns the selected color so the gallery, the swatch row and the add-to-cart action all stay on
 * the same variant. React state lives here because the page itself is a server component.
 * `initialColor` comes from the card's `?color=` link so the page opens on the tapped shade.
 */
export function ProductDetail({
  product,
  initialColor,
}: {
  product: Product;
  initialColor?: string;
}) {
  const [colorSlug, setColorSlug] = useState(
    product.colors.find((c) => c.slug === initialColor)?.slug ??
      product.defaultColor ??
      product.colors[0]?.slug ??
      ""
  );
  const [imageIndex, setImageIndex] = useState(0);

  const color =
    product.colors.find((c) => c.slug === colorSlug) ?? product.colors[0];
  const images = color?.images ?? [];
  const activeImage = images[Math.min(imageIndex, Math.max(images.length - 1, 0))];

  const selectColor = (slug: string) => {
    setColorSlug(slug);
    setImageIndex(0);
  };

  return (
    <div className="pg">
      <div>
        <div className="pg-media">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <Icon name="bag" size={140} strokeWidth={0.9} style={{ opacity: 0.85 }} />
          )}
          <div className="sweep-sm" aria-hidden="true" />
        </div>

        {images.length > 1 && (
          <div className="pg-thumbs" role="tablist" aria-label="صور المنتج">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === imageIndex}
                aria-label={`صورة ${i + 1}`}
                className={`pg-thumb ${i === imageIndex ? "active" : ""}`}
                onClick={() => setImageIndex(i)}
              >
                <Image src={src} alt="" width={64} height={80} style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.brand && <div className="pg-brand">{product.brand}</div>}
        <h1 className="pg-name">{product.name}</h1>
        <div className="pg-price">
          {product.oldPrice !== undefined && (
            <del>{formatPrice(product.oldPrice)}</del>
          )}
          <span>{formatPrice(product.price)}</span>
        </div>

        {product.description && <p className="pg-desc">{product.description}</p>}

        {product.colors.length > 1 && color && (
          <>
            <div className="opt-label">
              اللون: {color.name}
              {color.shadeCode ? ` (${color.shadeCode})` : ""}
            </div>
            <div className="opt-swatches" role="radiogroup" aria-label="اللون">
              {product.colors.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  role="radio"
                  aria-checked={c.slug === color.slug}
                  aria-label={c.name}
                  title={c.name}
                  className={`swatch ${c.slug === color.slug ? "active" : ""}`}
                  onClick={() => selectColor(c.slug)}
                >
                  {c.images[0] && (
                    <Image
                      src={c.images[0]}
                      alt=""
                      fill
                      sizes="56px"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {color && <AddToCart product={product} color={color} />}

        <div className="pg-meta">
          <span>
            <b>شحن سريع</b> — 2-5 أيام عمل
          </span>
          <span>
            <b>دفع آمن</b> — عند الاستلام أو بالبطاقة
          </span>
          <span>
            <b>استرجاع</b> — خلال 14 يوم
          </span>
        </div>
      </div>
    </div>
  );
}
