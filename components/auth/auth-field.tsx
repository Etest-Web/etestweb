"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { ArrowRight, Close } from "@/components/ui/icons";

/**
 * Auth form primitives.
 *
 * Clerk's pre-built components were rendering inside a design system that
 * no longer exists (hard borders, `shadow-lg`, square corners). These are
 * hand-built to the same tokens as the rest of the site: warm hairlines,
 * pill geometry, and the brand spring curve.
 */

const fieldBase =
  "w-full rounded-2xl bg-card px-5 py-3.5 text-[15px] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_12%,transparent)] transition-shadow duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-muted-foreground/60 focus:outline-none focus:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--brand)_55%,transparent),0_0_0_4px_color-mix(in_oklab,var(--brand)_10%,transparent)] disabled:opacity-60";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | null;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {hint && !error ? (
          <span className="text-[11px] text-muted-foreground/70">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}

export function FieldError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-1.5 text-[12px] leading-snug text-destructive"
    >
      <Close className="mt-0.5 h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className = "", invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={`${fieldBase} ${invalid ? "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--destructive)_60%,transparent)]" : ""} ${className}`}
        {...props}
      />
    );
  },
);

/** Password input with a reveal toggle — long passwords are unreadable otherwise. */
export function PasswordInput({
  className = "",
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={`${fieldBase} pr-20 ${invalid ? "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--destructive)_60%,transparent)]" : ""} ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function SubmitButton({
  children,
  loading = false,
  className = "",
}: {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`btn-pill group w-full justify-between disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      <span>{loading ? "One moment…" : children}</span>
      <span className="btn-pill__island">
        {loading ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}

/** Rule-of-thumb strength meter for the sign-up password. */
export function PasswordMeter({ value }: { value: string }) {
  const score = Math.min(4, (() => {
    let n = 0;
    if (value.length >= 8) n++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) n++;
    if (/\d/.test(value)) n++;
    if (/[^A-Za-z0-9]/.test(value)) n++;
    return n;
  })());

  const LABELS = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              i < score ? "bg-brand-ink" : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="w-16 shrink-0 text-right text-[11px] text-muted-foreground">
        {value ? LABELS[score] : ""}
      </span>
    </div>
  );
}

export function Divider({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-border" />
      {children ? (
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {children}
        </span>
      ) : null}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Hairline provider buttons — no third-party logo assets, so the marks are drawn. */
export function SocialButtons({
  onGoogle,
  onGitHub,
  disabled,
}: {
  onGoogle: () => void;
  onGitHub: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="btn-secondary w-full justify-center !py-3"
      >
        <GoogleMark />
        Google
      </button>
      <button
        type="button"
        onClick={onGitHub}
        disabled={disabled}
        className="btn-secondary w-full justify-center !py-3"
      >
        <GitHubMark />
        GitHub
      </button>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z"
      />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5a10.2 10.2 0 0 0 6.8-9.7C22 6.6 17.5 2 12 2Z"
      />
    </svg>
  );
}