import Link from "next/link";
import type { Metadata } from "next";
import { Compass } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-5 text-foreground">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-10 w-10 text-primary" />
        </div>
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-ink dark:text-brand">
          404
        </p>
        <h1 className="mb-3 text-3xl font-bold">Page not found</h1>
        <p className="mb-8 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Back Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/designers">Explore Designers</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
