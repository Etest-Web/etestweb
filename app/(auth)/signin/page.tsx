"use client";

import { ArrowRight } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA31_3cQEuEI7dc6VRX6is3-IgLa2c3KwLspw0GNUsQn-kw2SAcwU51BbLHDowI2icvAwtRpzx8TNiqamgc8b1stSALLuwQacpvF-kkkfYPbTKAZSnTIM7soWmutn0fRb1GtdKj4oUNrl-4vaCK6IWH78m_kXoGnUj8fPR1DYdo0oPm218sfKMnUo5IlpjswLKPy5osCOjh-6LxMqTkZ3UrAMsGX0rShpf6UILgrYcR-i4lRssIUuKM02f3XXlJmo7XbyBDtGUXhkua";

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBeyNnH0PLtT8UteHWOhI7vyln_fbpv4K4SpekxcrZdYWxIx8ZYEFfAHF5QAdWvMiJYUg4mOL31NNB8TCboO_7crpJvL-JNnMlUNWUU8q1dhK6_bvuxUOAQEOf2hZgMw4ysW-sns03OnLoIUVFr3x9Km79x2281IhwgCqqoM81U87fLRHx0FQlXQ1HbQRqGGgl53MfbADupaDh2kb4YhwpKF8wSHoshgUM6OUHhdIoQIb7q9qivgDkSqNahjsbXqoiEvJTkwdBjuapK",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCMcp2R82H4jVy1iL-Jgpz_LcC-_yH4QO5veGIP4cLWwUz1Nb4G0xXiq0PvWXxS8aK2KAU2FVCuhgNmvgZ88152CjUgZbTHrjUnagSZbCXy5oTFRzBpW8bQ5xpYosKQ7rWGw2sxm60xMV0FXlLCbP39lV8eXZJzvsjNzCYYjsjeAxO8aEyKj0hl3rg6owRKGP-XswQ_qZUO8cpuvUnJpWskLRx4jE8O9yTVFPAE9aUmYn3N0c2FtDaeDiP-hWzQsvl76YH1Izbldh9F",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAD3HcITbx5yQYy7YnFg1GCgEDSCbbTmzUqG4y-S_lE54_uJJFO8Sc9F_YcW1frHmfms94SUrACrUApn0iSzPVB87LNz55uztvlu6z9mIDE3p6t11obH3_12GUXbukPkWAiFeJy2zN5fk7OLoPyCVxkhrP4ZfL8DcXd_hv5fxWnNkvolyznBp1wXFS9z0c9SwXcaTt4NYfbb7FFZUQhpcY2ETESyNnGcD3b0Gyb7Y9Vrv_Kucp7taF5n_S5-kAgc7O0b_FoTettZUUO",
];



export function LogoIcon({ className }: { className?: string }) {
  return (
    <Image src={"/Etest-white.png"} className={className} width={100} height={100} alt="Etest Services"/>
  );
}

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Left: Visual / branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          aria-label="Modern high-end creative office with warm lighting"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />

        <div className="relative z-10 w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-50 items-center justify-center rounded">
              <LogoIcon className="h-max w-full object-cover" />
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <span className="mb-4 inline-block rounded-full bg-primary/20 px-3 py-1 font-bold uppercase tracking-widest text-primary">
            Elite Status
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight mb-4">
            The ultimate platform for creative drop-servicing.
          </h1>
          <p className="text-lg text-foreground/70">
            Scale your agency with premium talent and automated workflows
            designed for the modern era.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-background bg-muted bg-cover bg-center"
                  style={{ backgroundImage: `url('${src}')` }}
                  aria-label={`User avatar ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-sm text-foreground/60">
              Joined by 2,000+ elite designers
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-6 lg:w-1/2 lg:px-24">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <Link href="/" className="mb-12 flex items-center gap-3 lg:hidden">
            <div className="flex size-50 items-center justify-center rounded bg-primary">
              <LogoIcon className="h-max w-full text-primary-foreground" />
            </div>
          </Link>

          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-foreground/60">
              Manage your creative projects with ease.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
                try {
                await signIn("password", { email, password, flow: "signIn" });
                router.push("/");
              } catch (err: any) {
                console.error(err);
                setError(err?.message ?? "Sign in failed");
                setLoading(false);
              }
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground/80"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-foreground placeholder:text-foreground/30 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground/80"
                >
                  Password
                </label>
                <Link
                  href="/passwordreset"
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-foreground placeholder:text-foreground/30 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background"
              />
              <label
                htmlFor="remember"
                className="select-none text-sm text-foreground/60"
              >
                Remember me for 30 days
              </label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="group flex h-12 w-full hover:cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight />
            </button>
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 tracking-widest text-foreground/40">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  setLoading(true);
                  await signIn("google");
                } catch (err) {
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex h-12 items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <svg className="h-5 w-5" fill="#0077b5" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-foreground/50">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="ml-1 font-bold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-auto flex gap-6 pb-10 text-xs uppercase tracking-widest text-foreground/30">
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}
