import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Generate an upload URL for portfolio images
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Generate upload URL valid for 1 hour, with max file size of 10MB
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Add a portfolio item (Designer only)
 * imageUrl can be either an external URL or a Convex storageId
 */
export const addPortfolioItem = mutation({
  args: {
    imageUrl: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");
    if (profile[0].role !== "designer") {
      throw new Error("Only designers can add portfolio items");
    }

    const itemId = await ctx.db.insert("portfolioItems", {
      designerId: profile[0]._id,
      imageUrl: args.imageUrl,
      category: args.category,
    });

    return itemId;
  },
});

/**
 * Remove a portfolio item
 */
export const removePortfolioItem = mutation({
  args: { itemId: v.id("portfolioItems") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Portfolio item not found");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0 || profile[0]._id !== item.designerId) {
      throw new Error("Unauthorized to delete this portfolio item");
    }

    await ctx.db.delete(args.itemId);
  },
});

/**
 * Helper to resolve imageUrl - handles both external URLs and Convex storage IDs
 */
async function resolveImageUrl(ctx: any, imageUrl: string): Promise<string> {
  // If it's a regular URL (contains slash), return as-is
  if (imageUrl.includes("/")) {
    return imageUrl;
  }
  // Otherwise treat as Convex storage ID and get URL
  return await ctx.storage.getUrl(imageUrl);
}

/**
 * Get portfolio items for a designer (with resolved image URLs)
 */
export const getDesignerPortfolio = query({
  args: { designerId: v.id("profiles") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("portfolioItems")
      .withIndex("by_designer_category", (q) => q.eq("designerId", args.designerId))
      .collect();

    // Resolve image URLs
    const itemsWithUrls = await Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: await resolveImageUrl(ctx, item.imageUrl),
      }))
    );

    return itemsWithUrls;
  },
});

/**
 * Get current user's portfolio items (with resolved image URLs)
 */
export const getMyPortfolio = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) return [];

    const items = await ctx.db
      .query("portfolioItems")
      .withIndex("by_designer_category", (q) => q.eq("designerId", profile[0]._id))
      .collect();

    // Resolve image URLs
    const itemsWithUrls = await Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: await resolveImageUrl(ctx, item.imageUrl),
      }))
    );

    return itemsWithUrls;
  },
});
