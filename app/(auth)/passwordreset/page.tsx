"use client";

import Link from "next/link";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

import { AuthHeading, AuthShell } from "@/components/auth/auth-shell";
import {
  Field,
  FieldError,
  PasswordInput,
  SubmitButton,
  TextInput,
} from "@/components/auth/auth-field";
import { useAuthRedirect } from "@/components/auth/redirect";
import { useAction } from "@/components/auth/use-action";

type Step = "request" | "verify" | "new-password";

export default function PasswordResetPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const navigate = useAuthRedirect();
  const { run, pending, error: transportError } = useAction();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const loading = fetchStatus === "fetching" || pending;
  const globalError =
    errors?.global?.[0]?.longMessage ?? errors?.global?.[0]?.message ?? null;
  const codeError =
    errors?.fields?.code?.longMessage ?? errors?.fields?.code?.message ?? null;
  const passwordError =
    errors?.fields?.password?.longMessage ?? errors?.fields?.password?.message ?? null;

  /**
   * `resetPasswordEmailCode.sendCode()` takes no arguments — it mails to the
   * address already attached to the sign-in attempt. So the identifier has to
   * be registered on the attempt *first*, or the code goes nowhere.
   */
  async function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const identifier = String(data.get("email") ?? "");

    await run(async () => {
      const { error } = await signIn.create({ identifier });
      if (error) throw error;

      const sent = await signIn.resetPasswordEmailCode.sendCode();
      if (sent.error) throw sent.error;

      setEmail(identifier);
      setStep("verify");
      setNotice(`We sent a six-digit code to ${identifier}.`);
    });
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await run(async () => {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({
        code: String(data.get("code") ?? ""),
      });

      if (error) throw error;

      setStep("new-password");
      setNotice(null);
    });
  }

  async function handleNewPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    await run(async () => {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password: String(data.get("password") ?? ""),
      });

      if (error) throw error;

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate });
      }
    });
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      headline={
        <>
          It happens. <span className="italic text-mark">Back in you go.</span>
        </>
      }
      lede="Reset your password with a one-time code. No support queue, no waiting on a human to unblock you."
      footer={
        <>
          Remembered it?{" "}
          <Link
            href="/signin"
            className="link-underline font-medium text-foreground"
          >
            Back to sign in
          </Link>
        </>
      }
    >
      {step === "request" && (
        <>
          <AuthHeading
            title="Reset your password"
            sub="Tell us the email on the account and we'll send a one-time code to prove it's really yours."
          />
          <form onSubmit={handleRequest} className="flex flex-col gap-6">
            {(transportError || globalError) ? (
              <FieldError message={transportError ?? globalError!} />
            ) : null}
            <Field
              label="Email"
              error={errors?.fields?.identifier?.longMessage ?? null}
            >
              <TextInput
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                required
                autoFocus
              />
            </Field>
            <SubmitButton loading={loading}>Send recovery code</SubmitButton>
          </form>
        </>
      )}

      {step === "verify" && (
        <>
          <AuthHeading
            title="Enter your code"
            sub="Paste the six digits we just emailed you."
          />
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            {transportError ? <FieldError message={transportError} /> : null}

            {notice ? (
              <p className="rounded-2xl bg-accent px-4 py-3 text-[13px] leading-relaxed text-accent-foreground">
                {notice}
              </p>
            ) : null}
            <Field label="Verification code" error={codeError || globalError}>
              <TextInput
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                required
                autoFocus
                invalid={Boolean(codeError)}
              />
            </Field>
            <SubmitButton loading={loading}>Continue</SubmitButton>
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  run(async () => {
                    const { error } = await signIn.resetPasswordEmailCode.sendCode();
                    if (error) throw error;
                    setNotice(`Sent a fresh code to ${email}.`);
                  })
                }
                className="text-[12px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setNotice(null);
                }}
                className="text-[12px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Use a different email
              </button>
            </div>
          </form>
        </>
      )}

      {step === "new-password" && (
        <>
          <AuthHeading
            title="Choose a new password"
            sub="Pick something you haven't used here before."
          />
          <form onSubmit={handleNewPassword} className="flex flex-col gap-6">
            {transportError ? <FieldError message={transportError} /> : null}

            <Field label="New password" error={passwordError || globalError}>
              <PasswordInput
                name="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoFocus
                invalid={Boolean(passwordError)}
              />
            </Field>
            <SubmitButton loading={loading}>Save and sign in</SubmitButton>
          </form>
        </>
      )}
    </AuthShell>
  );
}