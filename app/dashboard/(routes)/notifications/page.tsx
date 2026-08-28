"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CircleX,
  ClipboardCheck,
  FileText,
  HandCoins,
  Star,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

type Notification = Doc<"notifications">;

const typeIcon = (type: Notification["type"]) => {
  switch (type) {
    case "proposal_received":
      return { icon: FileText, tint: "bg-blue-500/20 text-blue-400" };
    case "proposal_accepted":
      return { icon: UserCheck, tint: "bg-green-500/20 text-green-400" };
    case "proposal_rejected":
      return { icon: CircleX, tint: "bg-red-500/20 text-red-400" };
    case "contract_started":
      return { icon: FileText, tint: "bg-primary/20 text-primary" };
    case "contract_completed":
      return { icon: ClipboardCheck, tint: "bg-green-500/20 text-green-400" };
    case "contract_disputed":
      return { icon: HandCoins, tint: "bg-red-500/20 text-red-400" };
    case "review_received":
      return { icon: Star, tint: "bg-yellow-500/20 text-yellow-400" };
    default:
      return { icon: Bell, tint: "bg-white/10 text-white/60" };
  }
};

function NotifSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 animate-pulse" aria-hidden>
      <div className="w-11 h-11 rounded-full bg-white/[0.07] flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-white/[0.07]" />
        <div className="h-3 w-64 rounded bg-white/[0.07]" />
      </div>
    </div>
  );
}

const timeAgo = (ts: number) => {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function NotificationsPage() {
  const user = useQuery(api.users.getCurrentUser);
  const allNotifications = useQuery(api.notifications.listForCurrentUser, {});
  const notifCount = useQuery(api.notifications.getUnreadCount);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const toast = useToast();
  const [markingAll, setMarkingAll] = useState(false);

  const unread = allNotifications?.filter((n) => !n.isRead) ?? [];
  const unreadCount = notifCount ?? 0;

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllRead();
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Could not update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleOpen = async (n: Notification) => {
    if (!n.isRead) {
      try {
        await markRead({ notificationId: n._id });
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-white/60">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        <button
          onClick={handleMarkAll}
          disabled={markingAll || unread.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="bg-[#1a1610] border border-white/10 rounded-xl overflow-hidden">
        {allNotifications === undefined ? (
          <div className="divide-y divide-white/5" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <NotifSkeleton key={i} />
            ))}
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="p-12 text-center text-white/60">
            <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
              <Bell className="w-10 h-10 opacity-30" />
            </div>
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm mt-2 text-white/40">
              You will be notified here for proposals, contracts, and reviews
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {allNotifications.map((n) => {
              const { icon: Icon, tint } = typeIcon(n.type);
              const isRead = n.isRead;
              return (
                <Link
                  key={n._id}
                  href={n.link ?? "/dashboard/notifications"}
                  onClick={() => handleOpen(n)}
                  className={`flex items-start gap-4 p-4 transition-colors hover:bg-white/5 ${
                    isRead ? "opacity-70" : ""
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${tint}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white truncate">
                        {n.title}
                        {!isRead && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" />
                        )}
                      </p>
                      <span className="text-xs text-white/40 flex-shrink-0">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-1 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
