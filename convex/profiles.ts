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

    const updateData: Partial<{
      lastSeen: number;
      isOnline: boolean;
      location: { lat: number; lng: number; city: string; country: string };
    }> = {
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
 * Update a user's persisted preferences (notification, privacy, visibility)
 */
export const updatePreferences = mutation({
  args: {
    preferences: v.object({
      emailNotifications: v.optional(v.boolean()),
      proposalAlerts: v.optional(v.boolean()),
      contractUpdates: v.optional(v.boolean()),
      marketingEmails: v.optional(v.boolean()),
      profileVisible: v.optional(v.boolean()),
      showOnlineStatus: v.optional(v.boolean()),
      showLocation: v.optional(v.boolean()),
    }),
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

    const existing = profile[0].preferences ?? {};
    await ctx.db.patch(profile[0]._id, {
      preferences: { ...existing, ...args.preferences },
    });

    return true;
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
      image: p.image,
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
      image: profile.image,
      location: profile.location,
      skills: profile.skills,
      averageRating: profile.averageRating,
      isOnline: profile.isOnline,
      portfolioUrl: profile.portfolioUrl,
    };
  },
});

/**
 * Seed mock designers for development/testing
 * Run this from Convex dashboard or via `npx convex run profiles:seedMockDesigners`
 */
export const seedMockDesigners = mutation({
  args: {},
  handler: async (ctx) => {
    const mockDesigners = [
      {
        userId: "mock-user-1",
        name: "Ava Stone",
        email: "ava.stone@designers.com",
        image: "/avatar-placeholder.png",
        role: "designer" as const,
        portfolioUrl: "https://avastone.design",
        isOnline: true,
        lastSeen: Date.now(),
        location: { lat: 51.5074, lng: -0.1278, country: "UK", city: "London" },
        skills: ["youtube-thumbnail", "logo-design", "brand-identity"],
        bio: "Award-winning visual designer specializing in brand identity and YouTube thumbnails. 8+ years crafting memorable digital experiences.",
        averageRating: 4.9,
        preferences: { profileVisible: true, showOnlineStatus: true, showLocation: true },
      },
      {
        userId: "mock-user-2",
        name: "Marcus Chen",
        email: "marcus.chen@designers.com",
        image: "/avatar-placeholder.png",
        role: "designer" as const,
        portfolioUrl: "https://marcuschen.design",
        isOnline: false,
        lastSeen: Date.now() - 86400000,
        location: { lat: 37.7749, lng: -122.4194, country: "USA", city: "San Francisco" },
        skills: ["ui-ux-design", "product-design", "design-systems"],
        bio: "Product designer focused on SaaS and fintech. Built design systems for 3 unicorns. Passionate about accessible, scalable interfaces.",
        averageRating: 4.8,
        preferences: { profileVisible: true, showOnlineStatus: true, showLocation: true },
      },
      {
        userId: "mock-user-3",
        name: "Sofia Andersson",
        email: "sofia.andersson@designers.com",
        image: "/avatar-placeholder.png",
        role: "designer" as const,
        portfolioUrl: "https://sofiaandersson.design",
        isOnline: true,
        lastSeen: Date.now(),
        location: { lat: 59.3293, lng: 18.0686, country: "Sweden", city: "Stockholm" },
        skills: ["illustration", "character-design", "youtube-thumbnail"],
        bio: "Illustrator and character designer with a whimsical style. Creates custom illustrations for brands, books, and digital content.",
        averageRating: 4.7,
        preferences: { profileVisible: true, showOnlineStatus: true, showLocation: true },
      },
      {
        userId: "mock-user-4",
        name: "Diego Morales",
        email: "diego.morales@designers.com",
        image: "/avatar-placeholder.png",
        role: "designer" as const,
        portfolioUrl: "https://diegomorales.design",
        isOnline: true,
        lastSeen: Date.now(),
        location: { lat: 19.4326, lng: -99.1332, country: "Mexico", city: "Mexico City" },
        skills: ["motion-design", "video-editing", "after-effects"],
        bio: "Motion designer and video editor. Specializes in kinetic typography, logo animations, and social media motion content.",
        averageRating: 4.6,
        preferences: { profileVisible: true, showOnlineStatus: true, showLocation: true },
      },
      {
        userId: "mock-user-5",
        name: "Priya Patel",
        email: "priya.patel@designers.com",
        image: "/avatar-placeholder.png",
        role: "designer" as const,
        portfolioUrl: "https://priyapatel.design",
        isOnline: false,
        lastSeen: Date.now() - 43200000,
        location: { lat: 28.6139, lng: 77.2090, country: "India", city: "New Delhi" },
        skills: ["packaging-design", "print-design", "brand-identity"],
        bio: "Packaging and brand designer. Helps DTC brands stand out on shelves with strategic packaging design and brand systems.",
        averageRating: 4.9,
        preferences: { profileVisible: true, showOnlineStatus: true, showLocation: true },
      },
      {
        userId: "mock-user-6",
        name: "James Okafor",
        email: "james.okafor@designers.com",
        image: "/avatar-placeholder.png",
        role: "designer" as const,
        portfolioUrl: "https://jamesokafor.design",
        isOnline: true,
        lastSeen: Date.now(),
        location: { lat: 6.5244, lng: 3.3792, country: "Nigeria", city: "Lagos" },
        skills: ["web-design", "framer", "webflow", "landing-pages"],
        bio: "No-code web designer building high-converting landing pages in Framer and Webflow. Helps startups launch fast.",
        averageRating: 4.5,
        preferences: { profileVisible: true, showOnlineStatus: true, showLocation: true },
      },
    ];

    const results = [];
    for (const designer of mockDesigners) {
      // Check if already exists
      const existing = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", designer.userId))
        .take(1);

      if (existing.length === 0) {
        const id = await ctx.db.insert("profiles", designer);
        results.push({ name: designer.name, id });
      } else {
        results.push({ name: designer.name, id: existing[0]._id, status: "already exists" });
      }
    }

    return results;
  },
});
