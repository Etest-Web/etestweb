import { query } from "./_generated/server";
import { v } from "convex/values";
import { calculateDistance } from "./utils/geo";

/**
 * Returns the current user document if authenticated, null otherwise.
 * Use this in components to show user info or guard authenticated content.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) {
      return null;
    }
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    const profile = profiles[0] ?? null;
    return profile;
  },
});

/**
 * Get all designers with their portfolio preview
 */
export const getAllDesigners = query({
  args: {
    search: v.optional(v.string()),
    specialty: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allDesigners = await ctx.db
      .query("profiles")
      .withIndex("by_online_and_role", (q) => q.eq("isOnline", true).eq("role", "designer"))
      .collect();

    let filtered = allDesigners;

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(searchLower) ||
          d.location.city.toLowerCase().includes(searchLower) ||
          d.skills.some((s) => s.toLowerCase().includes(searchLower))
      );
    }

    if (args.specialty) {
      filtered = filtered.filter((d) => d.skills.includes(args.specialty!));
    }

    // Enrich with portfolio samples
    const designersWithSamples = await Promise.all(
      filtered.map(async (designer) => {
        const samples = await ctx.db
          .query("portfolioItems")
          .withIndex("by_designer_category", (q) => q.eq("designerId", designer._id))
          .take(3);

        return {
          ...designer,
          samples,
          distance: 0, // Placeholder for compatibility
        };
      })
    );

    return designersWithSamples;
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