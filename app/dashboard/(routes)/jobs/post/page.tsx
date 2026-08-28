"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Briefcase, DollarSign, Tag, FileText } from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

const CATEGORIES = [
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

const BUDGET_RANGES = [
  "$100 - $500",
  "$500 - $1,000",
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
];

export default function PostJobPage() {
  const router = useRouter();
  const createJob = useMutation(api.jobs.createJob);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetRange: "",
    category: "",
  });
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createJob({
        title: formData.title,
        description: formData.description,
        budgetRange: formData.budgetRange,
        category: formData.category,
      });
      toast.success("Job posted", "Designers can now discover and apply to your project.");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Failed to post job"));
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
        <p className="text-white/60">
          Tell us about your project and find the perfect designer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Title */}
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Job Title</h2>
          </div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Modern Logo Design for Tech Startup"
            className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
          <p className="mt-2 text-sm text-white/60">
            Make it clear and specific to attract the right designers
          </p>
        </div>

        {/* Category */}
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Category</h2>
          </div>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Budget Range</h2>
          </div>
          <select
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          >
            <option value="">Select budget range</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Project Description</h2>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your project in detail. Include goals, timeline, deliverables, and any specific requirements..."
            rows={8}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            required
          />
          <p className="mt-2 text-sm text-white/60">
            The more details you provide, the better proposals you&apos;ll receive
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-12 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Spinner className="w-5 h-5" />}
            {loading ? "Posting Job..." : "Post Job"}
          </button>
          <Link
            href="/dashboard/jobs"
            className="px-8 h-12 flex items-center justify-center rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
