"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth, useSignUp } from "@clerk/nextjs";

import { AuthHeading, AuthShell } from "@/components/auth/auth-shell";
import {
  Divider,
  Field,
  FieldError,
  PasswordInput,
  PasswordMeter,
  SocialButtons,
  SubmitButton,
  TextInput,
} from "@/components/auth/auth-field";
import { POST_AUTH_REDIRECT, useAuthRedirect } from "@/components/auth/redirect";
import { useAction } from "@/components/auth/use-action";

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useAuthRedirect();
  const { run, pending, error: transportError } = useAction();

  const [password, setPassword] = useState("");
  const [resent, setResent] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const loading = fetchStatus === "fetching" || pending;

  /**
   * Clerk reports the sign-up as `missing_requirements` when a required
   * field (usually the email code) still has to be satisfied. Treat that as
   * the verify step rather than letting the form dead-end.
   */
  const needsVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await run(async () => {
      const { error } = await signUp.password({
        emailAddress: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
        firstName: String(data.get("firstName") ?? ""),
        lastName: String(data.get("lastName") ?? ""),
      });

      if (error) throw error;

      // The identifier already belongs to an account. Handing this off to the
      // sign-in flow is a multi-resource transfer; until that is built, say
      // so plainly instead of leaving the user on a form that cannot advance.
      if (signUp.isTransferable) {
        setAlreadyRegistered(true);
        return;
      }

      // If the instance doesn't require email verification the resource is
      // already complete and we can go straight to a session.
      if (signUp.status === "complete") {
        await signUp.finalize({ navigate });
        return;
      }

      // Any other status needs something this form does not know how to ask
      // for. Never return to an unchanged form without explanation.
      throw new Error(
        "We couldn't finish creating your account. Please try again in a moment.",
      );
    });
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await run(async () => {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: String(data.get("code") ?? ""),
      });

      if (error) throw error;

      if (signUp.status === "complete") {
        await signUp.finalize({ navigate });
        return;
      }

      throw new Error(
        "We couldn't finish creating your account. Please try again in a moment.",
      );
    });
  }

  function signUpWith(strategy: "oauth_google" | "oauth_github") {
    return run(() =>
      signUp.sso({
        strategy,
        redirectUrl: POST_AUTH_REDIRECT,
        redirectCallbackUrl: "/signup",
      })
    );
  }

  const fieldError = (key: "emailAddress" | "password" | "code" | "firstName") =>
    errors?.fields?.[key]?.longMessage ??
    errors?.fields?.[key]?.message ??
    null;

  const globalError =
    errors?.global?.[0]?.longMessage ?? errors?.global?.[0]?.message ?? null;

  if (isSignedIn) return null;

  return (
    <AuthShell
      eyebrow="Open for briefs"
      headline={
        <>
          Sell the work you&apos;re <span className="italic text-mark">already proud of.</span>
        </>
      }
      lede="Publish a shot, get scoped proposals with real prices attached, and keep the tier you agreed to. Escrow by default."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="link-underline font-medium text-foreground"
          >
            Sign in
          </Link>
        </>
      }
    >
      {needsVerification ? (
        <>
          <AuthHeading
            title="Check your inbox"
            sub="We sent a six-digit code to your email. Paste it below to finish setting up your account."
          />

          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            {transportError ? <FieldError message={transportError} /> : null}

            <Field
              label="Verification code"
              error={fieldError("code") || globalError}
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

            <SubmitButton loading={loading}>Verify and continue</SubmitButton>

            <button
              type="button"
              onClick={async () => {
                await run(async () => {
                  const { error } = await signUp.verifications.sendEmailCode();
                  if (error) throw error;
                  setResent(true);
                });
              }}
              className="text-center text-[12px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {resent ? "Sent again, check your inbox" : "Send the code again"}
            </button>

            <button
              type="button"
              onClick={() => signUp.reset()}
              className="text-center text-[12px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Use a different email
            </button>
          </form>
        </>
      ) : (
        <>
          <AuthHeading
            title="Create an account"
            sub="Free to join. You only need a name, an email and a password to start bidding."
          />

          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            {alreadyRegistered ? (
              <div className="rounded-2xl bg-accent px-4 py-4 text-[13px] leading-relaxed text-accent-foreground">
                <p>
                  That email already has a Glypha account. Sign in instead and
                  we&apos;ll pick up where you left off.
                </p>
                <Link
                  href="/signin"
                  className="link-underline mt-2 inline-block font-medium"
                >
                  Go to sign in
                </Link>
              </div>
            ) : (transportError || (globalError && !errors?.fields)) ? (
              <FieldError message={transportError ?? globalError!} />
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" error={fieldError("firstName")}>
                <TextInput
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="Ada"
                  required
                  autoFocus
                />
              </Field>
              <Field label="Last name">
                <TextInput
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Okafor"
                  required
                />
              </Field>
            </div>

            <Field label="Email" error={fieldError("emailAddress")}>
              <TextInput
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                required
                invalid={Boolean(fieldError("emailAddress"))}
              />
            </Field>

            <Field label="Password" error={fieldError("password")}>
              <PasswordInput
                name="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                invalid={Boolean(fieldError("password"))}
              />
            </Field>

            <PasswordMeter value={password} />

            {/* Clerk's bot protection mounts into this node. */}
            <div id="clerk-captcha" />

            <SubmitButton loading={loading}>Create account</SubmitButton>

            <p className="text-[11px] leading-relaxed text-muted-foreground/80">
              By joining you agree to the Terms of Service and acknowledge the
              Privacy Policy.
            </p>
          </form>

          <div className="my-7">
            <Divider>or</Divider>
          </div>

          <SocialButtons
            disabled={loading}
            onGoogle={() => signUpWith("oauth_google")}
            onGitHub={() => signUpWith("oauth_github")}
          />
        </>
      )}
    </AuthShell>
  );
}