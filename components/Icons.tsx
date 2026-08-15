import type { SVGProps } from "react";

/**
 * Simple outline SVG icon set — black/white only, per the visual identity.
 * Product glyphs double as the 3:4 media placeholders until real images exist.
 */

export type IconName =
  | "search"
  | "user"
  | "heart"
  | "bag"
  | "burger"
  | "close"
  | "check"
  | "truck"
  | "lock"
  | "chat"
  | "arrow-left"
  | "minus"
  | "plus"
  | "trash"
  | "dress"
  | "tee"
  | "blazer"
  | "coat"
  | "shirt"
  | "jeans"
  | "heels"
  | "sneaker"
  | "bag-product"
  | "lipstick"
  | "gloss"
  | "brow"
  | "mascara"
  | "wand"
  | "serum"
  | "jar"
  | "bottle"
  | "sheetmask"
  | "perfume"
  | "watch"
  | "cap"
  | "jewelry";

const GLYPHS: Record<IconName, React.ReactNode> = {
  /* ===== UI ===== */
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.7-3.7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </>
  ),
  heart: (
    <path d="M12 20.5S4.7 16 2.8 11.7C1.3 8.6 3.4 5 6.7 5c2 0 3.6 1.1 5.3 3 1.7-1.9 3.3-3 5.3-3 3.3 0 5.4 3.6 3.9 6.7-1.9 4.3-9.2 8.8-9.2 8.8z" />
  ),
  bag: (
    <>
      <path d="M6 8h12l1.2 12.5H4.8z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  burger: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="m4.5 12.5 5 5L19.5 6.5" />,
  truck: (
    <>
      <path d="M2.5 6h12v10h-12z" />
      <path d="M14.5 9.5h4l3 3v3.5h-7z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  chat: <path d="M21 12a8 8 0 0 1-8 8H4.5l1.8-3A8 8 0 1 1 21 12z" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />,

  /* ===== Product glyphs (media placeholders) ===== */
  dress: (
    <path d="M12 2.5c-2 1.2-3.4 2.2-4 4l-4.5 2.4 2.6 4L9 11.6l.4 9.9h5.2l.4-9.9 2.9 1.3 2.6-4-4.5-2.4c-.6-1.8-2-2.8-4-4z" />
  ),
  tee: (
    <path d="M8.5 3 4 6l2.2 4L9 8.5V21h6V8.5L17.8 10 20 6l-4.5-3c-1.2.8-2.6.8-3.5 0-1 .8-2.3.8-3.5 0z" />
  ),
  blazer: (
    <>
      <path d="M8.5 3 4 6l2.2 4L9 8.5V21h6V8.5L17.8 10 20 6l-4.5-3c-1.2.8-2.6.8-3.5 0-1 .8-2.3.8-3.5 0z" />
      <path d="M12 8.5V21" />
    </>
  ),
  coat: (
    <>
      <path d="M8.5 3 4 6l2.2 4L9 8.5V6h6v2.5L17.8 10 20 6l-4.5-3c-1.2.8-2.6.8-3.5 0-1 .8-2.3.8-3.5 0z" />
      <path d="M9.5 13h5l1.5 8H8z" />
    </>
  ),
  shirt: (
    <>
      <path d="M8.5 3 4 6l2.2 4L9 8.5V21h6V8.5L17.8 10 20 6l-4.5-3c-1.2.8-2.6.8-3.5 0-1 .8-2.3.8-3.5 0z" />
      <path d="M12 10.5V21" />
    </>
  ),
  jeans: (
    <>
      <path d="M7 3h10v3l-.7 6H7.7z" />
      <path d="M7.7 12h3l.6 9h-2.4z" />
      <path d="M13.3 12h3l-.6 9h-2.4z" />
    </>
  ),
  heels: (
    <>
      <path d="M10 21c0-8 4-13 10-17l1 3c-4 3-6 7-6 14" />
      <path d="M4 21h16" />
    </>
  ),
  sneaker: (
    <>
      <path d="M3 17c2-1 5-1.5 9-1 3 .4 6 .4 9-1v2c-2 1.5-5 2-9 2s-6-.4-9-2z" />
      <path d="M3 17v-3h5l2 3" />
      <path d="m8 14 2-3h4l1 3" />
    </>
  ),
  "bag-product": (
    <>
      <path d="M4.5 9h15l1.5 12h-18z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </>
  ),
  lipstick: (
    <>
      <rect x="8.5" y="3" width="7" height="4" />
      <path d="M9.5 7h5l1.5 13h-8z" />
      <path d="M9.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </>
  ),
  gloss: (
    <>
      <path d="M7 9h10l1 12H6z" />
      <path d="M8 9c0-2 1.8-3 4-3s4 1 4 3" />
    </>
  ),
  brow: (
    <>
      <path d="m4 20 11-11" />
      <path d="m5 19 14.5-1.5L22 15l-3-3-2.5 2.5" />
    </>
  ),
  mascara: (
    <>
      <path d="M9 5h6l1 16H8z" />
      <path d="M9 5V3.5a1.5 1.5 0 0 1 3 0V5" />
    </>
  ),
  wand: (
    <>
      <path d="M7 3h10v3H7z" />
      <path d="M9 6v3h6V6" />
      <path d="M9 9h6l1.5 12h-9z" />
    </>
  ),
  serum: (
    <>
      <path d="M9 3h6M12 3v3" />
      <path d="M10 6h4l-1 4h-2z" />
      <rect x="9" y="10" width="6" height="11" />
    </>
  ),
  jar: (
    <>
      <path d="M8 8a4 4 0 0 1 8 0" />
      <path d="M8 8h8l1.5 13h-11z" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3h4v3l1 2v13H9V8l1-2z" />
      <path d="M12 7v3" />
    </>
  ),
  sheetmask: (
    <>
      <path d="M12 4c3 0 5 2 5 4.5S14.5 12 12 12s-5-1.5-5-3.5S9 4 12 4z" />
      <path d="M10 7.5h.01M14 7.5h.01" />
      <path d="M10.5 9.8c1 .7 2 .7 3 0" />
    </>
  ),
  perfume: (
    <>
      <rect x="8.5" y="3" width="7" height="4" rx="0.5" />
      <path d="M9.5 7h5l1.5 14h-8z" />
    </>
  ),
  watch: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8.5V12l2.5 2" />
      <path d="M9 3h6M9 21h6" />
    </>
  ),
  cap: (
    <>
      <path d="M6 14a6 6 0 0 1 12 0" />
      <path d="M3 14h18" />
      <circle cx="12" cy="8.5" r="1" />
    </>
  ),
  jewelry: (
    <>
      <path d="M4.5 8.5c3.5 3 7.5 3.5 7.5 3.5s4-.5 7.5-3.5" />
      <circle cx="12" cy="14.5" r="2.5" />
    </>
  ),
};

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
};

export function Icon({
  name,
  size = 24,
  strokeWidth = 1.5,
  filled = false,
  ...rest
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {GLYPHS[name]}
    </svg>
  );
}
