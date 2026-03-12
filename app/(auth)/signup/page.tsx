"use client";

import Link from "next/link";
import Image from "next/image"
import { CircleUser, Mail, User, Lock, Folder, MoveLeft} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";

export default function SignupPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Use password provider to create/sign-in the user
      await signIn("password", { email, password, name, flow: "signUp" });
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Unable to create account");
      setLoading(false);
    }
  };
  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Navbar Component */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-border px-6 md:px-10 py-2 lg:mx-auto lg:w-full lg:max-w-[1200px]">
            <Link href="/" className="flex items-center gap-3 text-primary">
              <div className="size-8 flex items-center h-full w-full justify-center">
                <Image src="/Etest-white.png" alt="Ettest" width={100} height={100} className="w-full h-max "/>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <a className="text-white hover:text-primary transition-colors text-sm font-medium" href="#">Support</a>
              <Link
                href="/signin"
                 className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all"
              >
                <span className="truncate">Login</span>
              </Link>
            </div>
          </header>
          {/* Main Content: Focused Card */}
          <main className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[480px] bg-white dark:bg-[#2b2513] rounded-xl shadow-2xl border border-neutral-border p-8 md:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CircleUser />
                </div>
                <h1 className="text-white tracking-tight text-3xl font-bold leading-tight mb-3 font-display">Create an Account</h1>
                <p className="text-white/70 text-base font-normal leading-relaxed">
                  Join the exclusive network of top-tier designers.
                </p>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium leading-normal flex items-center gap-2">
                    <User className="w-4 h-4 text-sm text-primary"/>
                    Full Name
                  </label>
                  <input value={name} onChange={(e)=>setName(e.target.value)} className="form-input flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-neutral-muted bg-neutral-surface focus:border-primary h-14 placeholder:text-white/30 p-[15px] text-base font-normal" placeholder="John Doe" type="text" required/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium leading-normal flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sm text-primary"/>
                    Business Email
                  </label>
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-neutral-muted bg-neutral-surface focus:border-primary h-14 placeholder:text-white/30 p-[15px] text-base font-normal" placeholder="name@company.com" type="email" required/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium leading-normal flex items-center gap-2">
                    <Lock className="w-4 h-4 text-sm text-primary"/>
                    Password
                  </label>
                  <input value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-neutral-muted bg-neutral-surface focus:border-primary h-14 placeholder:text-white/30 p-[15px] text-base font-normal" placeholder="••••••••" type="password" required/>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium leading-normal flex items-center gap-2">
                    <Folder className="w-4 h-4 text-sm text-primary"/>
                    Primary Service Interest
                  </label>
                  <select
                    value={interest}
                    onChange={(e)=>setInterest(e.target.value)}
                    className="form-select flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-neutral-muted bg-neutral-surface focus:border-primary h-14 placeholder:text-white/30 p-[15px] text-base font-normal"
                    defaultValue=""
                    required
                  >
                    <option disabled value="">
                      Select an interest
                    </option>
                    <option value="uiux">UI/UX Design</option>
                    <option value="webdev">Web Development</option>
                    <option value="branding">Branding &amp; Identity</option>
                    <option value="marketing">Digital Marketing</option>
                  </select>
                </div>
                <button disabled={loading} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-background-dark text-lg font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all shadow-lg shadow-primary/10" type="submit">
                  <span className="truncate">{loading?"Creating...":"Create Account"}</span>
                </button>
                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
              </form>
              <div className="mt-8 flex flex-col gap-4 items-center">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-bold"
                >
                  <MoveLeft className="w-4 h-4 text-sm"/>
                  Back to Login
                </Link>
              </div>
            </div>
          </main>
          {/* Footer Section */}
          <footer className="px-6 py-8 text-center">
            <p className="text-white/40 text-sm">
              © 2024 EliteDesign Studio. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
      {/* Background Decorative Element */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/40 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
