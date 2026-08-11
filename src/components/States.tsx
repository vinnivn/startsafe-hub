import { Loader2, Inbox, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="glass-card rounded-xl p-12 grid place-items-center gap-3">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-xs text-muted-foreground">{label}…</span>
    </div>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="glass-card rounded-xl p-12 text-center">
      <Inbox className="h-6 w-6 mx-auto text-muted-foreground" />
      <div className="mt-3 font-medium">{title}</div>
      {hint && <p className="text-sm text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex gap-2">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> {message}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-1">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden min-w-[80px]">
      <div className="h-full btn-hero rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
