export function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div>
          <span className="hero-eyebrow">أزياء × جمال × لمعة مختلفة</span>
          <h1>
            خليكي دايمًا
            <br />
            <span className="shine-text">shiny with us</span>
          </h1>
          <p className="lead">
            من الملابس والإكسسوارات لأحدث منتجات المكياج والعناية بالبشرة — كل
            اللي محتاجاه عشان تطلعي بأحسن نسخة منك، في مكان واحد.
          </p>
          <div className="hero-ctas">
            <a className="btn-solid" href="#bestsellers">
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
