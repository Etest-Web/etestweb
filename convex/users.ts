import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { calculateDistance } from "./utils/geo";

/**
 * Mirror a Clerk user into this database. Driven by the Clerk webhook in
 * http.ts (user.created / user.updated), which is the source of truth for
 * profile fields since JWT claims may not carry them.
 *
 * This deliberately does NOT create a `profiles` doc: etest-web runs a
 * two-step onboarding (client vs designer, skills, location) and the
 * dashboard gate keys off `getCurrentUser` returning null. An existing
 * profile is only refreshed with the Clerk-owned fields (name, email,
 * image) so design-specific data is never clobbered.
 */
export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
    } else {
      await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        role: "customer",
        createdAt: Date.now(),
      });
    }

    // Keep an already-onboarded profile in step with Clerk, but leave the
    // user-chosen role, skills, bio and location alone.
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.clerkId))
      .unique();

    if (profile) {
      const patch: {
        name?: string;
        email?: string;
        image?: string;
      } = {};
      if (args.name !== undefined) patch.name = args.name;
      if (args.email !== undefined) patch.email = args.email;
      if (args.imageUrl !== undefined) patch.image = args.imageUrl;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(profile._id, patch);
      }
    }
  },
});

/**
 * Remove a user that was deleted in Clerk. Downstream app data (jobs,
 * contracts, profiles) is intentionally left intact so records stay
 * readable rather than dangling on a missing user.
 */
export const deleteFromClerk = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

/**
 * Bulk mirror used by scripts/sync-clerk-users.mjs. Public rather than
 * internal because the backfill runs from outside Convex, and it is a pure
 * upsert keyed on clerkId, so replaying it is safe.
 *
 * Existing rows keep their role: this app's role (designer/customer) is set
 * by onboarding, and this app's role vocabulary is not the LMS's.
 */
export const syncFromClerk = mutation({
  args: {
    users: v.array(
      v.object({
        clerkId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    let created = 0;
    let updated = 0;

    for (const user of args.users) {
      const profile: { email?: string; name?: string; imageUrl?: string } = {};
      if (user.email !== undefined) profile.email = user.email;
      if (user.name !== undefined) profile.name = user.name;
      if (user.imageUrl !== undefined) profile.imageUrl = user.imageUrl;

      const existing = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
        .unique();

      if (existing) {
        if (Object.keys(profile).length > 0) {
          await ctx.db.patch(existing._id, profile);
        }
        updated++;
        continue;
      }

      await ctx.db.insert("users", {
        clerkId: user.clerkId,
        ...profile,
        role: "customer",
        createdAt: Date.now(),
      });
      created++;
    }

    return { created, updated, total: args.users.length };
  },
});

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