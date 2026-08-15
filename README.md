# shinywithus

متجر إلكتروني (أزياء + مكياج وعناية بالبشرة) موجّه للسوق المصري — **RTL بالكامل**، هوية بصرية أبيض/أسود بلمسة "shiny" المميزة (حركة shine sweep). مبنى بـ **Next.js (App Router) + TypeScript + Tailwind CSS**، ومطابق بصريًا للمرجع `shinywithus-reference.html`.

## التشغيل محليًا

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## الأوامر

```bash
npm run dev      # خادم التطوير
npm run build    # بناء إنتاجي
npm run start    # تشغيل البناء الإنتاجي
npm run lint     # فحص الكود
```

## هيكل المشروع

```
app/
  layout.tsx                    # RTL + خطوط Google Fonts + AnnouncementBar/Header/Footer
  page.tsx                      # الصفحة الرئيسية (كل الأقسام بالترتيب)
  collections/[category]/       # صفحة التصنيف (شبكة منتجات)
  products/[slug]/              # صفحة المنتج الفردي
  cart/                         # صفحة السلة
components/                     # AnnouncementBar, Header, Footer, Hero, ProductCard,
                                # ProductScroller, CategoriesStrip, PromoBanner,
                                # TrustRow, Newsletter, AddToCart, Icons (SVG)
context/CartContext.tsx         # سلة شراء (localStorage + useSyncExternalStore)
data/products.ts                # نموذج Product + بيانات تجريبية (placeholder)
```

## البيانات

كل الأسعار والمنتجات في `/data/products.ts` **تجريبية** (placeholder) بأسماء غير حقيقية — تُستبدل ببيانات حقيقية (Shopify Storefront API أو أي backend) قبل الإطلاق.

## النشر (GitHub + Vercel)

```bash
git init                    # تم بالفعل عند الإنشاء
git add .
git commit -m "Initial shinywithus storefront"
git branch -M main
git remote add origin https://github.com/<username>/shinywithus.git
git push -u origin main
```

ثم من [vercel.com](https://vercel.com) → **Add New Project** → اختيار الريبو من GitHub → Vercel يكتشف Next.js تلقائيًا → **Deploy**. أي push جديد على `main` يعمل deploy تلقائي، وكل PR يحصل على Preview URL.

## ملاحظات

- الإيموجي في المرجع استُبدل بأيقونات SVG outline (أسود/أبيض فقط).
- `prefers-reduced-motion: reduce` يلغي كل الحركات تلقائيًا.
- الصور الحقيقية (عند توفيرها) لازم تحافظ على نسبة 3:4 للكروت.
