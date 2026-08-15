import Link from "next/link";
import { Icon } from "./Icons";
import { CATEGORIES } from "@/data/products";

export function CategoriesStrip() {
  return (
    <div className="cat-strip">
      {CATEGORIES.map((cat) => (
        <Link key={cat.slug} href={`/collections/${cat.slug}`} className="cat-item">
          <span className="cat-icon">
            <Icon name={cat.icon} size={30} strokeWidth={1.2} />
          </span>
          <span className="label">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
