"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { DesignerCard, DesignerCardSkeleton } from "@/components/ui/designer-card";
import {
  ArrowRight,
  ChevronDown,
  Close,
  Search,
  Sliders,
  TrendingUp,
  Users,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import {
  CATEGORIES,
  LEVEL_LABELS,
  SKILL_LABELS,
  fromPrice,
  levelFromRating,
  reviewsFor,
  tiersFor,
  type SkillLevel,
} from "@/lib/gigs";

type SortKey = "relevance" | "rating" | "reviews" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Best match",
  rating: "Highest rated",
  reviews: "Most reviewed",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

const DELIVERY_OPTIONS = [
  { id: "any", label: "Any time", days: Infinity },
  { id: "24h", label: "Up to 24h", days: 1 },
  { id: "3d", label: "Up to 3 days", days: 3 },
  { id: "7d", label: "Up to 7 days", days: 7 },
];

const LEVEL_OPTIONS: SkillLevel[] = ["beginner", "intermediate", "advanced", "expert"];

const RATING_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
  { value: 4.8, label: "4.8+" },
];

/** "5 days" → 5. Tiers format delivery as "<n> days" / "<n> day". */
function deliveryDays(seed: string, rating: number | null | undefined): number {
  const text = tiersFor(seed, rating)[0].delivery;
  const n = Number.parseInt(text, 10);
  return Number.isFinite(n) ? n : Infinity;
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-border pt-6">
      <legend className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function OptionPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-[13px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        active
          ? "bg-ink text-paper"
          : "text-muted-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_12%,transparent)] hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Marketplace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designers = useQuery(api.profiles.listDesigners);

  // ── State ────────────────────────────────────────────────────────
  // Seeded straight from the URL so hero links land pre-filtered without a
  // hydrate-then-correct pass (which would flash the unfiltered bench).
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    () => searchParams.get("category") ?? "all",
  );
  const [country, setCountry] = useState("all");
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [maxBudget, setMaxBudget] = useState(1200);
  const [delivery, setDelivery] = useState("any");
  const [level, setLevel] = useState<"all" | SkillLevel>("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>("relevance");
  const [countryOpen, setCountryOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const countryRef = useRef<HTMLDivElement>(null);

  // Push meaningful filter state back into the address bar.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    router.replace(`/designers${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }, [query, category, router]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────
  const countries = useMemo(() => {
    const set = new Set<string>();
    designers?.forEach((d) => d.location?.country && set.add(d.location.country));
    return Array.from(set).sort();
  }, [designers]);

  const deliveryDaysMax =
    DELIVERY_OPTIONS.find((option) => option.id === delivery)?.days ?? Infinity;

  const results = useMemo(() => {
    if (!designers) return [];

    const term = query.trim().toLowerCase();

    const filtered = designers.filter((designer) => {
      const price = fromPrice(designer._id, designer.averageRating);

      const matchesTerm =
        !term ||
        designer.name?.toLowerCase().includes(term) ||
        designer.location?.city?.toLowerCase().includes(term) ||
        designer.location?.country?.toLowerCase().includes(term) ||
        designer.bio?.toLowerCase().includes(term) ||
        designer.skills?.some((skill) => {
          const label = SKILL_LABELS[skill] ?? skill;
          return label.toLowerCase().includes(term) || skill.includes(term);
        });

      return (
        matchesTerm &&
        (category === "all" || designer.skills?.includes(category)) &&
        (country === "all" || designer.location?.country === country) &&
        (!onlyOnline || designer.isOnline) &&
        price <= maxBudget &&
        deliveryDays(designer._id, designer.averageRating) <= deliveryDaysMax &&
        (level === "all" || levelFromRating(designer.averageRating) === level) &&
        (designer.averageRating ?? 0) >= minRating
      );
    });

    const byRating = (a: (typeof designers)[number], b: (typeof designers)[number]) =>
      (b.averageRating ?? 0) - (a.averageRating ?? 0);
    const byReviews = (a: (typeof designers)[number], b: (typeof designers)[number]) =>
      reviewsFor(b._id) - reviewsFor(a._id);
    const byPriceAsc = (a: (typeof designers)[number], b: (typeof designers)[number]) =>
      fromPrice(a._id, a.averageRating) - fromPrice(b._id, b.averageRating);
    const byPriceDesc = (a: (typeof designers)[number], b: (typeof designers)[number]) =>
      fromPrice(b._id, b.averageRating) - fromPrice(a._id, a.averageRating);

    switch (sortBy) {
      case "rating":
        return filtered.sort(byRating);
      case "reviews":
        return filtered.sort(byReviews);
      case "price-asc":
        return filtered.sort(byPriceAsc);
      case "price-desc":
        return filtered.sort(byPriceDesc);
      default:
        return filtered.sort((a, b) => byRating(a, b) || byReviews(a, b));
    }
  }, [designers, query, category, country, onlyOnline, maxBudget, deliveryDaysMax, level, minRating, sortBy]);

  const activeCount =
    (query.trim() ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (country !== "all" ? 1 : 0) +
    (onlyOnline ? 1 : 0) +
    (maxBudget !== 1200 ? 1 : 0) +
    (delivery !== "any" ? 1 : 0) +
    (level !== "all" ? 1 : 0) +
    (minRating !== 0 ? 1 : 0);

  function clearAll() {
    setQuery("");
    setCategory("all");
    setCountry("all");
    setOnlyOnline(false);
    setMaxBudget(1200);
    setDelivery("any");
    setLevel("all");
    setMinRating(0);
    setSortBy("relevance");
  }

  const loading = designers === undefined;

  /* ── The filter panel, shared between the rail and the mobile sheet ── */
  const filterPanel = (
    <div className="flex flex-col gap-6">
      <FilterGroup label="Budget ceiling">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">Up to</span>
          <span className="font-medium tabular-nums">${maxBudget}</span>
        </div>
        <input
          type="range"
          min={50}
          max={1200}
          step={50}
          value={maxBudget}
          onChange={(event) => setMaxBudget(Number(event.target.value))}
          aria-label="Maximum starting price"
          className="mt-3 w-full accent-ink"
        />
        <p className="mt-2 text-[11px] text-muted-foreground">
          Filters against the Basic tier starting price.
        </p>
      </FilterGroup>

      <FilterGroup label="Delivery">
        <div className="flex flex-wrap gap-2">
          {DELIVERY_OPTIONS.map((option) => (
            <OptionPill
              key={option.id}
              active={delivery === option.id}
              onClick={() => setDelivery(option.id)}
            >
              {option.label}
            </OptionPill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Seller level">
        <div className="flex flex-wrap gap-2">
          <OptionPill active={level === "all"} onClick={() => setLevel("all")}>
            All
          </OptionPill>
          {LEVEL_OPTIONS.map((option) => (
            <OptionPill
              key={option}
              active={level === option}
              onClick={() => setLevel(option)}
            >
              {LEVEL_LABELS[option]}
            </OptionPill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Rating">
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => (
            <OptionPill
              key={option.value}
              active={minRating === option.value}
              onClick={() => setMinRating(option.value)}
            >
              {option.label}
            </OptionPill>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Location">
        <div className="relative" ref={countryRef}>
          <button
            type="button"
            onClick={() => setCountryOpen((value) => !value)}
            aria-expanded={countryOpen}
            className={`flex w-full items-center justify-between rounded-full px-4 py-2.5 text-[13px] transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              country !== "all"
                ? "bg-ink text-paper"
                : "text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_12%,transparent)]"
            }`}
          >
            <span className="truncate">{country === "all" ? "Worldwide" : country}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                countryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {countryOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full min-w-[12rem] origin-top overflow-y-auto rounded-3xl bg-popover p-2 shadow-[0_28px_60px_-30px_color-mix(in_oklab,var(--ink)_60%,transparent)]">
              {["all", ...countries].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setCountry(option);
                    setCountryOpen(false);
                  }}
                  className={`block w-full truncate rounded-full px-3.5 py-2 text-left text-[13px] transition-colors duration-500 hover:bg-accent ${
                    country === option ? "font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {option === "all" ? "Worldwide" : option}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOnlyOnline((value) => !value)}
          aria-pressed={onlyOnline}
          className="mt-4 flex items-center gap-2.5 text-[13px] text-muted-foreground"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-500 ${
              onlyOnline ? "bg-sage text-white" : "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_18%,transparent)]"
            }`}
          >
            {onlyOnline ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
          </span>
          Available right now
        </button>
      </FilterGroup>
    </div>
  );

  return (
    <main className="pb-32">
      {/* ── Masthead ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 paper-tooth opacity-60" />
          <div
            className="absolute -right-[10%] -top-[40%] h-[55vh] w-[55vh] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--sage) 26%, transparent) 0%, transparent 62%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <span className="eyebrow">
              <Users className="h-3 w-3" />
              The marketplace
            </span>
            <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1] tracking-[-0.03em] text-balance">
              Every seller here has a{" "}
              <span className="italic text-brand-ink">price on the card</span>.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              Filter by craft, budget, deadline and level. What you see is what
              you buy — no “DM for rates”.
            </p>
          </Reveal>

          <Reveal delay={110} className="mt-12">
            <div className="rail">
              {CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`category-tab ${category === item.id ? "category-tab--active" : ""}`}
                >
                  {item.label}
                  <span className="ml-1.5 text-[11px] opacity-60">{item.count}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-10">
            <div className="shell">
              <div className="shell__core flex items-center gap-3 p-4">
                <Search className="pointer-events-none h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by craft, name or city…"
                  aria-label="Search designers"
                  className="w-full bg-transparent py-1 text-[15px] outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Close className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Rail + results ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-12">
          {/* Desktop filter rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[13px] font-medium">
                  <Sliders className="h-4 w-4" />
                  Refine
                </h2>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[12px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Clear {activeCount}
                  </button>
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <p className="text-[13px] text-muted-foreground">
                {loading ? (
                  "Loading sellers…"
                ) : (
                  <>
                    <span className="font-medium text-foreground">{results.length}</span>{" "}
                    {results.length === 1 ? "designer" : "designers"} available
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="btn-secondary !px-4 !py-2 !text-[13px] lg:hidden"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  Filters
                  {activeCount > 0 && (
                    <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-paper">
                      {activeCount}
                    </span>
                  )}
                </button>

                <label className="sr-only" htmlFor="sort">
                  Sort results
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortKey)}
                  className="cursor-pointer rounded-full bg-transparent py-2 pl-4 pr-8 text-[13px] text-foreground outline-none transition-colors hover:text-brand-ink"
                  style={{
                    // Native select needs an explicit box on the cream stock.
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23787165' stroke-width='1'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0 center",
                    backgroundSize: "16px",
                    appearance: "none",
                    boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--ink) 12%, transparent)",
                  }}
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <option key={key} value={key} className="bg-popover text-foreground">
                      {SORT_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {query.trim() && (
                  <button type="button" onClick={() => setQuery("")} className="category-tab category-tab--active">
                    “{query.trim()}” <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
                {category !== "all" && (
                  <button type="button" onClick={() => setCategory("all")} className="category-tab category-tab--active">
                    {CATEGORIES.find((c) => c.id === category)?.label ?? category}
                    <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
                {country !== "all" && (
                  <button type="button" onClick={() => setCountry("all")} className="category-tab category-tab--active">
                    {country}
                    <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
                {level !== "all" && (
                  <button type="button" onClick={() => setLevel("all")} className="category-tab category-tab--active">
                    {LEVEL_LABELS[level]}
                    <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
                {minRating !== 0 && (
                  <button type="button" onClick={() => setMinRating(0)} className="category-tab category-tab--active">
                    {minRating.toFixed(1)}+ rating
                    <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
                {maxBudget !== 1200 && (
                  <button type="button" onClick={() => setMaxBudget(1200)} className="category-tab category-tab--active">
                    Under ${maxBudget}
                    <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
                {delivery !== "any" && (
                  <button
                    type="button"
                    onClick={() => setDelivery("any")}
                    className="category-tab category-tab--active"
                  >
                    {DELIVERY_OPTIONS.find((d) => d.id === delivery)?.label}
                    <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
                {onlyOnline && (
                  <button type="button" onClick={() => setOnlyOnline(false)} className="category-tab category-tab--active">
                    Online now
                    <Close className="ml-1.5 h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Results */}
            <div className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <DesignerCardSkeleton key={i} />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="shell">
                  <div className="shell__core px-8 py-20 text-center">
                    <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-5 font-serif text-2xl">No one matches that brief</p>
                    <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
                      Widen the budget, stretch the deadline, or drop the level
                      filter — the bench is smaller than the wall.
                    </p>
                    <button type="button" onClick={clearAll} className="btn-pill group mt-8">
                      Reset everything
                      <span className="btn-pill__island">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((designer, index) => (
                    <Reveal key={designer._id} delay={Math.min(index, 5) * 70}>
                      <DesignerCard
                        designer={{
                          _id: designer._id,
                          name: designer.name || "Designer",
                          bio: designer.bio,
                          image: designer.image,
                          location: designer.location,
                          skills: designer.skills ?? [],
                          averageRating: designer.averageRating,
                          isOnline: designer.isOnline,
                          isVerified: (designer.averageRating ?? 0) >= 4.7,
                          level: levelFromRating(designer.averageRating),
                        }}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile filter sheet ─────────────────────────────────── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[2rem] bg-background p-6 shadow-[0_-24px_60px_-30px_color-mix(in_oklab,var(--ink)_70%,transparent)]">
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-border" />
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl">Refine</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full p-2 text-muted-foreground"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={clearAll} className="btn-secondary flex-1">
                Clear all
              </button>
              <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary flex-1">
                Show {results.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Designers() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] pb-32">
          <div className="mx-auto max-w-7xl px-5 pt-44 md:px-8">
            <div className="skeleton-shimmer h-12 w-2/3 rounded-2xl" />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <DesignerCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <Marketplace />
    </Suspense>
  );
}