"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { FileText, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  ListRowSkeleton,
  PageHeaderSkeleton,
} from "@/components/ui/skeleton";

export default function MyProposalsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const myProposals = useQuery(api.proposals.getMyProposals);

  if (user === undefined) {
    return (
      <div className="p-8">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatBoxSkeleton />
          <StatBoxSkeleton />
          <StatBoxSkeleton />
        </div>
        <div className="space-y-4">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      </div>
    );
  }

  if (!user || user.role !== "designer") {
    return (
      <div className="p-8">
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">For Designers Only</h2>
          <p className="text-white/60">This page shows your job proposals.</p>
        </div>
      </div>
    );
  }

  const pendingCount = myProposals?.filter((p) => p.status === "pending").length ?? 0;
  const acceptedCount = myProposals?.filter((p) => p.status === "accepted").length ?? 0;
  const rejectedCount = myProposals?.filter((p) => p.status === "rejected").length ?? 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Proposals</h1>
        <p className="text-white/60">Track the status of your job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {myProposals === undefined ? (
          <>
            <StatBoxSkeleton />
            <StatBoxSkeleton />
            <StatBoxSkeleton />
          </>
        ) : (
          <>
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-white/60">Pending</span>
              </div>
              <p className="text-3xl font-bold text-white">{pendingCount}</p>
            </div>
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white/60">Accepted</span>
              </div>
              <p className="text-3xl font-bold text-white">{acceptedCount}</p>
            </div>
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-white/60">Rejected</span>
              </div>
              <p className="text-3xl font-bold text-white">{rejectedCount}</p>
            </div>
          </>
        )}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {myProposals === undefined ? (
          <>
            <ListRowSkeleton />
            <ListRowSkeleton />
            <ListRowSkeleton />
          </>
        ) : myProposals.length > 0 ? (
          myProposals.map((proposal) => (
            <ProposalCard key={proposal._id} proposal={proposal} />
          ))
        ) : (
          <div className="bg-[#1a1610] border border-white/10 rounded-xl p-12 text-center animate-in fade-in duration-300">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Proposals Yet</h3>
            <p className="text-white/60 mb-6">
              Start browsing jobs and submit your first proposal
            </p>
            <Link
              href="/dashboard/jobs/browse"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

type ProposalWithJob = Doc<"proposals"> & {
  jobTitle: string;
  jobStatus: string;
  clientName: string;
};

function ProposalCard({ proposal }: { proposal: ProposalWithJob }) {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-400/20",
      text: "text-yellow-400",
      label: "Pending Review",
      icon: Clock,
    },
    accepted: {
      bg: "bg-green-400/20",
      text: "text-green-400",
      label: "Accepted",
      icon: CheckCircle,
    },
    rejected: {
      bg: "bg-red-400/20",
      text: "text-red-400",
      label: "Rejected",
      icon: XCircle,
    },
  };

  const status = statusConfig[proposal.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-white">{proposal.jobTitle}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.bg} ${status.text}`}
            >
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/60 mb-4">
            <span className="flex items-center gap-1">
              <DollarIcon className="w-4 h-4" />
              ${proposal.amount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              Client: {proposal.clientName}
            </span>
            <span className="flex items-center gap-1">
              <BriefcaseIcon className="w-4 h-4" />
              Status: {proposal.jobStatus}
            </span>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-white/80 mb-2">
              Your Cover Letter
            </h4>
            <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
              {proposal.coverLetter}
            </p>
          </div>

          {proposal.status === "accepted" && (
            <div className="flex items-center gap-2 text-green-400">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">
                You can now message the client directly!
              </span>
            </div>
          )}
        </div>

        {proposal.status === "accepted" && (
          <Link
            href="/dashboard/messages"
            className="h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
          >
            Go to Messages
          </Link>
        )}
      </div>
    </div>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function StatBoxSkeleton() {
  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-5 w-5 rounded bg-white/[0.07]" />
        <div className="h-4 w-20 rounded bg-white/[0.07]" />
      </div>
      <div className="h-9 w-12 rounded bg-white/[0.07]" />
    </div>
  );
}
