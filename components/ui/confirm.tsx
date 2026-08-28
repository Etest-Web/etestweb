"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

const ConfirmContext =
  React.createContext<
    ((options: ConfirmOptions) => Promise<boolean>) | null
  >(null);

export function useConfirm() {
  const confirm = React.useContext(ConfirmContext);
  if (!confirm)
    throw new Error("useConfirm must be used within <ConfirmProvider>");
  return confirm;
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = React.useState<PendingConfirm | null>(null);
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null);

  const close = React.useCallback((result: boolean) => {
    setPending((current) => {
      current?.resolve(result);
      return null;
    });
  }, []);

  const confirm = React.useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    []
  );

  React.useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    confirmButtonRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => close(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#1a1610] p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-start gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                  pending.destructive
                    ? "bg-red-500/15"
                    : "bg-primary/15"
                )}
              >
                <AlertTriangle
                  className={cn(
                    "h-5 w-5",
                    pending.destructive ? "text-red-400" : "text-primary"
                  )}
                />
              </div>
              <div>
                <h3
                  id="confirm-title"
                  className="text-lg font-bold text-white"
                >
                  {pending.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {pending.message}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => close(false)}
                className="h-10 rounded-lg border border-white/10 px-5 font-medium text-white transition-colors hover:bg-white/5"
              >
                {pending.cancelLabel ?? "Cancel"}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => close(true)}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-lg px-5 font-bold transition-colors",
                  pending.destructive
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-primary text-black hover:bg-primary/90"
                )}
              >
                {pending.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
