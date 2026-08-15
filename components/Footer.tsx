import Link from "next/link";

const COLUMNS = [
  {
    title: "ملابس",
    links: [
      { label: "حريمي", href: "/collections/clothing-women" },
      { label: "رجالي", href: "/collections/clothing-men" },
      { label: "شنط وأحذية", href: "/collections/bags" },
    ],
  },
  {
    title: "جمال",
    links: [
      { label: "المكياج", href: "/collections/makeup" },
      { label: "العناية بالبشرة", href: "/collections/skincare" },
      { label: "العطور", href: "/collections/fragrance" },
    ],
  },
  {
    title: "معلومات",
    links: [
      { label: "سياسة الشحن", href: "#" },
      { label: "الشروط والأحكام", href: "#" },
      { label: "سياسة الاسترجاع", href: "#" },
    ],
  },
  {
    title: "تواصلي معنا",
    links: [
      { label: "info@shinywithus.com", href: "mailto:info@shinywithus.com" },
      { label: "خدمة العملاء 24/7", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">shinywithus</div>
            <p>
              متجرك الموثوق للأزياء ومستحضرات التجميل والعناية بالبشرة، بخبرة
              توصيل لكل محافظات مصر.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h5>{col.title}</h5>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <span>© 2026 shinywithus. جميع الحقوق محفوظة.</span>
          <div className="foot-social">
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="Facebook">
              FB
            </a>
            <a href="#" aria-label="TikTok">
              TT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
