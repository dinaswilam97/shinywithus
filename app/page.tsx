import { Hero } from "@/components/Hero";
import { CategoriesStrip } from "@/components/CategoriesStrip";
import { SectionHead } from "@/components/SectionHead";
import { ProductScroller } from "@/components/ProductScroller";
import { ProductGrid } from "@/components/ProductGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { TrustRow } from "@/components/TrustRow";
import { Newsletter } from "@/components/Newsletter";
import { CATEGORIES } from "@/data/categories";
import { getFeaturedProducts, getProductsByCategory } from "@/data/catalog";

/** Two dense desktop rows (6 columns) per category preview. */
const PREVIEW_SIZE = 12;

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <>
      <Hero />

      <div className="wrap">
        <section className="block" id="categories">
          <SectionHead eyebrow="تسوقي حسب" title="الأقسام" />
          <CategoriesStrip />
        </section>

        {/* Hand-curated via the Featured column in products-master.csv. Hidden until products
            are flagged, so the homepage never shows an empty row. */}
        {featured.length > 0 && (
          <section className="block" id="featured">
            <SectionHead eyebrow="مختاراتنا" title="منتجات مميزة" />
            <ProductScroller products={featured} />
          </section>
        )}

        <section className="block">
          <PromoBanner />
        </section>

        {CATEGORIES.map((cat) => {
          const products = getProductsByCategory(cat.slug).slice(0, PREVIEW_SIZE);
          if (products.length === 0) return null;
          return (
            <section className="block" id={cat.slug} key={cat.slug}>
              <SectionHead
                eyebrow="تسوقي حسب"
                title={cat.name}
                seeAllHref={`/collections/${cat.slug}`}
              />
              <ProductGrid products={products} priorityCount={3} />
            </section>
          );
        })}

        <section className="block">
          <TrustRow />
        </section>

        <section className="block">
          <Newsletter />
        </section>
      </div>
    </>
  );
}
