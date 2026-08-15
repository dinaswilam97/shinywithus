"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

function itemsLabel(n: number) {
  if (n === 1) return "منتج واحد في سلتك";
  if (n === 2) return "منتجان في سلتك";
  if (n >= 3 && n <= 10) return `${n} منتجات في سلتك`;
  return `${n} منتج في سلتك`;
}

export default function CartPage() {
  const { items, count, total, updateQty, removeItem } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  if (items.length === 0) {
    return (
      <div className="wrap">
        <div className="cart-empty">
          <div className="big">
            <Icon name="bag" size={44} />
          </div>
          <h3>سلتك فاضية</h3>
          <p>لسه مأضفتيش أي منتجات — ابدئي التسوق واكتشفي أحدث القطع.</p>
          <Link className="btn-solid" href="/">
            ابدئي التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="cart-wrap">
        <h1 className="cart-title">سلة التسوق</h1>
        <p className="cart-sub">{itemsLabel(count)}</p>

        <div className="cart-grid">
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-row" key={`${item.slug}-${item.size}-${item.color}`}>
                <div className="cart-thumb">
                  <Icon name={item.icon} size={34} strokeWidth={1.1} style={{ opacity: 0.85 }} />
                </div>
                <div>
                  <div className="cb">{item.brand}</div>
                  <h4>{item.name}</h4>
                  {(item.size || item.color) && (
                    <div className="cv">
                      {[item.size, item.color].filter(Boolean).join(" — ")}
                    </div>
                  )}
                  <div className="qty-mini">
                    <button
                      type="button"
                      aria-label="إنقاص الكمية"
                      onClick={() => updateQty(item.slug, item.size, item.color, -1)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="زيادة الكمية"
                      onClick={() => updateQty(item.slug, item.size, item.color, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="row-end" style={{ textAlign: "left" }}>
                  <div className="cp">{formatPrice(item.price * item.qty)}</div>
                  <button
                    className="cart-remove"
                    type="button"
                    onClick={() => removeItem(item.slug, item.size, item.color)}
                  >
                    إزالة
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-side">
            <h3>ملخص الطلب</h3>
            <div className="side-row">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="side-row">
              <span>الشحن</span>
              <span>{total >= 2000 ? "مجاني" : "60 ج.م"}</span>
            </div>
            <div className="side-row total">
              <span>الإجمالي</span>
              <span>{formatPrice(total + (total >= 2000 ? 0 : 60))}</span>
            </div>
            <button
              className="btn-solid"
              type="button"
              onClick={() => {
                setCheckedOut(true);
                window.setTimeout(() => setCheckedOut(false), 3000);
              }}
            >
              إتمام الطلب
            </button>
            {checkedOut && (
              <div className="checkout-msg" role="status">
                نسخة تجريبية — الدفع الإلكتروني هيتفعّل قريبًا ✨
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
