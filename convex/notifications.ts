import { query, mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

type NotificationType =
  | "proposal_received"
  | "proposal_accepted"
  | "proposal_rejected"
  | "contract_started"
  | "contract_completed"
  | "contract_disputed"
  | "review_received";

interface CreateNotificationArgs {
  recipientId: Id<"profiles">;
  type: NotificationType;
  title: string;
  body: string;
  jobId?: Id<"jobs">;
  contractId?: Id<"contracts">;
  link?: string;
}

/**
 * Shared helper, called from other mutations whenever a platform event occurs.
 * Inserts an in-app notification for the given recipient profile.
 */
export async function createNotification(
  ctx: MutationCtx,
  args: CreateNotificationArgs
): Promise<void> {
  await ctx.db.insert("notifications", {
    recipientId: args.recipientId,
    type: args.type,
    title: args.title,
    body: args.body,
    jobId: args.jobId,
    contractId: args.contractId,
    link: args.link,
    isRead: false,
    createdAt: Date.now(),
  });
}

/**
 * List the current user's notifications, newest first.
 * Returns an empty array if the user has no profile yet.
 */
export const listForCurrentUser = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    const currentProfile = profile[0];
    if (!currentProfile) return [];

    return await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", currentProfile._id))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

/**
 * Count unread notifications for the current user.
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

    const currentProfile = profile[0];
    if (!currentProfile) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_read", (q) =>
        q.eq("recipientId", currentProfile._id).eq("isRead", false)
      )
      .collect();

    return unread.length;
  },
});

/**
 * Mark a single notification as read.
 */
export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);
    const currentProfile = profile[0];
    if (!currentProfile) return;

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.recipientId !== currentProfile._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

/**
 * Mark all of the current user's notifications as read.
 */
export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);
    const currentProfile = profile[0];
    if (!currentProfile) return;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_read", (q) =>
        q.eq("recipientId", currentProfile._id).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unread.map((n) => ctx.db.patch(n._id, { isRead: true }))
    );
  },
});
