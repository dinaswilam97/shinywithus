// Dependency-free price formatting so client components don't pull the whole generated catalog
// into their bundle just to render a price.
export function formatPrice(price: number): string {
  return `${price} ج.م`;
}
