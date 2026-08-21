"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import { Send, MessageSquare, ArrowLeft, User, Search, Briefcase } from "lucide-react";

export default function MessagesPage() {
  const user = useQuery(api.users.getCurrentUser);
  const myContracts = useQuery(api.contracts.getMyContracts);
  const unreadCount = useQuery(api.messages.getUnreadCount);
  const [selectedContractId, setSelectedContractId] = useState<Id<"contracts"> | null>(null);

  // Get the selected contract object for passing to ChatView
  const selectedContract = myContracts?.find((c) => c._id === selectedContractId) ?? null;

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 pb-0 md:pb-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-white/60">
          {unreadCount && unreadCount > 0
            ? `You have ${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
            : "Communicate with your clients and designers"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-[#1a1610] border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/30 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {myContracts && myContracts.length > 0 ? (
              <div className="divide-y divide-white/5">
                {myContracts.map((contract) => (
                  <button
                    key={contract._id}
                    onClick={() => setSelectedContractId(contract._id)}
                    className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${
                      selectedContractId === contract._id ? "bg-primary/10 border-l-2 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary">
                            {contract.counterpartyName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#1a1610] ${
                            contract.status === "active"
                              ? "bg-green-500"
                              : contract.status === "disputed"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-semibold truncate">
                            {contract.counterpartyName}
                          </p>
                        </div>
                        <p className="text-sm text-white/60 truncate flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {contract.jobTitle}
                        </p>
                        <p className="text-xs text-white/40 mt-1 capitalize">
                          {contract.counterpartyRole} • {contract.status}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-white/60">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No conversations yet</p>
                <p className="text-sm mt-2">
                  {user.role === "client"
                    ? "Accept a designer's proposal to start chatting"
                    : "Submit a proposal and get hired to start messaging"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-[#1a1610] border border-white/10 rounded-xl overflow-hidden flex flex-col">
          {selectedContract ? (
            <ChatView
              key={selectedContract._id}
              contractId={selectedContract._id}
              counterpartyName={selectedContract.counterpartyName}
              jobTitle={selectedContract.jobTitle}
              onBack={() => setSelectedContractId(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/60">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 opacity-30" />
                </div>
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm mt-2 text-white/40">
                  Choose a contract from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatView({
  contractId,
  counterpartyName,
  jobTitle,
  onBack,
}: {
  contractId: Id<"contracts">;
  counterpartyName: string;
  jobTitle: string;
  onBack: () => void;
}) {
  const user = useQuery(api.users.getCurrentUser);
  const messages = useQuery(api.messages.getContractMessages, { contractId });
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark messages as read when viewing
  useEffect(() => {
    if (contractId) {
      markAsRead({ contractId });
    }
  }, [contractId, messages, markAsRead]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await sendMessage({ contractId, content: newMessage.trim() });
      setNewMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (msgs: Doc<"messages">[]) => {
    const groups: { date: string; messages: Doc<"messages">[] }[] = [];
    let currentDate = "";

    msgs.forEach((msg) => {
      const msgDate = new Date(msg.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const messageGroups = messages ? groupMessagesByDate(messages) : [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <button
          onClick={onBack}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary">
            {counterpartyName?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white">{counterpartyName}</h3>
          <p className="text-sm text-white/60">{jobTitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messageGroups.length > 0 ? (
          messageGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date separator */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/40 px-2">{group.date}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Messages for this date */}
              <div className="space-y-3">
                {group.messages.map((msg) => {
                  const isOwn = msg.senderId === user?._id;
                  const time = new Date(msg.createdAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          isOwn
                            ? "bg-primary text-black rounded-br-md"
                            : "bg-white/10 text-white rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? "text-black/50" : "text-white/50"
                          }`}
                        >
                          {time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-white/60 py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 opacity-30" />
            </div>
            <p className="font-medium">Start the conversation</p>
            <p className="text-sm mt-2 text-white/40">
              Send a message to begin chatting about this project
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="h-12 px-6 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}