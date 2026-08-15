import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="promo-banner">
      <div className="sweep" aria-hidden="true" />
      <div>
        <h3>كولكشن الملابس الجديد</h3>
        <p>
          قطع حصرية بقصات عصرية وخامات مريحة — من الكاجوال اليومي للإطلالات
          المسائية.
        </p>
      </div>
      <Link className="btn-solid" href="/collections/clothing-spotlight">
        اكتشفي الكولكشن
      </Link>
    </div>
  );
}
