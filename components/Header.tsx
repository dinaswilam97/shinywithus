"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icons";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/data/categories";

const NAV_LINKS = CATEGORIES.map((c) => ({
  href: `/collections/${c.slug}`,
  label: c.name,
}));

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

        {/* `hide-sm`: on phones only the cart stays, so nothing gets pushed off-screen. */}
        <div className="header-actions">
          <button className="icon-btn hide-sm" aria-label="بحث">
            <Icon name="search" size={18} />
          </button>
          <button className="icon-btn hide-sm" aria-label="حسابي">
            <Icon name="user" size={18} />
          </button>
          <button className="icon-btn hide-sm" aria-label="المفضلة">
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
