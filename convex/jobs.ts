import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new job posting (Client only)
 */
export const createJob = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    budgetRange: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    // Get user's profile to verify they're a client
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");
    if (profile[0].role !== "client") {
      throw new Error("Only clients can post jobs");
    }

    const jobId = await ctx.db.insert("jobs", {
      clientId: profile[0]._id,
      title: args.title,
      description: args.description,
      budgetRange: args.budgetRange,
      category: args.category,
      status: "open",
    });

    return jobId;
  },
});

/**
 * Update a job posting
 */
export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    budgetRange: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("open"), v.literal("in-progress"), v.literal("completed"))
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    // Verify ownership
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0 || profile[0]._id !== job.clientId) {
      throw new Error("Unauthorized to update this job");
    }

    const updateData: Partial<{
      title: string;
      description: string;
      budgetRange: string;
      category: string;
      status: "open" | "in-progress" | "completed";
    }> = {};
    if (args.title) updateData.title = args.title;
    if (args.description) updateData.description = args.description;
    if (args.budgetRange) updateData.budgetRange = args.budgetRange;
    if (args.category) updateData.category = args.category;
    if (args.status) updateData.status = args.status;

    await ctx.db.patch(args.jobId, updateData);
  },
});

/**
 * Delete a job posting
 */
export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    // Verify ownership
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0 || profile[0]._id !== job.clientId) {
      throw new Error("Unauthorized to delete this job");
    }

    await ctx.db.delete(args.jobId);
  },
});

/**
 * Get all open jobs with designer info
 */
export const getAvailableJobs = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allJobs = await ctx.db
      .query("jobs")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .collect();

    let filteredJobs = allJobs;

    if (args.category) {
      filteredJobs = filteredJobs.filter((job) => job.category === args.category);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    // Enrich with client info
    const jobsWithClient = await Promise.all(
      filteredJobs.map(async (job) => {
        const client = await ctx.db.get(job.clientId);
        return {
          ...job,
          clientName: client?.name ?? "Anonymous",
          clientRating: client?.averageRating,
        };
      })
    );

    return jobsWithClient;
  },
});

/**
 * Get jobs posted by current user (client)
 */
export const getMyJobs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0 || profile[0].role !== "client") return [];

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_clientId", (q) => q.eq("clientId", profile[0]._id))
      .collect();

    return jobs;
  },
});

/**
 * Get a single job by ID
 */
export const getJobById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    const client = await ctx.db.get(job.clientId);
    return {
      ...job,
      clientName: client?.name ?? "Anonymous",
      clientRating: client?.averageRating,
    };
  },
});
