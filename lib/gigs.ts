/**
 * Marketplace domain model — the Fiverr half of the Dribbble × Fiverr
 * hybrid.
 *
 * Dribbble sells *taste*: a wall of work you can feel. Fiverr sells
 * *certainty*: a named deliverable, a price, a deadline, a seller level.
 * This module is where that certainty is modelled, so both the landing
 * page and /designers can render from one source of truth.
 */

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Category {
  id: string;
  label: string;
  /** Shown under the category name in the rail. */
  blurb: string;
  count: number;
  /** Editorial palette key — see `.tag-*` in globals.css. */
  tone: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "Everything", blurb: "The full bench", count: 1240, tone: "tag-uiux" },
  { id: "ui-ux-design", label: "UI/UX Design", blurb: "Product & app interfaces", count: 280, tone: "tag-uiux" },
  { id: "logo-design", label: "Logo Design", blurb: "Marks, wordmarks, systems", count: 195, tone: "tag-logo" },
  { id: "brand-identity", label: "Brand Identity", blurb: "Full guideline systems", count: 150, tone: "tag-branding" },
  { id: "illustration", label: "Illustration", blurb: "Editorial & spot work", count: 180, tone: "tag-illustration" },
  { id: "motion-design", label: "Motion Design", blurb: "3D, loops, title sequences", count: 95, tone: "tag-motion" },
  { id: "web-design", label: "Web Design", blurb: "Marketing sites & landing pages", count: 140, tone: "tag-web" },
  { id: "video-editing", label: "Video Editing", blurb: "Cuts, colour, sound design", count: 75, tone: "tag-video" },
  { id: "packaging-design", label: "Packaging", blurb: "Structure & print-ready dielines", count: 60, tone: "tag-packaging" },
];

export const SKILL_LABELS: Record<string, string> = {
  "youtube-thumbnail": "YouTube Thumbnails",
  "logo-design": "Logo Design",
  "brand-identity": "Brand Identity",
  "ui-ux-design": "UI/UX Design",
  "product-design": "Product Design",
  "design-systems": "Design Systems",
  "illustration": "Illustration",
  "character-design": "Character Design",
  "motion-design": "Motion Design",
  "video-editing": "Video Editing",
  "after-effects": "After Effects",
  "packaging-design": "Packaging Design",
  "print-design": "Print Design",
  "web-design": "Web Design",
  framer: "Framer",
  webflow: "Webflow",
  "landing-pages": "Landing Pages",
};

export const CATEGORY_TONES: Record<string, string> = {
  "ui-ux-design": "tag-uiux",
  "logo-design": "tag-logo",
  "brand-identity": "tag-branding",
  illustration: "tag-illustration",
  "character-design": "tag-illustration",
  "motion-design": "tag-motion",
  "after-effects": "tag-motion",
  "web-design": "tag-web",
  framer: "tag-web",
  webflow: "tag-web",
  "landing-pages": "tag-web",
  "video-editing": "tag-video",
  "packaging-design": "tag-packaging",
  "product-design": "tag-uiux",
  "design-systems": "tag-uiux",
};

export const LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: "New Seller",
  intermediate: "Level One",
  advanced: "Level Two",
  expert: "Top Rated",
};

/** Fiverr's ladder, mapped onto a rating-derived signal. */
export function levelFromRating(rating: number | null | undefined): SkillLevel {
  const r = rating ?? 0;
  if (r >= 4.8) return "expert";
  if (r >= 4.3) return "advanced";
  if (r >= 3.8) return "intermediate";
  return "beginner";
}

export interface Tier {
  name: "Basic" | "Standard" | "Premium";
  price: number;
  delivery: string;
  revisions: number;
  summary: string;
}

/**
 * FNV-1a. Convex ids are opaque, but pricing has to be *stable* across
 * re-renders and identical for a given designer on every page — otherwise
 * the same seller shows three different quotes in three places. Hashing
 * the id gives deterministic, client-free "catalog" data.
 */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * The three-tier package ladder, the thing that makes a marketplace feel
 * like a marketplace: a cheap entry, a recommended middle, a premium with
 * real depth. Price scales with seller level.
 */
export function tiersFor(seed: string, rating: number | null | undefined): Tier[] {
  const h = hash(seed || "glypha");
  const level = levelFromRating(rating);

  const floor = level === "expert" ? 220 : level === "advanced" ? 150 : level === "intermediate" ? 95 : 55;
  const jitter = 0.85 + (h % 30) / 100;

  const basic = Math.round((floor * jitter) / 5) * 5;
  const standard = Math.round((basic * 2.35) / 5) * 5;
  const premium = Math.round((basic * 4.6) / 5) * 5;

  const deliveryShift = h % 3;

  return [
    {
      name: "Basic",
      price: basic,
      delivery: `${2 + deliveryShift} days`,
      revisions: 1,
      summary: "One focused deliverable",
    },
    {
      name: "Standard",
      price: standard,
      delivery: `${5 + deliveryShift} days`,
      revisions: 3,
      summary: "Direction, delivery, two rounds",
    },
    {
      name: "Premium",
      price: premium,
      delivery: `${10 + deliveryShift} days`,
      revisions: 6,
      summary: "Full system + source files",
    },
  ];
}

/** Deterministic review count, capped just under the platform maximum. */
export function reviewsFor(seed: string): number {
  return 12 + (hash(seed || "glypha") % 480);
}

/** "Starting at" price for a gig card header. */
export function fromPrice(seed: string, rating: number | null | undefined): number {
  return tiersFor(seed, rating)[0].price;
}