import { useMemo } from "react";
import { useLiveRows } from "@/lib/useLiveRows";
import type { ModuleDef } from "@/lib/modules";
import { Loader2, Database, Inbox } from "lucide-react";

function titleFromPath(path: string) {
  const last = path.split("/").pop() ?? "Module";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function resolveModule(registry: Record<string, ModuleDef>, path: string): ModuleDef {
  return (
    registry[path] ?? {
      title: titleFromPath(path),
      description: "This module is part of the StartSafe roadmap.",
      table: null,
      pendingNote: "No data source is wired to this path yet.",
    }
  );
}

function formatCell(value: unknown, type?: string) {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "date") return new Date(String(value)).toLocaleDateString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function ModulePage({ def }: { def: ModuleDef }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{def.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{def.description}</p>
      </div>
      {def.table ? <ModuleData def={def} /> : <PendingPanel note={def.pendingNote} />}
    </div>
  );
}

function PendingPanel({ note }: { note?: string }) {
  return (
    <div className="glass-card rounded-xl p-8 text-center">
      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center mx-auto">
        <Database className="h-5 w-5" />
      </div>
      <div className="mt-4 font-semibold">Data source not connected yet</div>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{note}</p>
    </div>
  );
}

function ModuleData({ def }: { def: ModuleDef }) {
  const { rows, loading, error } = useLiveRows<Record<string, unknown>>({
    table: def.table as string,
    scope: def.scope ?? "all",
    ownerColumn: def.ownerColumn ?? "user_id",
  });

  const totals = useMemo(
    () =>
      (def.sum ?? []).map((s) => {
        const raw = rows.reduce((a, r) => a + (Number(r[s.key]) || 0), 0);
        return { label: s.label, value: Math.round(s.divideBy ? raw / s.divideBy : raw) };
      }),
    [rows, def.sum],
  );

  const columns = def.columns ?? [];

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-12 grid place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Records</div>
          <div className="text-2xl font-bold tabular-nums mt-1">{rows.length}</div>
        </div>
        {totals.map((t) => (
          <div key={t.label} className="glass-card rounded-xl p-4">
            <div className="text-xs text-muted-foreground">{t.label}</div>
            <div className="text-2xl font-bold tabular-nums mt-1">{t.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="h-6 w-6 mx-auto text-muted-foreground" />
            <div className="mt-3 font-medium">Nothing here yet</div>
            <p className="text-sm text-muted-foreground mt-1">
              This view starts at zero and fills in the moment records are created.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  {columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-medium whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={String(r.id ?? i)} className="border-b border-border/40 last:border-0 hover:bg-muted/40">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                        {formatCell(r[c.key], c.type)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
