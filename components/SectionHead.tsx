import Link from "next/link";

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  seeAllHref?: string;
};

export function SectionHead({ eyebrow, title, seeAllHref }: SectionHeadProps) {
  return (
    <div className="block-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {seeAllHref && (
        <Link className="see-all" href={seeAllHref}>
          عرض الكل ←
        </Link>
      )}
    </div>
  );
}
