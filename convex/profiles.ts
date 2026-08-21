import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create or update user profile after signup
 */
export const createOrUpdateProfile = mutation({
  args: {
    role: v.union(v.literal("designer"), v.literal("client")),
    name: v.string(),
    bio: v.optional(v.string()),
    skills: v.array(v.string()),
    portfolioUrl: v.optional(v.string()),
    city: v.string(),
    country: v.string(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (existingProfile.length > 0) {
      // Update existing profile
      await ctx.db.patch(existingProfile[0]._id, {
        name: args.name,
        bio: args.bio,
        skills: args.skills,
        portfolioUrl: args.portfolioUrl,
        role: args.role,
        location: {
          city: args.city,
          country: args.country,
          lat: args.lat,
          lng: args.lng,
        },
      });
      return existingProfile[0]._id;
    }

    // Create new profile
    const profileId = await ctx.db.insert("profiles", {
      userId,
      name: args.name,
      bio: args.bio ?? "",
      skills: args.skills,
      portfolioUrl: args.portfolioUrl,
      role: args.role,
      isOnline: false,
      lastSeen: Date.now(),
      location: {
        city: args.city,
        country: args.country,
        lat: args.lat,
        lng: args.lng,
      },
      averageRating: undefined,
    });

    return profileId;
  },
});

/**
 * Update user's online presence
 */
export const updatePresence = mutation({
  args: {
    isOnline: v.optional(v.boolean()),
    location: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
        city: v.string(),
        country: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) return;

    const updateData: any = {
      lastSeen: Date.now(),
    };

    if (args.isOnline !== undefined) {
      updateData.isOnline = args.isOnline;
    }

    if (args.location) {
      updateData.location = args.location;
    }

    await ctx.db.patch(profile[0]._id, updateData);
  },
});

/**
 * Add a skill to user's profile
 */
export const addSkill = mutation({
  args: { skill: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");

    const currentSkills = profile[0].skills || [];
    if (!currentSkills.includes(args.skill)) {
      await ctx.db.patch(profile[0]._id, {
        skills: [...currentSkills, args.skill],
      });
    }
  },
});

/**
 * Remove a skill from user's profile
 */
export const removeSkill = mutation({
  args: { skill: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");

    const currentSkills = profile[0].skills || [];
    await ctx.db.patch(profile[0]._id, {
      skills: currentSkills.filter((s) => s !== args.skill),
    });
  },
});

/**
 * Get current user's profile
 */
export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    return profile[0] ?? null;
  },
});

/**
 * List all designers (for discovery page)
 * Returns safe public profile fields only
 */
export const listDesigners = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("role"), "designer"))
      .collect();

    return profiles.map((p) => ({
      _id: p._id,
      name: p.name,
      bio: p.bio,
      location: p.location,
      skills: p.skills,
      averageRating: p.averageRating,
      isOnline: p.isOnline,
      portfolioUrl: p.portfolioUrl,
    }));
  },
});

/**
 * Get a single designer by ID (public profile)
 */
export const getDesignerById = query({
  args: { designerId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.designerId);
    if (!profile || profile.role !== "designer") return null;

    return {
      _id: profile._id,
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      skills: profile.skills,
      averageRating: profile.averageRating,
      isOnline: profile.isOnline,
      portfolioUrl: profile.portfolioUrl,
    };
  },
});
