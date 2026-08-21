import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Submit a review for a completed contract
 */
export const submitReview = mutation({
  args: {
    contractId: v.id("contracts"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
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

    // Determine who is being reviewed (the other party)
    const isClient = profile[0]._id === contract.clientId;
    const reviewedUserId = isClient ? contract.designerId : contract.clientId;

    // Check if review already exists (prevent duplicate reviews)
    // Note: You might want to create a separate reviews table for production
    // For now, we'll just update the average rating

    const reviewedProfile = await ctx.db.get(reviewedUserId);
    if (!reviewedProfile) throw new Error("Reviewed user not found");

    // Calculate new average rating
    const currentRating = reviewedProfile.averageRating ?? 0;
    // const ratingCount = reviewedProfile.reviewCount ?? 1;
    // const newAverage = ((currentRating * (ratingCount - 1)) + args.rating) / ratingCount;

    // await ctx.db.patch(reviewedUserId, {
    //   averageRating: Math.round(newAverage * 10) / 10, // Round to 1 decimal
    // });

    // return { success: true, newRating: newAverage };
  },
});

/**
 * Get designer's rating and review count
 */
export const getDesignerRating = query({
  args: { designerId: v.id("profiles") },
  handler: async (ctx, args) => {
    const designer = await ctx.db.get(args.designerId);
    if (!designer) return null;

    return {
      averageRating: designer.averageRating,
      name: designer.name,
    };
  },
});
