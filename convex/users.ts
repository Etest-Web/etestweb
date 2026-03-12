import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { calculateDistance } from "./utils/geo";
import { mutation } from "./_generated/server";

/**
 * Returns the current user document if authenticated, null otherwise.
 * Use this in components to show user info or guard authenticated content.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const authUser = await ctx.db.get(userId);
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    const profile = profiles[0] ?? null;
    // For backward compatibility return the profile document when available,
    // otherwise return the auth user document.
    return profile ?? authUser;
  },
});

// convex/users.ts
export const updatePresence = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    // Patch the profile associated with this auth user (if present)
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profiles.length) {
      await ctx.db.patch(profiles[0]._id, {
        isOnline: true,
        lastSeen: Date.now(),
      });
    }
  },
});


export const getDesignersByDemand = query({
  args: { 
    demand: v.string(), 
    userLat: v.number(), 
    userLng: v.number(),
    userCountry: v.string()
  },
  handler: async (ctx, args) => {
    // 1. Fetch ALL online designers who match the skill tag (YouTube Thumbnail, etc.)
    const onlineDesignersRaw = await ctx.db
      .query("profiles")
      .withIndex("by_online_and_role", (q) =>
        q.eq("isOnline", true).eq("role", "designer")
      )
      .collect();

    // Filter in JS since the query FilterBuilder doesn't expose a 'contains' method
    const onlineDesigners = onlineDesignersRaw.filter((d) =>
      Array.isArray(d.skills) && d.skills.includes(args.demand)
    );

    // 2. Map designers with their distance and basic portfolio preview
    const designersWithDistance = await Promise.all(
      onlineDesigners.map(async (d) => {
        const dist = calculateDistance(
          args.userLat, args.userLng, 
          d.location.lat, d.location.lng
        );
        
        // Fetch their top 3 portfolio items for this specific category
        const samples = await ctx.db
          .query("portfolioItems")
          .withIndex("by_designer_category", (q) => 
            q.eq("designerId", d._id).eq("category", args.demand)
          )
          .take(3);

        return { ...d, distance: dist, samples };
      })
    );

    // 3. Waterfall Sorting Logic
    return designersWithDistance.sort((a, b) => {
      // Priority 1: Same Country first
      if (a.location.country === args.userCountry && b.location.country !== args.userCountry) return -1;
      if (a.location.country !== args.userCountry && b.location.country === args.userCountry) return 1;

      // Priority 2: Closest distance
      return a.distance - b.distance;
    });
  },
});