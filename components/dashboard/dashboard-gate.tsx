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
        <div className="h-8 w-56 rounded bg-white/[0.06] animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1a1610] border border-white/10 rounded-xl p-6 h-32 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-[#1a1610] border border-white/10 rounded-xl h-40 animate-pulse"
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
