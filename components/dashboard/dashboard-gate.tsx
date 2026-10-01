"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Onboarding } from "@/components/dashboard/onboarding";

export function DashboardGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useQuery(api.users.getCurrentUser);

  if (currentUser === undefined) {
    return (
      <div className="p-8">
        <div className="mb-6 h-8 w-56 animate-pulse rounded-md bg-muted" />
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border border-border bg-card p-6"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border border-border bg-card"
            />
          ))}
        </div>
      </div>
    );
  }

  if (currentUser === null) {
    return <Onboarding />;
  }

  return <>{children}</>;
}
