import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead } from "@/components/SectionHead";
import { ProductScroller } from "@/components/ProductScroller";
import { ProductDetail } from "@/components/ProductDetail";
import { getCategoryMeta } from "@/data/categories";
import { getProductBySlug, getProductsByCategory } from "@/data/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  /** `?color=<slug>` set by the catalog card so the page opens on the tapped shade. */
  searchParams: Promise<{ color?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "shinywithus | Fashion & Beauty" };
  return {
    title: `${product.name} | shinywithus`,
    description: product.description,
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { color } = await searchParams;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const categoryMeta = getCategoryMeta(product.category);
  const related = getProductsByCategory(product.category).filter(
    (p) => p.id !== product.id
  );

  return (
    <div className="wrap">
      <div className="crumbs">
        <Link href="/">الرئيسية</Link>
        <span className="sep">/</span>
        {categoryMeta && (
          <>
            <Link href={`/collections/${categoryMeta.slug}`}>{categoryMeta.name}</Link>
            <span className="sep">/</span>
          </>
        )}
        <span>{product.name}</span>
      </div>

      {/* key: remount per product so the selected color state never leaks across products. */}
      <ProductDetail key={product.id} product={product} initialColor={color} />

      {related.length > 0 && (
        <section className="block">
          <SectionHead
            eyebrow="منتجات مشابهة"
            title={`المزيد من ${categoryMeta?.name ?? "هذا القسم"}`}
            seeAllHref={`/collections/${product.category}`}
          />
          <ProductScroller products={related} />
        </section>
      )}
    </div>
  );
}
