"use client";

import { useCallback, useState } from "react";

import { clerkErrorMessage } from "./clerk-error";

export const ACTION_FALLBACK = "Something went wrong reaching Glypha. Please try again.";

/**
 * How long a Clerk call may stay in flight before we call it wedged.
 *
 * Long enough to cover a slow connection plus an SMS/email hand-off, short
 * enough that a stuck request does not look like a broken page.
 */
const TIMEOUT_MS = 20_000;

/**
 * Rejects if `promise` has not settled within `ms`.
 *
 * Clerk rejects on network failure but *hangs* when its instance never loads —
 * a blocked origin or a failed `/v1/environment` handshake leaves every
 * resource call pending forever, with no rejection to catch.
 */
export function withTimeout<T>(promise: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(ACTION_FALLBACK)), ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * Drives an async Clerk call and guarantees the user sees the outcome.
 *
 * This exists because Clerk's `fetchStatus` is not a usable busy signal. When
 * the instance fails to load it stays `"idle"` while the underlying request
 * pends, so a form built purely on `fetchStatus` shows no spinner and no
 * error — it simply goes inert, which is worse than Clerk's own pre-built
 * components were.
 *
 * Failures inside the callback are expected: throw the `{ error }` Clerk
 * returns and it is surfaced the same way as a rejection.
 */
export function useAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (action: () => Promise<unknown>) => {
    setPending(true);
    setError(null);

    try {
      await withTimeout(action());
    } catch (thrown) {
      setError(clerkErrorMessage(thrown) ?? ACTION_FALLBACK);
    } finally {
      setPending(false);
    }
  }, []);

  return { run, pending, error, setError };
}