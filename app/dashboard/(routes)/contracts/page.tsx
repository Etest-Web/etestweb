"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import { FileText, CheckCircle, AlertTriangle, Flag, Star, DollarSign, User } from "lucide-react";
import { useState } from "react";
import { getErrorMessage } from "@/lib/utils";

export default function ContractsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const myContracts = useQuery(api.contracts.getMyContracts);
  const updateContractStatus = useMutation(api.contracts.updateContractStatus);
  const submitReview = useMutation(api.reviews.submitReview);

  const [reviewingContract, setReviewingContract] = useState<Id<"contracts"> | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleUpdateStatus = async (contractId: Id<"contracts">, status: "active" | "disputed" | "finished") => {
    if (!confirm(`Mark this contract as ${status}?`)) return;
    await updateContractStatus({ contractId, status });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingContract) return;

    setSubmittingReview(true);
    try {
      await submitReview({
        contractId: reviewingContract,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setReviewingContract(null);
      setReviewData({ rating: 5, comment: "" });
    } catch (err) {
      console.error(err);
      alert(getErrorMessage(err, "Failed to submit review"));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!myContracts) {
    return <div className="p-8 text-white/60">Loading...</div>;
  }

  const activeContracts = myContracts.filter((c) => c.status === "active");
  const disputedContracts = myContracts.filter((c) => c.status === "disputed");
  const finishedContracts = myContracts.filter((c) => c.status === "finished");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Contracts</h1>
        <p className="text-white/60">Manage your active contracts and project deliverables</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-green-400" />
            <span className="text-white/60">Active</span>
          </div>
          <p className="text-3xl font-bold text-white">{activeContracts.length}</p>
        </div>
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-white/60">Disputed</span>
          </div>
          <p className="text-3xl font-bold text-white">{disputedContracts.length}</p>
        </div>
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-white/60">Completed</span>
          </div>
          <p className="text-3xl font-bold text-white">{finishedContracts.length}</p>
        </div>
      </div>

      {/* Active Contracts */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Active Contracts</h2>
        <div className="space-y-4">
          {activeContracts.length > 0 ? (
            activeContracts.map((contract) => (
              <ContractCard
                key={contract._id}
                contract={contract}
                onUpdateStatus={handleUpdateStatus}
                onFinish={() => handleUpdateStatus(contract._id, "finished")}
                onDispute={() => handleUpdateStatus(contract._id, "disputed")}
                onReview={() => setReviewingContract(contract._id)}
                canReview={user?._id !== contract.designerId && contract.status === "finished"}
              />
            ))
          ) : (
            <div className="bg-[#1a1610] border border-white/10 rounded-xl p-8 text-center text-white/60">
              No active contracts
            </div>
          )}
        </div>
      </div>

      {/* Disputed Contracts */}
      {disputedContracts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Disputed Contracts
          </h2>
          <div className="space-y-4">
            {disputedContracts.map((contract) => (
              <ContractCard
                key={contract._id}
                contract={contract}
                onUpdateStatus={handleUpdateStatus}
                canReview={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Finished Contracts */}
      {finishedContracts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Completed Contracts</h2>
          <div className="space-y-4">
            {finishedContracts.map((contract) => (
              <ContractCard
                key={contract._id}
                contract={contract}
                onUpdateStatus={handleUpdateStatus}
                onReview={() => setReviewingContract(contract._id)}
                canReview={user?._id !== contract.designerId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setReviewingContract(null)}
          />
          <div className="relative w-full max-w-lg bg-[#1a1610] border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Share your experience working with this person..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 h-12 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewingContract(null)}
                  className="px-6 h-12 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
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

type ContractStatus = "active" | "disputed" | "finished";

type ContractWithDetails = Doc<"contracts"> & {
  jobTitle: string;
  counterpartyName: string;
  counterpartyRole: string;
};

function ContractCard({
  contract,
  onUpdateStatus,
  onFinish,
  onDispute,
  onReview,
  canReview,
}: {
  contract: ContractWithDetails;
  onUpdateStatus: (id: Id<"contracts">, status: ContractStatus) => void;
  onFinish?: () => void;
  onDispute?: () => void;
  onReview?: () => void;
  canReview?: boolean;
}) {
  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{contract.jobTitle}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {contract.counterpartyName} ({contract.counterpartyRole})
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${contract.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            contract.status === "active"
              ? "bg-green-400/20 text-green-400"
              : contract.status === "disputed"
              ? "bg-red-400/20 text-red-400"
              : "bg-blue-400/20 text-blue-400"
          }`}
        >
          {contract.status}
        </span>
      </div>

      {contract.status === "active" && (
        <div className="flex gap-2">
          {onFinish && (
            <button
              onClick={onFinish}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Complete
            </button>
          )}
          {onDispute && (
            <button
              onClick={onDispute}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Flag className="w-4 h-4" />
              Report Issue
            </button>
          )}
          {canReview && onReview && (
            <button
              onClick={onReview}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors"
            >
              <Star className="w-4 h-4" />
              Leave Review
            </button>
          )}
        </div>
      )}

      {contract.status === "disputed" && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">
            This contract is under dispute. Please contact support for assistance.
          </p>
        </div>
      )}
    </div>
  );
}
