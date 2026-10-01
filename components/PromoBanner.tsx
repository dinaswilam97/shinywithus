import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="promo-banner">
      <div className="sweep" aria-hidden="true" />
      <div>
        <h3>اعتني ببشرتك مع تشكيلة العناية والمكياج للوجه</h3>
      </div>
      <Link className="btn-solid" href="/collections/face">
        تسوقي قسم البشرة
      </Link>
    </div>
  );
}
