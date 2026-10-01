import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { CATEGORIES, getCategoryMeta } from "@/data/categories";
import { getProductsByCategory } from "@/data/catalog";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) return { title: "shinywithus | Fashion & Beauty" };
  return { title: `${meta.name} | shinywithus` };
}

export default async function CollectionPage({ params }: Props) {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) notFound();

  const products = getProductsByCategory(category);

  return (
    <div className="wrap">
      <div className="crumbs">
        <Link href="/">الرئيسية</Link>
        <span className="sep">/</span>
        <span>{meta.name}</span>
      </div>

      <div className="collection-head">
        <h1>{meta.name}</h1>
        <span className="collection-count">{products.length} منتج</span>
      </div>

      {/* Sticky chip row — categories stay reachable while scrolling the grid. */}
      <div className="filter-bar">
        <div className="filter-chips">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className={`chip ${c.slug === category ? "active" : ""}`}
              aria-current={c.slug === category ? "page" : undefined}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <ProductGrid products={products} priorityCount={6} />
    </div>
  );
}
