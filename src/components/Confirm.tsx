import { useState, type ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmProps {
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  /** Require typing DELETE before enabling the confirm button. */
  requireTyping?: boolean;
  trigger: (open: () => void) => ReactNode;
  onConfirm: () => Promise<void> | void;
}

/** Confirmation modal used before every archive / delete action. */
export function Confirm({ title, body, confirmLabel = "Confirm", requireTyping, trigger, onConfirm }: ConfirmProps) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);

  const blocked = requireTyping && typed.trim().toUpperCase() !== "DELETE";

  return (
    <>
      {trigger(() => { setTyped(""); setOpen(true); })}
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-destructive/15 text-destructive grid place-items-center shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold">{title}</h3>
                <div className="text-sm text-muted-foreground mt-1 space-y-1">{body}</div>
              </div>
            </div>

            {requireTyping && (
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="mt-4 w-full h-9 px-3 rounded-lg bg-input border border-border text-sm focus:border-primary focus:outline-none"
              />
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="h-9 px-4 rounded-lg text-sm border border-border hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                disabled={busy || blocked}
                onClick={async () => {
                  setBusy(true);
                  try { await onConfirm(); } finally { setBusy(false); setOpen(false); }
                }}
                className="h-9 px-4 rounded-lg text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
