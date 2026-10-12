import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes reachable without a session.
 *
 * This is an allowlist on purpose: anything not named here is protected, so a
 * route added later is private by default rather than accidentally public.
 *
 * Do not add a catch-all such as "/(.*)". One was present here and matched
 * every path, which made `auth.protect()` unreachable — the entire dashboard
 * rendered for anonymous visitors.
 *
 * The cost of failing closed: an unknown path is protected too, so a typo'd
 * URL redirects to sign-in instead of showing a 404.
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/designers(.*)",
  "/signin(.*)",
  "/signup(.*)",
  "/passwordreset(.*)",
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|eot|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
