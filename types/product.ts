// Shared product types for the storefront.
//
// These describe the catalog generated from `organized-products/products-master.csv`
// (see `scripts/generate-products-data.ts` and the generated `data/products.ts`).

export interface ProductColor {
  /** Display name, e.g. "Chocolate". */
  name: string;
  /** URL/folder-safe slug, e.g. "chocolate". */
  slug: string;
  /** Shade code from the source data, e.g. "013", only when present. */
  shadeCode?: string;
  /** Public paths, e.g. "/products/eyes/sheglam-real-flow-laminating-brow-pen/chocolate/1.jpg". */
  images: string[];
}

export interface Product {
  /** SKU from the source CSV, e.g. "EYE-006". */
  id: string;
  /** Unique product slug used in URLs, e.g. "sheglam-real-flow-laminating-brow-pen". */
  slug: string;
  /** Product name from the CSV. */
  name: string;
  /** Category slug, e.g. "eyes". */
  category: string;
  /** Placeholder price (0) until real prices are filled in manually. */
  price: number;
  oldPrice?: number;
  /** Size from the CSV Size column, when present. */
  size?: string;
  isSetOrTool: boolean;
  colors: ProductColor[];
  /** Slug of the first color. */
  defaultColor: string;
  /** Carried through from the source data so review-workflow filtering stays possible. */
  needsReview: boolean;
  /** Manual curation flag (`Featured` column in the CSV) — drives the homepage featured row. */
  featured: boolean;
  /**
   * Optional copy fields kept from the previous mock-data shape. They are intentionally
   * left unpopulated by the generator — fill them in manually (or via a future CSV import)
   * rather than inventing marketing copy.
   */
  brand?: string;
  description?: string;
}
