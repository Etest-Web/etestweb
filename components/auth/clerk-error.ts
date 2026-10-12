/**
 * Normalises a `ClerkError` into something renderable.
 *
 * Clerk reports most auth failures through the `errors` object returned by the
 * `useSignIn` / `useSignUp` hooks, but transport-level failures never populate
 * it: the promise resolves with a populated `error` while the hook's `errors`
 * context stays empty. A bad origin, a 5xx, or an offline client all land here.
 *
 * This matters because the alternative is a submit button that appears to do
 * nothing — indistinguishable from a broken page.
 */
export function clerkErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error !== "object") return null;

  const e = error as {
    longMessage?: string;
    message?: string;
    errors?: Array<{ longMessage?: string; message?: string }>;
  };

  // `ClerkAPIResponseError` nests per-field errors; prefer those over the
  // generic top-level message ("API response status 500" tells a user nothing).
  const first = e.errors?.[0];

  return e.longMessage ?? first?.longMessage ?? e.message ?? first?.message ?? null;
}