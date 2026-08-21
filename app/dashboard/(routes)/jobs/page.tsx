"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, MessageSquare, CheckCircle, XCircle, Trash2, Briefcase, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MyJobsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const myJobs = useQuery(api.jobs.getMyJobs);
  const deleteJob = useMutation(api.jobs.deleteJob);
  const [viewingJob, setViewingJob] = useState<{ _id: Id<"jobs">; title: string } | null>(null);

  const handleDelete = async (jobId: Id<"jobs">) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    await deleteJob({ jobId });
  };

  if (user?.role !== "client") {
    return (
      <div className="p-8">
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/60">Only clients can view job postings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Jobs</h1>
          <p className="text-white/60">Manage your job postings and review proposals</p>
        </div>
        <Link
          href="/dashboard/jobs/post"
          className="flex items-center gap-2 h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {viewingJob ? (
        <ProposalsList jobId={viewingJob._id} jobTitle={viewingJob.title} onBack={() => setViewingJob(null)} />
      ) : (
        <div className="space-y-4">
          {myJobs && myJobs.length > 0 ? (
            myJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onViewProposals={() => setViewingJob({ _id: job._id, title: job.title })}
                onDelete={() => handleDelete(job._id)}
              />
            ))
          ) : (
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-12 text-center">
              <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Jobs Posted</h3>
              <p className="text-white/60 mb-6">Start by posting your first job to find designers</p>
              <Link
                href="/dashboard/jobs/post"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Post Your First Job
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function JobCard({
  job,
  onViewProposals,
  onDelete,
}: {
  job: any;
  onViewProposals: () => void;
  onDelete: () => void;
}) {
  const proposalCount = useQuery(api.proposals.getProposalsForJob, { jobId: job._id })?.length ?? 0;

  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-white">{job.title}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.status === "open"
                  ? "bg-green-400/20 text-green-400"
                  : job.status === "in-progress"
                  ? "bg-blue-400/20 text-blue-400"
                  : "bg-gray-400/20 text-gray-400"
              }`}
            >
              {job.status}
            </span>
          </div>
          <p className="text-white/60 mb-4 line-clamp-2">{job.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {job.budgetRange}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.category}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {proposalCount} proposal{proposalCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {proposalCount > 0 && (
            <button
              onClick={onViewProposals}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              View Proposals
            </button>
          )}
          {job.status === "open" && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Delete job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProposalsList({ jobId, jobTitle, onBack }: { jobId: Id<"jobs">; jobTitle: string; onBack: () => void }) {
  const proposals = useQuery(api.proposals.getProposalsForJob, { jobId });
  const updateProposalStatus = useMutation(api.proposals.updateProposalStatus);
  const createContract = useMutation(api.contracts.createContract);
  const [acceptingId, setAcceptingId] = useState<Id<"proposals"> | null>(null);

  const handleAccept = async (proposalId: Id<"proposals">, amount: number) => {
    if (!confirm("Accept this proposal? A contract will be created.")) return;
    setAcceptingId(proposalId);
    try {
      await updateProposalStatus({ proposalId, status: "accepted" });
      await createContract({ proposalId, totalPrice: amount });
    } catch (err) {
      console.error(err);
      alert("Failed to accept proposal");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (proposalId: Id<"proposals">) => {
    if (!confirm("Reject this proposal?")) return;
    await updateProposalStatus({ proposalId, status: "rejected" });
  };

  if (proposals === undefined) {
    return <div className="text-white/60">Loading...</div>;
  }

  const pendingProposals = proposals.filter((p) => p.status === "pending");

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Jobs
      </button>

      <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{jobTitle}</h2>
            <p className="text-white/60 mt-1">
              {pendingProposals.length} pending proposal{pendingProposals.length !== 1 ? "s" : ""} of {proposals.length} total
            </p>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No proposals yet</h3>
            <p className="text-white/60">Designers will see your job and can submit proposals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal._id}
                className="border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {proposal.designerName || "Designer"}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                      {proposal.designerRating && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {proposal.designerRating} rating
                        </span>
                      )}
                      {proposal.designerLocation?.city && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {proposal.designerLocation.city}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${proposal.amount.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.status === "pending"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : proposal.status === "accepted"
                          ? "bg-green-400/20 text-green-400"
                          : "bg-red-400/20 text-red-400"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-black/20 rounded-lg">
                  <h4 className="text-sm font-medium text-white/80 mb-2">Cover Letter</h4>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {proposal.coverLetter}
                  </p>
                </div>

                {proposal.designerSkills && proposal.designerSkills.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-white/60">Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {proposal.designerSkills.slice(0, 6).map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {proposal.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(proposal._id, proposal.amount)}
                      disabled={acceptingId === proposal._id}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {acceptingId === proposal._id ? "Accepting..." : "Accept & Create Contract"}
                    </button>
                    <button
                      onClick={() => handleReject(proposal._id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {proposal.status === "accepted" && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Contract created - project in progress</span>
                  </div>
                )}

                {proposal.status === "rejected" && (
                  <p className="text-sm text-white/40 italic">Proposal rejected</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
