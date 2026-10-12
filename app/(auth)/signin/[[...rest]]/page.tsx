"use client";

import Link from "next/link";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

import { AuthHeading, AuthShell } from "@/components/auth/auth-shell";
import {
  Divider,
  Field,
  FieldError,
  PasswordInput,
  SocialButtons,
  SubmitButton,
  TextInput,
} from "@/components/auth/auth-field";
import { POST_AUTH_REDIRECT, useAuthRedirect } from "@/components/auth/redirect";
import { useAction } from "@/components/auth/use-action";

type Mode = "credentials" | "second-factor";

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const navigate = useAuthRedirect();
  const { run, pending, error: transportError } = useAction();

  const [mode, setMode] = useState<Mode>("credentials");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [mfaNotice, setMfaNotice] = useState<string | null>(null);
  /** "trust" asks for an emailed/texted code; "mfa" for an authenticator one. */
  const [verifyKind, setVerifyKind] = useState<"mfa" | "trust">("mfa");

  const loading = fetchStatus === "fetching" || pending;

  /**
   * Clerk decides which second factors an account has. Push the code down
   * whichever channel it actually supports rather than assuming SMS — an
   * email-only account would silently never receive the message.
   * `strategy` (not `type`) is the discriminant on these factor objects.
   */
  const supported = signIn.supportedSecondFactors.map((factor) => factor.strategy);
  const usesEmailCode = supported.includes("email_code");
  const usesPhoneCode = supported.includes("phone_code");
  const hasPushableCode = usesEmailCode || usesPhoneCode;

  /** Returns the Clerk error, if any, so the caller can surface it. */
  async function sendMfaCode() {
    setMfaNotice(null);

    const { error } = usesPhoneCode
      ? await signIn.mfa.sendPhoneCode()
      : usesEmailCode
        ? await signIn.mfa.sendEmailCode()
        : { error: null };

    return error;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await run(async () => {
      if (mode === "credentials") {
        const { error } = await signIn.password({
          identifier: String(data.get("identifier") ?? ""),
          password: String(data.get("password") ?? ""),
        });

        if (error) throw error;

        // `needs_client_trust` — a correct password from an unrecognised device with
        // no MFA enrolled — demands the same thing as `needs_second_factor`:
        // one more factor before Clerk will mint a session. Treating only the
        // latter leaves the other as a silent dead-end.
        const isClientTrust = signIn.status === "needs_client_trust";

        if (signIn.status === "needs_second_factor" || isClientTrust) {
          setMode("second-factor");
          setUseBackupCode(false);
          setVerifyKind(isClientTrust ? "trust" : "mfa");

          if (hasPushableCode) {
            const sent = await sendMfaCode();
            if (sent) throw sent;

            setMfaNotice(
              usesEmailCode
                ? "We sent a code to the email on your account."
                : "We texted a code to the number on your account.",
            );
          } else if (isClientTrust) {
            // No code to send and nothing to read one from — the account has
            // no verification channel at all, so the user is stuck.
            throw new Error(
              "This account has no email or phone on file to verify this device. Please sign in again from a device you've used before.",
            );
          } else {
            setMfaNotice("Open your authenticator app for the current code.");
          }
          return;
        }

        if (signIn.status === "complete") {
          await signIn.finalize({ navigate });
          return;
        }

        // Any other status means Clerk accepted the factor but wants something
        // this form does not know how to ask for (e.g. the instance has
        // password auth disabled). Say so rather than returning to an
        // unchanged form.
        throw new Error(
          "We couldn't finish signing you in. Please try again in a moment.",
        );
      }

      const code = String(data.get("code") ?? "");
      const { error } = useBackupCode
        ? await signIn.mfa.verifyBackupCode({ code })
        : await signIn.mfa.verifyTOTP({ code });

      if (error) throw error;

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate });
        return;
      }

      throw new Error(
        "We couldn't finish signing you in. Please try again in a moment.",
      );
    });
  }

  function signInWith(strategy: "oauth_google" | "oauth_github") {
    return run(() =>
      signIn.sso({
        strategy,
        redirectUrl: POST_AUTH_REDIRECT,
        redirectCallbackUrl: "/signin",
      })
    );
  }

  const fieldError = (key: "identifier" | "password" | "code") =>
    errors?.fields?.[key]?.longMessage ??
    errors?.fields?.[key]?.message ??
    null;

  const globalError =
    errors?.global?.[0]?.longMessage ?? errors?.global?.[0]?.message ?? null;

  /** Transport failures outrank the hook's structured errors. */
  const bannerError = transportError;

  const backupLabel =
    verifyKind === "trust"
      ? "Verification code"
      : useBackupCode
        ? "Backup code"
        : "Authenticator code";

  return (
    <AuthShell
      eyebrow="Welcome back"
      headline={
        <>
          The bench is <span className="italic text-mark">already warm.</span>
        </>
      }
      lede="Pick up your open briefs, read the proposals that came in overnight, and ship the work you were hired to do."
      footer={
        <>
          New to Glypha?{" "}
          <Link
            href="/signup"
            className="link-underline font-medium text-foreground"
          >
            Create an account
          </Link>
        </>
      }
    >
      <AuthHeading
        title="Sign in"
        sub="Your proposals, contracts and messages are where you left them."
      />

      {mode === "second-factor" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {transportError ? <FieldError message={transportError} /> : null}

          {mfaNotice ? (
            <p className="rounded-2xl bg-accent px-4 py-3 text-[13px] leading-relaxed text-accent-foreground">
              {mfaNotice}
            </p>
          ) : null}

          <Field
            label={backupLabel}
            error={fieldError("code") || globalError || transportError}
          >
            <TextInput
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              required
              autoFocus
              invalid={Boolean(fieldError("code"))}
            />
          </Field>

          {/* Backup codes only exist on MFA-enrolled accounts; a client-trust
              challenge is always a delivered code. */}
          {verifyKind === "mfa" ? (
            <label className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
              <input
                type="checkbox"
                checked={useBackupCode}
                onChange={(event) => setUseBackupCode(event.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              I&apos;m using a backup code instead
            </label>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setMode("credentials");
                setMfaNotice(null);
                signIn.reset();
              }}
              className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Use a password instead
            </button>

            {hasPushableCode ? (
              <button
                type="button"
                onClick={() =>
                  run(async () => {
                    const error = await sendMfaCode();
                    if (error) throw error;
                    setMfaNotice("Sent a fresh code.");
                  })
                }
                className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Resend code
              </button>
            ) : null}
          </div>

          <SubmitButton loading={loading}>Verify</SubmitButton>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {(bannerError || (globalError && !errors?.fields)) ? (
              <FieldError message={bannerError ?? globalError!} />
            ) : null}

            <Field label="Email" error={fieldError("identifier")}>
              <TextInput
                name="identifier"
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                required
                autoFocus
                invalid={Boolean(fieldError("identifier"))}
              />
            </Field>

            <Field label="Password" error={fieldError("password")}>
              <PasswordInput
                name="password"
                autoComplete="current-password"
                placeholder="Your password"
                required
                invalid={Boolean(fieldError("password"))}
              />
            </Field>

            <div className="flex justify-end">
              <Link
                href="/passwordreset"
                className="text-[12px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Forgot your password?
              </Link>
            </div>

            <SubmitButton loading={loading}>Sign in</SubmitButton>
          </form>

          <div className="my-7">
            <Divider>or</Divider>
          </div>

          <SocialButtons
            disabled={loading}
            onGoogle={() => signInWith("oauth_google")}
            onGitHub={() => signInWith("oauth_github")}
          />
        </>
      )}
    </AuthShell>
  );
}