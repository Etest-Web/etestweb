import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The Glypha wordmark, carried over from etestlearn's public/Logo.svg.
 *
 * The asset is a single fixed-colour vector (purple wordmark + gold
 * "SERVICES" lockup) with no light/dark variant, so it needs a surface that
 * gives the purple enough contrast. On a light theme that is any background
 * tone; on a dark theme it needs a light plate behind it, which is what
 * `plate` provides.
 */
export function Logo({
  className,
  plate = false,
  priority = false,
}: {
  className?: string;
  plate?: boolean;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        /* The wordmark is a fixed dark-purple-on-transparent asset, so the
           backing plate has to stay light in BOTH themes — bg-background
           would go near-black in dark mode and swallow the mark. */
        plate && "rounded-md bg-white p-1",
        className,
      )}
    >
      <Image
        src="/Logo.svg"
        alt="Glypha"
        width={300}
        height={150}
        priority={priority}
        className="h-auto w-full"
      />
    </span>
  );
}

/** Square Glypha mark, for tight spaces like the dashboard sidebar. */
export function SmallLogo({
  className,
  plate = false,
}: {
  className?: string;
  plate?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        plate && "rounded-md bg-white p-1",
        className,
      )}
    >
      <Image
        src="/SmallLogo.svg"
        alt="Glypha"
        width={375}
        height={375}
        className="h-full w-auto"
      />
    </span>
  );
}
