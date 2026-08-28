import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-slate-950 text-white min-h-[70vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">
          404
        </p>
        <h1 className="text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-white/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center h-11 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
          >
            Back Home
          </Link>
          <Link
            href="/designers"
            className="inline-flex items-center h-11 px-6 rounded-lg border border-white/10 font-medium hover:bg-white/5 transition-colors"
          >
            Explore Designers
          </Link>
        </div>
      </div>
    </main>
  );
}
