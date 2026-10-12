import {
  ArrowLeft as PArrowLeft,
  ArrowRight as PArrowRight,
  ArrowUpRight as PArrowUpRight,
  CaretDown as PCaretDown,
  CaretLeft as PCaretLeft,
  CaretRight as PCaretRight,
  Check as PCheck,
  Clock as PClock,
  Globe as PGlobe,
  MagnifyingGlass as PMagnifyingGlass,
  MapPin as PMapPin,
  Quotes as PQuotes,
  ShieldCheck as PShieldCheck,
  SlidersHorizontal as PSliders,
  Sparkle as PSparkle,
  Stack as PStack,
  Star as PStar,
  TrendUp as PTrendUp,
  Trophy as PTrophy,
  Users as PUsers,
  X as PX,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon, IconProps as PhosphorIconProps } from "@phosphor-icons/react";

/**
 * Glypha icon set, backed by Phosphor.
 *
 * This module previously carried a hand-rolled hairline set. Phosphor covers
 * every glyph we use and ships the same ultra-light register at
 * `weight="light"`, so drawing the paths by hand bought nothing and cost a
 * maintenance burden. Brand marks (Google, GitHub) come from the same family
 * rather than being drawn.
 *
 * `weight` is the standardiser here in place of a `stroke-width`: it is set
 * once below so every glyph in the product draws at the same optical weight.
 *
 * The exported names are unchanged, so call sites are untouched. Imports are
 * aliased with a `P` prefix because several of our names are also Phosphor's.
 */

type IconProps = PhosphorIconProps;

/** Single place the stroke weight is decided for the whole product. */
const WEIGHT: IconProps["weight"] = "light";

function from(Icon: PhosphorIcon, displayName: string) {
  function Glyph({ weight, ...props }: IconProps) {
    return <Icon aria-hidden="true" weight={weight ?? WEIGHT} {...props} />;
  }
  Glyph.displayName = displayName;
  return Glyph;
}

export const ArrowUpRight = from(PArrowUpRight, "ArrowUpRight");
export const ArrowRight = from(PArrowRight, "ArrowRight");
export const ArrowLeft = from(PArrowLeft, "ArrowLeft");
export const MagnifyingGlass = from(PMagnifyingGlass, "MagnifyingGlass");
export const MapPin = from(PMapPin, "MapPin");
export const Star = from(PStar, "Star");
export const Trophy = from(PTrophy, "Trophy");
export const ShieldCheck = from(PShieldCheck, "ShieldCheck");
export const Clock = from(PClock, "Clock");
export const Sliders = from(PSliders, "Sliders");
export const Globe = from(PGlobe, "Globe");
export const Users = from(PUsers, "Users");
export const TrendUp = from(PTrendUp, "TrendUp");
export const Stack = from(PStack, "Stack");
export const Check = from(PCheck, "Check");
export const X = from(PX, "X");
export const Sparkle = from(PSparkle, "Sparkle");
export const Quotes = from(PQuotes, "Quotes");

/**
 * The names this module exported before the move to Phosphor.
 *
 * Several call sites still import these, so they are kept as aliases rather
 * than left to break. Both spellings resolve to the same component, so a
 * half-migrated file still renders identically.
 */
export const CaretDown = from(PCaretDown, "CaretDown");
export const CaretLeft = from(PCaretLeft, "CaretLeft");
export const CaretRight = from(PCaretRight, "CaretRight");

export const ChevronDown = CaretDown;
export const ChevronLeft = CaretLeft;
export const ChevronRight = CaretRight;
export const Search = MagnifyingGlass;
export const Award = Trophy;
export const SlidersHorizontal = Sliders;
export const TrendingUp = TrendUp;
export const Layers = Stack;
export const Close = X;
export const Quote = Quotes;