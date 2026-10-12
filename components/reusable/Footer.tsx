import Link from "next/link";

import { ArrowUpRight } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";

const COLUMNS = [
  {
    title: "Marketplace",
    links: [
      { label: "Find talent", href: "/designers" },
      { label: "How it works", href: "/#process" },
      { label: "Post a job", href: "/dashboard/jobs/post" },
      { label: "Seller levels", href: "/designers" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "The wall", href: "/#talent" },
      { label: "Glypha Learn", href: "/" },
      { label: "Become a seller", href: "/dashboard" },
      { label: "Contracts", href: "/dashboard/contracts" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Dribbble", href: "https://dribbble.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Twitter", href: "https://twitter.com" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Wordmark column — deliberately oversized and left-aligned */}
          <div className="lg:col-span-5">
            <Logo className="w-40" />
            <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-muted-foreground">
              We are the architects of digital narrative — a curated bench
              where brands and certified designers meet on terms both can
              read.
            </p>
            <Link href="/dashboard/jobs/post" className="btn-pill group mt-10">
              Post a brief
              <span className="btn-pill__island">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Link columns — offset, not a symmetric 3-up */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {column.title}
                </h3>
                <ul className="mt-6 space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="link-underline text-[15px] text-foreground/80 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 border-t border-border pt-8 text-[12px] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {year} Glypha Storytelling Agency. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
            <span className="cursor-default">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
