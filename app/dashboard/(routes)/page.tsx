"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase, MessageSquare, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Skeleton,
  StatCardSkeleton,
  ListRowSkeleton,
  PageHeaderSkeleton,
} from "@/components/ui/skeleton";

export default function DashboardOverview() {
  const user = useQuery(api.users.getCurrentUser);
  const myJobs = useQuery(api.jobs.getMyJobs);
  const myProposals = useQuery(api.proposals.getMyProposals);
  const myContracts = useQuery(api.contracts.getMyContracts);
  const unreadCount = useQuery(api.messages.getUnreadCount);

  const isClient = user?.role === "client";

  const finishedEarnings = myContracts
    ?.filter((c) => c.status === "finished")
    .reduce((sum, c) => sum + c.totalPrice, 0);

  const stats = [
    {
      label: isClient ? "Active Jobs" : "Active Contracts",
      value: isClient
        ? myJobs?.filter((j) => j.status === "open").length ?? 0
        : myContracts?.filter((c) => c.status === "active").length ?? 0,
      loading: isClient ? myJobs === undefined : myContracts === undefined,
      icon: Briefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: isClient ? "Proposals Received" : "Proposals Sent",
      value: myProposals?.length ?? 0,
      loading: myProposals === undefined,
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Total Earnings",
      value: `$${(finishedEarnings ?? 0).toLocaleString()}`,
      loading: myContracts === undefined,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Unread Messages",
      value: unreadCount ?? 0,
      loading: unreadCount === undefined,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  const recentActivity =
    user?.role === "client" ? myJobs?.slice(0, 5) : myProposals?.slice(0, 5);

  if (user === undefined) {
    return (
      <div className="p-8">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="p-8">
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in required</h2>
          <p className="text-white/60">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-white/60">
          Here&apos;s what&apos;s happening with your {isClient ? "jobs" : "projects"} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#1a1610] border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {stat.label === "Unread Messages" && Number(stat.value) > 0 && (
                  <span className="px-2 py-1 bg-primary text-black text-xs font-bold rounded-full">
                    {stat.value}
                  </span>
                )}
              </div>
              {stat.loading ? (
                <Skeleton className="h-9 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              )}
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Recent {isClient ? "Jobs" : "Proposals"}
          </h2>
          {recentActivity === undefined ? (
            <div className="space-y-3">
              <ListRowSkeleton />
              <ListRowSkeleton />
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {"title" in item ? item.title : item.jobTitle}
                      </p>
                      <p className="text-sm text-white/60 mt-1">
                        {"budgetRange" in item
                          ? item.budgetRange
                          : `Amount: $${item.amount}`}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "open"
                          ? "bg-green-400/20 text-green-400"
                          : item.status === "pending"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-gray-400/20 text-gray-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-white/5 mx-auto mb-3 flex items-center justify-center">
                {isClient ? (
                  <Briefcase className="w-7 h-7 text-white/30" />
                ) : (
                  <MessageSquare className="w-7 h-7 text-white/30" />
                )}
              </div>
              <p className="font-medium text-white">Nothing here yet</p>
              <p className="text-sm text-white/60 mt-1 mb-4">
                {isClient
                  ? "Post a job to start receiving proposals"
                  : "Browse jobs and send your first proposal"}
              </p>
              <Link
                href={isClient ? "/dashboard/jobs/post" : "/dashboard/jobs/browse"}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
              >
                {isClient ? "Post a Job" : "Browse Jobs"}
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {isClient ? (
              <>
                <Link
                  href="/dashboard/jobs/post"
                  className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">Post a New Job</p>
                    <p className="text-sm text-white/60">
                      Find the perfect designer for your project
                    </p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/jobs"
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white font-medium">View All Jobs</p>
                    <p className="text-sm text-white/60">
                      Manage your job postings
                    </p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/jobs/browse"
                  className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-white font-medium">Browse Jobs</p>
                    <p className="text-sm text-white/60">
                      Find your next project
                    </p>
                  </div>
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white font-medium">Update Portfolio</p>
                    <p className="text-sm text-white/60">
                      Showcase your best work
                    </p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
