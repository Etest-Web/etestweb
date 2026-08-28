"use client";

import * as React from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

type ToastInput = Omit<ToastItem, "id">;

interface ToastContextValue {
  toast: (input: ToastInput) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ElementType; iconClass: string }
> = {
  success: { icon: CheckCircle2, iconClass: "text-green-400" },
  error: { icon: XCircle, iconClass: "text-red-400" },
  info: { icon: Info, iconClass: "text-primary" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = ++toastSeq;
      setToasts((prev) => [...prev.slice(-3), { ...input, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (title, description) =>
        toast({ variant: "success", title, description }),
      error: (title, description) =>
        toast({ variant: "error", title, description }),
      info: (title, description) =>
        toast({ variant: "info", title, description }),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3"
      >
        {toasts.map((t) => {
          const { icon: Icon, iconClass } = VARIANT_CONFIG[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-[#1a1610] p-4 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", iconClass)} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{t.title}</p>
                {t.description && (
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

let toastSeq = 0;
