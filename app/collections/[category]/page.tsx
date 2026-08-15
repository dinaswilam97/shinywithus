import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead } from "@/components/SectionHead";
import { ProductCard } from "@/components/ProductCard";
import {
  getCategoryMeta,
  getProductsByCategory,
  getSaleProducts,
  getSectionProducts,
  type Product,
  type Section,
} from "@/data/products";

const SECTION_META: Record<Section, { eyebrow: string; title: string }> = {
  bestsellers: { eyebrow: "الأكتر مبيعًا", title: "مختارات الأسبوع" },
  "new-arrivals": { eyebrow: "وصل حديثًا", title: "أحدث المنتجات" },
  "clothing-spotlight": { eyebrow: "قسم جديد", title: "ملابس وإكسسوارات" },
};

const SALE_META = { eyebrow: "عروض", title: "تخفيضات" };

function resolveProducts(slug: string): Product[] | null {
  if (slug === "sale") return getSaleProducts();
  if (slug in SECTION_META) return getSectionProducts(slug as Section);
  if (getCategoryMeta(slug)) return getProductsByCategory(slug);
  return null;
}

function resolveTitle(slug: string): string | null {
  if (slug === "sale") return SALE_META.title;
  if (slug in SECTION_META) return SECTION_META[slug as Section].title;
  return getCategoryMeta(slug)?.name ?? null;
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const title = resolveTitle(category);
  if (!title) return { title: "shinywithus | Fashion & Beauty" };
  return { title: `${title} | shinywithus` };
}

export default async function CollectionPage({ params }: Props) {
  const { category } = await params;
  const products = resolveProducts(category);
  const title = resolveTitle(category);

  if (!products || !title) notFound();

  const eyebrow =
    category === "sale"
      ? SALE_META.eyebrow
      : category in SECTION_META
        ? SECTION_META[category as Section].eyebrow
        : "تسوقي حسب";

  return (
    <div className="wrap">
      <div className="crumbs">
        <Link href="/">الرئيسية</Link>
        <span className="sep">/</span>
        <span>{title}</span>
      </div>

      <section className="block" style={{ paddingTop: 0 }}>
        <SectionHead eyebrow={eyebrow} title={title} />
        <p className="collection-count">
          {products.length} منتج
        </p>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
