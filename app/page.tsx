import { Hero } from "@/components/Hero";
import { CategoriesStrip } from "@/components/CategoriesStrip";
import { SectionHead } from "@/components/SectionHead";
import { ProductScroller } from "@/components/ProductScroller";
import { PromoBanner } from "@/components/PromoBanner";
import { TrustRow } from "@/components/TrustRow";
import { Newsletter } from "@/components/Newsletter";
import { getSectionProducts } from "@/data/products";

export default function Home() {
  const bestsellers = getSectionProducts("bestsellers");
  const newArrivals = getSectionProducts("new-arrivals");
  const clothing = getSectionProducts("clothing-spotlight");

  return (
    <>
      <Hero />

      <div className="wrap">
        <section className="block" id="categories">
          <SectionHead eyebrow="تسوقي حسب" title="الأقسام" />
          <CategoriesStrip />
        </section>

        <section className="block" id="bestsellers">
          <SectionHead
            eyebrow="الأكتر مبيعًا"
            title="مختارات الأسبوع"
            seeAllHref="/collections/bestsellers"
          />
          <ProductScroller products={bestsellers} />
        </section>

        <section className="block">
          <PromoBanner />
        </section>

        <section className="block">
          <SectionHead
            eyebrow="وصل حديثًا"
            title="أحدث المنتجات"
            seeAllHref="/collections/new-arrivals"
          />
          <ProductScroller products={newArrivals} />
        </section>

        <section className="block">
          <SectionHead
            eyebrow="قسم جديد"
            title="ملابس وإكسسوارات"
            seeAllHref="/collections/clothing-spotlight"
          />
          <ProductScroller products={clothing} />
        </section>

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
