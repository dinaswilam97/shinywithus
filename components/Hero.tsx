export function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div>
          <span className="hero-eyebrow">مكياج × عناية × لمعة مختلفة</span>
          <h1>جمالك يبان من أول لمسة</h1>
          <p className="lead">
            تشكيلة مكياج SHEGLAM الأصلية - عيون، شفايف، بشرة وأكتر، بأسعار
            تناسبك ودفع عند الاستلام
          </p>
          <div className="hero-ctas">
            <a className="btn-solid" href="#categories">
              اتسوقي دلوقتي
            </a>
            <a className="btn-line" href="#categories">
              استكشفي الأقسام
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="sweep" />
          <span className="tag">SS / 2026</span>
        </div>
      </div>
    </section>
  );
}
