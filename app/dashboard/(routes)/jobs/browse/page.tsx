"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "UI/UX Design",
  "Web Development",
  "Branding & Identity",
  "Logo Design",
  "Mobile App Design",
  "Print Design",
  "Motion Graphics",
  "Illustration",
  "3D Design",
  "Digital Marketing",
];

type AvailableJob = Doc<"jobs"> & { clientName: string; clientRating?: number };

export default function BrowseJobsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const allJobs = useQuery(api.jobs.getAvailableJobs, {});
  const submitProposal = useMutation(api.proposals.submitProposal);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedJob, setSelectedJob] = useState<AvailableJob | null>(null);
  const [proposalData, setProposalData] = useState({ amount: "", coverLetter: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    if (!allJobs) return [];

    return allJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || job.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allJobs, searchQuery, selectedCategory]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setError(null);
    setSubmitting(true);

    try {
      await submitProposal({
        jobId: selectedJob._id,
        amount: parseFloat(proposalData.amount),
        coverLetter: proposalData.coverLetter,
      });
      setSelectedJob(null);
      setProposalData({ amount: "", coverLetter: "" });
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Failed to submit proposal"));
      setSubmitting(false);
    }
  };

  if (user?.role !== "designer") {
    return (
      <div className="p-8">
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">For Designers Only</h2>
          <p className="text-white/60 mb-6">
            This page is for designers looking for jobs.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Jobs</h1>
        <p className="text-white/60">
          Find your next project from {filteredJobs.length} available jobs
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs by title or description..."
            className="w-full h-12 pl-12 pr-4 rounded-lg border border-white/10 bg-[#1a1610] text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-5 h-5 text-white/40 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-black"
                  : "bg-[#1a1610] text-white/70 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-[#1a1610] border border-white/10 rounded-xl p-12 text-center">
            <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Jobs Found</h3>
            <p className="text-white/60">
              Try adjusting your search or filters to find more opportunities
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onApply={() => setSelectedJob(job)}
            />
          ))
        )}
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedJob(null);
              setError(null);
              setProposalData({ amount: "", coverLetter: "" });
            }}
          />
          <div className="relative w-full max-w-2xl bg-[#1a1610] border border-white/10 rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Submit Proposal</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <CloseIcon className="w-6 h-6 text-white/60" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="font-bold text-white mb-2">{selectedJob.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {selectedJob.budgetRange}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {selectedJob.category}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Posted by {selectedJob.clientName}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Your Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={proposalData.amount}
                  onChange={(e) =>
                    setProposalData({ ...proposalData, amount: e.target.value })
                  }
                  placeholder="Enter your proposed amount"
                  className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={proposalData.coverLetter}
                  onChange={(e) =>
                    setProposalData({ ...proposalData, coverLetter: e.target.value })
                  }
                  placeholder="Explain why you're the perfect fit for this project..."
                  rows={6}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  required
                />
                <p className="mt-2 text-sm text-white/60">
                  Highlight your relevant experience and approach to this project
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-12 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Proposal"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-8 h-12 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, onApply }: { job: AvailableJob; onApply: () => void }) {
  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-3">{job.title}</h3>
          <p className="text-white/60 mb-4 line-clamp-2">{job.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {job.budgetRange}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.clientName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.status}
            </span>
          </div>
        </div>
        <button
          onClick={onApply}
          className="ml-4 h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
