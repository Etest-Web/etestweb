"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react/dist/ssr";

import { ArrowRight, Close } from "@/components/ui/icons";

/**
 * Auth form primitives.
 *
 * Clerk's pre-built components were rendering inside a design system that
 * no longer exists (hard borders, `shadow-lg`, square corners). These are
 * hand-built to the same tokens as the rest of the site: cool hairlines,
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
  return <GoogleLogo className="h-4 w-4" weight="bold" aria-hidden />;
}

function GitHubMark() {
  return <GithubLogo className="h-4 w-4" weight="fill" aria-hidden />;
}