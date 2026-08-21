"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase, MessageSquare, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const user = useQuery(api.users.getCurrentUser);
  const myJobs = useQuery(api.jobs.getMyJobs);
  const myProposals = useQuery(api.proposals.getMyProposals);
  const myContracts = useQuery(api.contracts.getMyContracts);
  const unreadCount = useQuery(api.messages.getUnreadCount);

  const stats = [
    {
      label: user?.role === "client" ? "Active Jobs" : "Active Contracts",
      value: user?.role === "client" 
        ? myJobs?.filter((j) => j.status === "open").length ?? 0
        : myContracts?.filter((c) => c.status === "active").length ?? 0,
      icon: Briefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: user?.role === "client" ? "Proposals Received" : "Proposals Sent",
      value: myProposals?.length ?? 0,
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Total Earnings",
      value: `$${myContracts
        ?.filter((c) => c.status === "finished")
        .reduce((sum, c) => sum + c.totalPrice, 0).toLocaleString() ?? 0}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Unread Messages",
      value: unreadCount ?? 0,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
  ];

  const recentActivity = user?.role === "client" ? myJobs?.slice(0, 5) : myProposals?.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name ?? "User"}!
        </h1>
        <p className="text-white/60">
          Here's what's happening with your {user?.role === "client" ? "jobs" : "projects"} today.
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
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
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
            Recent {user?.role === "client" ? "Jobs" : "Proposals"}
          </h2>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((item: any) => (
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
                        item.status === "open" || item.status === "active"
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
            <p className="text-white/60">No recent activity</p>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user?.role === "client" ? (
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
