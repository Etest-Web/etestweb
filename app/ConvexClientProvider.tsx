"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode, useState } from "react";

// Placeholder URL lets `next build` prerender without crashing when
// NEXT_PUBLIC_CONVEX_URL isn't set at build time (e.g. hosting CI).
// At runtime the real env var must be set, otherwise data won't load.
const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex] = useState(() => new ConvexReactClient(CONVEX_URL));
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
