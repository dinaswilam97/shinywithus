"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icons";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/collections/clothing-women", label: "ملابس حريمي" },
  { href: "/collections/clothing-men", label: "ملابس رجالي" },
  { href: "/collections/makeup", label: "المكياج" },
  { href: "/collections/skincare", label: "العناية بالبشرة" },
  { href: "/collections/fragrance", label: "العطور" },
  { href: "/collections/accessories", label: "إكسسوارات" },
  { href: "/collections/sale", label: "تخفيضات" },
];

export function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="header-inner">
        <button
          className="icon-btn burger"
          aria-label="القائمة"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <Icon name="close" size={18} /> : <Icon name="burger" size={18} />}
        </button>

        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          shiny<span className="shine">withus</span>
        </Link>

        <nav className="mainnav" aria-label="القائمة الرئيسية">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="بحث">
            <Icon name="search" size={18} />
          </button>
          <button className="icon-btn" aria-label="حسابي">
            <Icon name="user" size={18} />
          </button>
          <button className="icon-btn" aria-label="المفضلة">
            <Icon name="heart" size={18} />
          </button>
          <Link href="/cart" className="icon-btn" aria-label="السلة" style={{ position: "relative" }}>
            <Icon name="bag" size={18} />
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>

      <nav
        className={`mobile-nav ${menuOpen ? "open" : ""}`}
        aria-label="القائمة الرئيسية"
      >
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
