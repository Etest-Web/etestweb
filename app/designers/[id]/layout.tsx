import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Designer Profile",
    description:
      "View certified designer profiles, portfolios, ratings, and pricing tiers on Glypha.",
    openGraph: {
      title: "Designer Profile | Glypha",
      description:
        "View certified designer profiles, portfolios, ratings, and pricing tiers on Glypha.",
      type: "profile",
      url: `/designers/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Designer Profile | Glypha",
      description:
        "View certified designer profiles, portfolios, ratings, and pricing tiers on Glypha.",
    },
    robots: "index, follow",
  };
}

export default async function DesignerDetailLayout({
  children,
  params,
}: LayoutProps) {
  const { id } = await params;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Designer",
            jobTitle: "Design Professional",
            image: "http://localhost:3000/Logo.svg",
            url: `http://localhost:3000/designers/${id}`,
            description:
              "Premium design services from a certified designer on Glypha.",
            sameAs: [
              "https://dribbble.com",
              "https://linkedin.com",
              "https://twitter.com",
            ],
            address: {
              "@type": "PostalAddress",
              addressCountry: "Worldwide",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
