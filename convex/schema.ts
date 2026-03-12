import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Integrate Convex Auth tables (users, sessions, accounts)
  ...authTables,

  // Separate profile table that references the auth `users` doc.
  // This avoids redefining the built-in `users` table provided by authTables.
  profiles: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()), // Profile pic
    role: v.union(v.literal("designer"), v.literal("client")),
    portfolioUrl: v.optional(v.string()),
    // --- LATEST STATUS & LOCATION ---
    isOnline: v.boolean(),
    lastSeen: v.number(), // Timestamp
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      country: v.string(),
      city: v.string(),
    }),

    // --- SEARCHABLE METADATA ---
    skills: v.array(v.string()), // e.g., ["youtube-thumbnail", "logo-design"]
    bio: v.string(),
    averageRating: v.optional(v.number()),
  })
    .index("by_online_and_role", ["isOnline", "role"])
    .index("by_country", ["location.country"])
    .index("by_userId", ["userId"])
    .searchIndex("search_skills", {
      searchField: "bio",
      filterFields: ["isOnline", "role"],
    }),

  // Portfolio items for the "Selection" phase
  portfolioItems: defineTable({
    designerId: v.id("profiles"),
    imageUrl: v.string(),
    category: v.string(), // e.g., "YouTube Thumbnail"
  }).index("by_designer_category", ["designerId", "category"]),

  

  // Designer Portfolios / Case Studies
  projects: defineTable({
    designerId: v.id("profiles"),
    title: v.string(),
    description: v.string(),
    coverImage: v.string(), // Storage ID or URL
    images: v.array(v.string()),
    tags: v.array(v.string()),
  }).index("by_designer", ["designerId"]),

  // Job Postings (Created by Clients)
  jobs: defineTable({
    clientId: v.id("profiles"),
    title: v.string(),
    description: v.string(),
    budgetRange: v.string(),
    status: v.union(v.literal("open"), v.literal("in-progress"), v.literal("completed")),
    category: v.string(),
  }).index("by_status", ["status"]),

  // Bids/Proposals (Designers applying to Jobs)
  proposals: defineTable({
    jobId: v.id("jobs"),
    designerId: v.id("profiles"),
    amount: v.number(),
    coverLetter: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
  })
  .index("by_job", ["jobId"])
  .index("by_designer", ["designerId"]),

  // Active Contracts (The actual engagement)
  contracts: defineTable({
    jobId: v.id("jobs"),
    proposalId: v.id("proposals"),
    clientId: v.id("profiles"),
    designerId: v.id("profiles"),
    status: v.union(
      v.literal("active"),
      v.literal("disputed"),
      v.literal("finished"),
    ),
    totalPrice: v.number(),
  }).index("by_client", ["clientId"]).index("by_designer", ["designerId"]),
});
