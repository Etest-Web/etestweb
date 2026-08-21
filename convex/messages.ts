import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Send a message in a contract conversation
 */
export const sendMessage = mutation({
  args: {
    contractId: v.id("contracts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const contract = await ctx.db.get(args.contractId);
    if (!contract) throw new Error("Contract not found");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");

    // Verify user is part of the contract
    if (profile[0]._id !== contract.clientId && profile[0]._id !== contract.designerId) {
      throw new Error("Unauthorized to send messages in this contract");
    }

    const messageId = await ctx.db.insert("messages", {
      contractId: args.contractId,
      senderId: profile[0]._id,
      content: args.content,
      createdAt: Date.now(),
      isRead: false,
    });

    return messageId;
  },
});

/**
 * Get all messages for a contract
 */
export const getContractMessages = query({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const contract = await ctx.db.get(args.contractId);
    if (!contract) throw new Error("Contract not found");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");

    // Verify user is part of the contract
    if (profile[0]._id !== contract.clientId && profile[0]._id !== contract.designerId) {
      throw new Error("Unauthorized to view these messages");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_contract", (q) => q.eq("contractId", args.contractId))
      .order("desc")
      .take(50);

    // Enrich with sender info
    const messagesWithSender = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          senderName: sender?.name ?? "Anonymous",
          senderRole: sender?.role ?? "unknown",
        };
      })
    );

    return messagesWithSender.reverse(); // Return in chronological order
  },
});

/**
 * Mark messages as read
 */
export const markMessagesAsRead = mutation({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const contract = await ctx.db.get(args.contractId);
    if (!contract) throw new Error("Contract not found");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) throw new Error("Profile not found");

    // Get unread messages from the other party
    const otherPartyId = profile[0]._id === contract.clientId 
      ? contract.designerId 
      : contract.clientId;

    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_contract", (q) => q.eq("contractId", args.contractId))
      .filter((q) => q.and(
        q.eq(q.field("senderId"), otherPartyId),
        q.eq(q.field("isRead"), false)
      ))
      .collect();

    // Mark all as read
    for (const msg of unreadMessages) {
      await ctx.db.patch(msg._id, { isRead: true });
    }
  },
});

/**
 * Get unread message count for user
 */
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return 0;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) return 0;

    // Get all contracts for this user
    const [clientContracts, designerContracts] = await Promise.all([
      ctx.db
        .query("contracts")
        .withIndex("by_client", (q) => q.eq("clientId", profile[0]._id))
        .collect(),
      ctx.db
        .query("contracts")
        .withIndex("by_designer", (q) => q.eq("designerId", profile[0]._id))
        .collect(),
    ]);

    const allContracts = [...clientContracts, ...designerContracts];

    let unreadCount = 0;

    for (const contract of allContracts) {
      const unread = await ctx.db
        .query("messages")
        .withIndex("by_contract", (q) => q.eq("contractId", contract._id))
        .filter((q) => q.and(
          q.neq(q.field("senderId"), profile[0]._id),
          q.eq(q.field("isRead"), false)
        ))
        .collect();

      unreadCount += unread.length;
    }

    return unreadCount;
  },
});
