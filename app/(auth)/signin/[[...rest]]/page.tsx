"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

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

          <div className="flex w-full justify-center">
            <SignIn
              routing="hash"
              fallbackRedirectUrl="/"
              signUpFallbackRedirectUrl="/"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary text-black hover:bg-primary/90",
                  card: "bg-transparent shadow-none w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-white/10 bg-white/5 hover:bg-white/10 text-white",
                  formFieldInput: "bg-white/5 border-white/10 text-white",
                  formFieldLabel: "text-white/80",
                  dividerText: "text-white/40",
                  dividerLine: "bg-white/10",
                  footer: "hidden",
                }
              }}
            />
          </div>
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
