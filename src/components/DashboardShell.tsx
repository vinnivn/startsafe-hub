import { Link, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/useAuth";
import { useEffect, type ReactNode } from "react";
import { Sparkles, LogOut, GraduationCap, Shield, Brain } from "lucide-react";

const ICONS: Record<AppRole, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap, college: Shield, central: Brain,
};
const LABELS: Record<AppRole, string> = {
  student: "Student Ecosystem", college: "College Command Center", central: "Central Intelligence",
};

export function DashboardShell({ role, nav, children }: { role: AppRole; nav: { label: string; href: string }[]; children: ReactNode }) {
  const router = useRouter();
  const { session, role: userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!session || (userRole && userRole !== role))) {
      router.navigate({ to: session && userRole ? (userRole === "college" ? "/college" : userRole === "central" ? "/central" : "/student") : "/auth" });
    }
  }, [loading, session, userRole, role, router]);

  const Icon = ICONS[role];

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/60 bg-card/40 backdrop-blur">
        <Link to="/" className="h-16 flex items-center gap-2.5 px-6 border-b border-border/60">
          <div className="h-8 w-8 rounded-lg btn-hero grid place-items-center"><Sparkles className="h-4 w-4" /></div>
          <div className="font-bold">StartSafe</div>
        </Link>
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 px-2 py-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Icon className="h-3.5 w-3.5" /> {LABELS[role]}
          </div>
          <nav className="mt-2 space-y-0.5">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-border/60">
          <button
            onClick={async () => { await supabase.auth.signOut(); router.navigate({ to: "/" }); }}
            className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border/60 backdrop-blur bg-background/70 sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4 text-primary" />
            <span className="font-semibold">{LABELS[role]}</span>
            <span className="text-muted-foreground hidden sm:inline">· {session?.user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); router.navigate({ to: "/" }); }}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint }: { label: string; value: number | string; icon: React.ComponentType<{ className?: string }>; hint?: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div className="mt-4 text-3xl font-bold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
