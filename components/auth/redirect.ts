"use client";

import { useRouter } from "next/navigation";

/**
 * Where a completed auth flow lands.
 *
 * `/dashboard` rather than the marketing home page: `DashboardGate` already
 * handles the two audiences — an account with a Convex profile gets the
 * dashboard, and a brand-new one is routed into `<Onboarding />`. Sending
 * everyone to `/` instead meant a fresh signup hit a marketing page with no
 * further cue to finish setting up.
 *
 * Kept as one constant so the destination is changed in a single place.
 */
export const POST_AUTH_REDIRECT = "/dashboard";

/**
 * Builds the `navigate` callback Clerk's `finalize()` expects.
 *
 * Two things matter here and both are easy to get wrong:
 *  - `decorateUrl` is required for Safari's Intelligent Tracking Prevention.
 *    It may hand back an *absolute* URL, which `router.push` will not accept.
 *  - `session.currentTask` means the session needs more work (e.g. accepting
 *    an org invitation) before any navigation. Bailing here keeps Clerk's
 *    task routes reachable instead of stranding the user on a dead page.
 */
export function useAuthRedirect() {
  const router = useRouter();

  return ({
    session,
    decorateUrl,
  }: {
    session?: { currentTask?: { key: string } | null } | null;
    decorateUrl: (url: string) => string;
  }) => {
    if (session?.currentTask) return;

    const url = decorateUrl(POST_AUTH_REDIRECT);
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };
}