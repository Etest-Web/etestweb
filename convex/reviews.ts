import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { createNotification } from "./notifications";

/**
 * Submit a review for a completed contract.
 * Each party can review the other once per contract.
 * Recomputes the reviewed user's averageRating afterwards.
 */
export const submitReview = mutation({
  args: {
    contractId: v.id("contracts"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const contract = await ctx.db.get(args.contractId);
    if (!contract) throw new Error("Contract not found");

    if (contract.status !== "finished") {
      throw new Error("Can only review finished contracts");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");
    const reviewerId = profile[0]._id;

    // Reviewer must be a party of the contract
    const isClient = reviewerId === contract.clientId;
    const isDesigner = reviewerId === contract.designerId;
    if (!isClient && !isDesigner) {
      throw new Error("Unauthorized to review this contract");
    }

    const reviewedId = isClient ? contract.designerId : contract.clientId;

    // Prevent duplicate reviews per (contract, reviewer)
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_contract_and_reviewer", (q) =>
        q.eq("contractId", args.contractId).eq("reviewerId", reviewerId)
      )
      .take(1);

    if (existing.length > 0) {
      throw new Error("You have already reviewed this contract");
    }

    await ctx.db.insert("reviews", {
      contractId: args.contractId,
      reviewerId,
      reviewedId,
      rating: args.rating,
      comment: args.comment,
      createdAt: Date.now(),
    });

    // Recompute the reviewed user's average rating from all their reviews
    const allReviews = await ctx.db
      .query("reviews")
      .withIndex("by_reviewed", (q) => q.eq("reviewedId", reviewedId))
      .collect();

    const average =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await ctx.db.patch(reviewedId, {
      averageRating: Math.round(average * 10) / 10,
    });

    // Notify the reviewed party
    await createNotification(ctx, {
      recipientId: reviewedId,
      type: "review_received",
      title: "New review",
      body: `You received a ${args.rating}-star review.`,
      contractId: args.contractId,
      link: isClient
        ? `/designers/${reviewedId}`
        : "/dashboard/profile",
    });

    return { success: true, reviewCount: allReviews.length };
  },
});

/**
 * Get a designer's aggregate rating info
 */
export const getDesignerRating = query({
  args: { designerId: v.id("profiles") },
  handler: async (ctx, args) => {
    const designer = await ctx.db.get(args.designerId);
    if (!designer) return null;

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_reviewed", (q) => q.eq("reviewedId", args.designerId))
      .collect();

    return {
      averageRating: designer.averageRating,
      reviewCount: reviews.length,
      name: designer.name,
    };
  },
});

/**
 * Get recent reviews for a profile, with reviewer names
 */
export const getReviewsForDesigner = query({
  args: { designerId: v.id("profiles") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_reviewed", (q) => q.eq("reviewedId", args.designerId))
      .order("desc")
      .take(20);

    return Promise.all(
      reviews.map(async (review) => {
        const reviewer = await ctx.db.get(review.reviewerId);
        return {
          ...review,
          reviewerName: reviewer?.name ?? "Anonymous",
        };
      })
    );
  },
});
