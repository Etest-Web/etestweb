import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Submit a proposal for a job (Designer only)
 */
export const submitProposal = mutation({
  args: {
    jobId: v.id("jobs"),
    amount: v.number(),
    coverLetter: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    // Get user's profile to verify they're a designer
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");
    if (profile[0].role !== "designer") {
      throw new Error("Only designers can submit proposals");
    }

    // Check if job exists and is open
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");
    if (job.status !== "open") {
      throw new Error("This job is no longer accepting proposals");
    }

    // Check if designer already submitted a proposal
    const existingProposal = await ctx.db
      .query("proposals")
      .withIndex("by_designer", (q) => q.eq("designerId", profile[0]._id))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .take(1);

    if (existingProposal.length > 0) {
      throw new Error("You've already submitted a proposal for this job");
    }

    const proposalId = await ctx.db.insert("proposals", {
      jobId: args.jobId,
      designerId: profile[0]._id,
      amount: args.amount,
      coverLetter: args.coverLetter,
      status: "pending",
    });

    return proposalId;
  },
});

/**
 * Update proposal status (Client only - accept/reject)
 */
export const updateProposalStatus = mutation({
  args: {
    proposalId: v.id("proposals"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposal not found");

    // Get the job to verify ownership
    const job = await ctx.db.get(proposal.jobId);
    if (!job) throw new Error("Job not found");

    // Verify the current user is the client who posted the job
    const clientProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (clientProfile.length === 0 || clientProfile[0]._id !== job.clientId) {
      throw new Error("Unauthorized to update this proposal");
    }

    await ctx.db.patch(args.proposalId, { status: args.status });

    // If accepted, update job status to in-progress
    if (args.status === "accepted") {
      await ctx.db.patch(proposal.jobId, { status: "in-progress" });
    }
  },
});

/**
 * Get all proposals for a specific job (Client only)
 */
export const getProposalsForJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    // Verify the current user is the client
    const clientProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (clientProfile.length === 0 || clientProfile[0]._id !== job.clientId) {
      throw new Error("Unauthorized to view proposals");
    }

    const proposals = await ctx.db
      .query("proposals")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    // Enrich with designer info
    const proposalsWithDesigner = await Promise.all(
      proposals.map(async (proposal) => {
        const designer = await ctx.db.get(proposal.designerId);
        return {
          ...proposal,
          designerName: designer?.name ?? "Anonymous",
          designerRating: designer?.averageRating,
          designerSkills: designer?.skills ?? [],
          designerLocation: designer?.location,
        };
      })
    );

    return proposalsWithDesigner;
  },
});

/**
 * Get all proposals submitted by current user (Designer only)
 */
export const getMyProposals = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0 || profile[0].role !== "designer") return [];

    const proposals = await ctx.db
      .query("proposals")
      .withIndex("by_designer", (q) => q.eq("designerId", profile[0]._id))
      .collect();

    // Enrich with job info
    const proposalsWithJob = await Promise.all(
      proposals.map(async (proposal) => {
        const job = await ctx.db.get(proposal.jobId);
        return {
          ...proposal,
          jobTitle: job?.title ?? "Unknown Job",
          jobStatus: job?.status ?? "unknown",
          clientName: job ? (await ctx.db.get(job.clientId))?.name ?? "Anonymous" : "Unknown",
        };
      })
    );

    return proposalsWithJob;
  },
});

/**
 * Get proposal by ID
 */
export const getProposalById = query({
  args: { proposalId: v.id("proposals") },
  handler: async (ctx, args) => {
    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) return null;

    const designer = await ctx.db.get(proposal.designerId);
    const job = await ctx.db.get(proposal.jobId);

    return {
      ...proposal,
      designerName: designer?.name ?? "Anonymous",
      designerRating: designer?.averageRating,
      designerSkills: designer?.skills ?? [],
      jobTitle: job?.title ?? "Unknown Job",
    };
  },
});
