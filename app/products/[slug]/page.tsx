import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icons";
import { AddToCart } from "@/components/AddToCart";
import { SectionHead } from "@/components/SectionHead";
import { ProductScroller } from "@/components/ProductScroller";
import {
  formatPrice,
  getCategoryMeta,
  getProductBySlug,
  getProductsByCategory,
} from "@/data/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "shinywithus | Fashion & Beauty" };
  return {
    title: `${product.name} | shinywithus`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
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

      <div className="pg">
        <div className="pg-media">
          <Icon
            name={product.icon}
            size={140}
            strokeWidth={0.9}
            style={{ opacity: 0.85 }}
          />
          <div className="sweep-sm" aria-hidden="true" />
        </div>

        <div>
          <div className="pg-brand">{product.brand}</div>
          <h1 className="pg-name">{product.name}</h1>
          <div className="pg-price">
            {product.oldPrice !== undefined && (
              <del>{formatPrice(product.oldPrice)}</del>
            )}
            <span>{formatPrice(product.price)}</span>
          </div>

          <p className="pg-desc">{product.description}</p>

          <AddToCart product={product} />

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
