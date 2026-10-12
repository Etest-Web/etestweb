"use client";

import * as React from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-lg duration-200">
            <div className="mb-4 flex items-start gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                  pending.destructive
                    ? "bg-destructive/15"
                    : "bg-primary/15"
                )}
              >
                <Warning
                  className={cn(
                    "h-5 w-5",
                    pending.destructive ? "text-destructive" : "text-primary"
                  )}
                />
              </div>
              <div>
                <h3 id="confirm-title" className="text-lg font-bold">
                  {pending.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {pending.message}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => close(false)}
              >
                {pending.cancelLabel ?? "Cancel"}
              </Button>
              <Button
                ref={confirmButtonRef}
                type="button"
                variant={pending.destructive ? "destructive" : "default"}
                onClick={() => close(true)}
              >
                {pending.confirmLabel ?? "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
