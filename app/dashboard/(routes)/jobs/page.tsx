"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import { Plus, MessageSquare, CheckCircle, XCircle, Trash2, Briefcase, Clock, DollarSign, Pencil, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm";
import { Spinner } from "@/components/ui/spinner";
import {
  JobCardSkeleton,
  PageHeaderSkeleton,
} from "@/components/ui/skeleton";

export default function MyJobsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const myJobs = useQuery(api.jobs.getMyJobs);
  const deleteJob = useMutation(api.jobs.deleteJob);
  const closeJob = useMutation(api.jobs.closeJob);
  const [viewingJob, setViewingJob] = useState<{ _id: Id<"jobs">; title: string } | null>(null);
  const [editingJob, setEditingJob] = useState<Doc<"jobs"> | null>(null);
  const [deletingId, setDeletingId] = useState<Id<"jobs"> | null>(null);
  const [closingId, setClosingId] = useState<Id<"jobs"> | null>(null);
  const toast = useToast();
  const confirmDialog = useConfirm();

  const handleDelete = async (jobId: Id<"jobs">) => {
    const confirmed = await confirmDialog({
      title: "Delete this job?",
      message:
        "The posting will be removed permanently along with its visibility to designers.",
      confirmLabel: "Delete Job",
      destructive: true,
    });
    if (!confirmed) return;

    setDeletingId(jobId);
    try {
      await deleteJob({ jobId });
      toast.success("Job deleted", "Your job posting has been removed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job", getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const handleClose = async (jobId: Id<"jobs">) => {
    const confirmed = await confirmDialog({
      title: "Close this job?",
      message:
        "The job will be marked completed, stop accepting new proposals, and be removed from designers' browse list. Any pending proposals will be rejected.",
      confirmLabel: "Close Job",
    });
    if (!confirmed) return;

    setClosingId(jobId);
    try {
      await closeJob({ jobId });
      toast.success("Job closed", "The job is no longer accepting proposals.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to close job", getErrorMessage(err));
    } finally {
      setClosingId(null);
    }
  };

  if (user === undefined || myJobs === undefined) {
    return (
      <div className="p-8">
        <PageHeaderSkeleton />
        <div className="space-y-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    );
  }

  if (!user || user.role !== "client") {
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
          {myJobs.length > 0 ? (
            myJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                deleting={deletingId === job._id}
                closing={closingId === job._id}
                onViewProposals={() => setViewingJob({ _id: job._id, title: job.title })}
                onDelete={() => handleDelete(job._id)}
                onEdit={() => setEditingJob(job)}
                onClose={() => handleClose(job._id)}
              />
            ))
          ) : (
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-12 text-center animate-in fade-in duration-300">
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

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSaved={() => setEditingJob(null)}
        />
      )}
    </div>
  );
}

function JobCard({
  job,
  deleting,
  closing,
  onViewProposals,
  onDelete,
  onEdit,
  onClose,
}: {
  job: Doc<"jobs">;
  deleting: boolean;
  closing: boolean;
  onViewProposals: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onClose: () => void;
}) {
  const proposalCount = useQuery(api.proposals.getProposalsForJob, { jobId: job._id })?.length ?? 0;

  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 transition-opacity aria-busy:opacity-70" aria-busy={deleting || closing}>
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
            <>
              <button
                onClick={onEdit}
                className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
                title="Edit job"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                disabled={closing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                title="Close job"
              >
                {closing ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onDelete}
                disabled={deleting}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                title="Delete job"
              >
                {deleting ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </>
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
  const [rejectingId, setRejectingId] = useState<Id<"proposals"> | null>(null);
  const toast = useToast();
  const confirmDialog = useConfirm();

  const handleAccept = async (proposalId: Id<"proposals">, amount: number) => {
    const confirmed = await confirmDialog({
      title: "Accept this proposal?",
      message: `A contract will be created for $${amount.toLocaleString()} and the designer will be notified.`,
      confirmLabel: "Accept & Create Contract",
    });
    if (!confirmed) return;

    setAcceptingId(proposalId);
    try {
      await updateProposalStatus({ proposalId, status: "accepted" });
      await createContract({ proposalId, totalPrice: amount });
      toast.success("Proposal accepted", "A contract has been created. You can now message the designer.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept proposal", getErrorMessage(err));
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (proposalId: Id<"proposals">) => {
    const confirmed = await confirmDialog({
      title: "Reject this proposal?",
      message: "The designer will be notified that their proposal was not accepted.",
      confirmLabel: "Reject Proposal",
      destructive: true,
    });
    if (!confirmed) return;

    setRejectingId(proposalId);
    try {
      await updateProposalStatus({ proposalId, status: "rejected" });
      toast.success("Proposal rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject proposal", getErrorMessage(err));
    } finally {
      setRejectingId(null);
    }
  };

  if (proposals === undefined) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-white/[0.07] rounded-lg" />
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="border border-white/10 rounded-xl p-6 bg-white/5 space-y-4">
              <div className="h-6 w-40 bg-white/[0.07] rounded-lg" />
              <div className="h-16 w-full bg-white/[0.07] rounded-lg" />
              <div className="h-10 w-64 bg-white/[0.07] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
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
          <div className="text-center py-12 animate-in fade-in duration-300">
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
                      disabled={acceptingId === proposal._id || rejectingId === proposal._id}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50"
                    >
                      {acceptingId === proposal._id ? (
                        <>
                          <Spinner className="w-4 h-4" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Accept & Create Contract
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(proposal._id)}
                      disabled={acceptingId === proposal._id || rejectingId === proposal._id}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-medium transition-colors disabled:opacity-50"
                    >
                      {rejectingId === proposal._id ? (
                        <>
                          <Spinner className="w-4 h-4" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Reject
                        </>
                      )}
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

function EditJobModal({
  job,
  onClose,
  onSaved,
}: {
  job: Doc<"jobs">;
  onClose: () => void;
  onSaved: () => void;
}) {
  const updateJob = useMutation(api.jobs.updateJob);
  const toast = useToast();
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState(job.description);
  const [budgetRange, setBudgetRange] = useState(job.budgetRange);
  const [category, setCategory] = useState(job.category);
  const [saving, setSaving] = useState(false);

  const canSubmit = title.trim() && description.trim() && budgetRange.trim() && category.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await updateJob({
        jobId: job._id,
        title: title.trim(),
        description: description.trim(),
        budgetRange: budgetRange.trim(),
        category: category.trim(),
      });
      toast.success("Job updated", "Your job posting has been saved.");
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full h-12 px-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#15120c] border border-white/10 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-1">Edit Job</h2>
        <p className="text-sm text-white/60 mb-5">Only open jobs can be edited. Closing is done from the job card.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Job Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Logo rebrand" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
              placeholder="Describe the project..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Budget Range</label>
            <input value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className={inputCls} placeholder="e.g. $1,000 - $2,500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls} placeholder="e.g. Branding" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="flex items-center gap-2 h-11 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
