"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-slate-950 text-white min-h-[70vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/10 mx-auto mb-6 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
        <p className="text-white/60 mb-8">
          An unexpected error occurred. Please try again — if the problem
          persists, come back later.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </main>
  );
}
