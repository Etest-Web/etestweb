import type { SVGProps } from "react";

/**
 * Glypha hairline icon set.
 *
 * Every glyph is drawn on a 24×24 grid at `stroke-width: 1` with round
 * caps and joins — the "ultra-light precise line" register, in deliberate
 * contrast to the heavy 2px stock iconography this system replaces.
 * They inherit `currentColor` and sizing from the `h-* w-*` classes.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </Glyph>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </Glyph>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M20 12H4" />
      <path d="M10 6l-6 6 6 6" />
    </Glyph>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m6 9 6 6 6-6" />
    </Glyph>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m15 6-6 6 6 6" />
    </Glyph>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m9 6 6 6-6 6" />
    </Glyph>
  );
}

export function Search(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.5-4.5" />
    </Glyph>
  );
}

export function MapPin(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </Glyph>
  );
}

export function Star(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m12 4 2.47 5.25 5.53.72-4.06 3.9 1.06 5.63L12 16.8 6.99 19.5 8.06 13.87 4 9.97l5.53-.72L12 4Z" />
    </Glyph>
  );
}

export function Award(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="m8.4 14.2-1 6.3L12 18l4.6 2.5-1-6.3" />
    </Glyph>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.5 19 6v6.2c0 4.2-2.9 7-7 8.3-4.1-1.3-7-4.1-7-8.3V6l7-2.5Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </Glyph>
  );
}

export function Clock(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Glyph>
  );
}

export function Sliders(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M5 8h14M5 16h14" />
      <circle cx="9.5" cy="8" r="2.1" />
      <circle cx="14.5" cy="16" r="2.1" />
    </Glyph>
  );
}

export function Globe(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.3 2.4 3.4 5.4 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.4-3.4-8.5S9.7 5.9 12 3.5Z" />
    </Glyph>
  );
}

export function Users(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="10" cy="9" r="3.4" />
      <path d="M4.2 19.2c.6-3.1 3-5 5.8-5s5.2 1.9 5.8 5" />
      <path d="M16.2 6.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M18 14.5c1.3.9 2.2 2.4 2.5 4.4" />
    </Glyph>
  );
}

export function TrendingUp(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m4 16.5 5-5 3.5 3.5L20 7" />
      <path d="M15 7h5v5" />
    </Glyph>
  );
}

export function Layers(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m12 3.5 8.5 4.2-8.5 4.2L3.5 7.7 12 3.5Z" />
      <path d="m3.5 12.2 8.5 4.3 8.5-4.3" />
      <path d="m3.5 16.4 8.5 4.3 8.5-4.3" />
    </Glyph>
  );
}

export function Check(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Glyph>
  );
}

export function Close(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Glyph>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.5c.7 4.2 2.3 5.8 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5 4.2-.7 5.8-2.3 6.5-6.5Z" />
      <path d="M18 16.5c.35 1.9 1.1 2.65 3 3-1.9.35-2.65 1.1-3 3-.35-1.9-1.1-2.65-3-3 1.9-.35 2.65-1.1 3-3Z" />
    </Glyph>
  );
}

export function Quote(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M9.5 6.5C7 8 5.5 10.2 5.5 13v4.5h5V12H8c0-1.8.8-3.2 2.5-4.3l-1-1.2Z" />
      <path d="M18 6.5C15.5 8 14 10.2 14 13v4.5h5V12h-2.5c0-1.8.8-3.2 2.5-4.3l-1-1.2Z" />
    </Glyph>
  );
}