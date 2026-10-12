"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered reveal.
 *
 * A single IntersectionObserver per instance — never a `scroll` listener,
 * which would force layout on every frame. The element itself stays
 * unanimated until `data-revealed` flips, so there is no transition from
 * an unmeasured initial paint (which causes the classic flicker).
 *
 * Only `transform`, `opacity` and `filter` move — see `.reveal` in
 * globals.css.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div" as ElementType,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds. */
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No-JS / reduced-motion / already-visible: show immediately rather
    // than leaving the content permanently invisible.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-revealed={revealed ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}