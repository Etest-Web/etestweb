import Link from "next/link";

export default function PasswordResetPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen flex flex-col">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Navbar Component */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-border px-6 md:px-10 py-4 lg:mx-auto lg:w-full lg:max-w-[1200px]">
            <Link href="/" className="flex items-center gap-3 text-primary">
              <div className="size-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">grid_view</span>
              </div>
              <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] font-display">EliteDesign</h2>
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
                  <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
                </div>
                <h1 className="text-white tracking-tight text-3xl font-bold leading-tight mb-3 font-display">Reset your password</h1>
                <p className="text-white/70 text-base font-normal leading-relaxed">
                  No worries! Enter the email address associated with your account and we&apos;ll send you a recovery link.
                </p>
              </div>
              <form className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium leading-normal flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">mail</span>
                    Email Address
                  </label>
                  <input
                    className="form-input flex w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-neutral-muted bg-neutral-surface focus:border-primary h-14 placeholder:text-white/30 p-[15px] text-base font-normal"
                    placeholder="e.g. alex@elitedesign.com"
                    required
                    type="email"
                  />
                </div>
                <button
                  className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary text-background-dark text-lg font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all shadow-lg shadow-primary/10"
                  type="submit"
                >
                  <span className="truncate">Send Recovery Link</span>
                </button>
              </form>
              <div className="mt-8 flex flex-col gap-4 items-center">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-bold"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
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
