import { Link, useRouter, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/useAuth";
import type { NavGroup } from "@/lib/nav";
import { Sparkles, LogOut, GraduationCap, Shield, Brain, Menu, X, Loader2 } from "lucide-react";

const ICONS: Record<AppRole, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap,
  college: Shield,
  central: Brain,
};
const LABELS: Record<AppRole, string> = {
  student: "Student Portal",
  college: "College Command Center",
  central: "Central Intelligence",
};
const HOME: Record<AppRole, string> = {
  student: "/student",
  college: "/college",
  central: "/central",
};

export function PortalLayout({ role, nav }: { role: AppRole; nav: NavGroup[] }) {
  const router = useRouter();
  const { session, role: userRole, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.navigate({ to: "/auth" });
      return;
    }
    if (userRole && userRole !== role) {
      router.navigate({ to: HOME[userRole] });
    }
  }, [loading, session, userRole, role, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  const Icon = ICONS[role];

  if (loading || !session) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-72 shrink-0 flex flex-col border-r border-border/60 bg-card/80 lg:bg-card/40 backdrop-blur transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Link to="/" className="h-16 flex items-center gap-2.5 px-6 border-b border-border/60 shrink-0">
          <div className="h-8 w-8 rounded-lg btn-hero grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="font-bold">StartSafe</div>
        </Link>

        <div className="flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border/60">
          <Icon className="h-3.5 w-3.5" /> {LABELS[role]}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {nav.map((g) => (
            <div key={g.group}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {g.group}
              </div>
              <div className="space-y-0.5">
                {g.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to as "/"}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === HOME[role] }}
                    activeProps={{ className: "bg-primary/10 text-primary border-primary/30" }}
                    inactiveProps={{ className: "text-muted-foreground border-transparent hover:bg-muted hover:text-foreground" }}
                    className="block px-3 py-2 rounded-lg text-sm border transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border/60 shrink-0">
          <button
            onClick={signOut}
            className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border/60 backdrop-blur bg-background/70 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold truncate">{LABELS[role]}</span>
              <span className="text-muted-foreground hidden sm:inline truncate">· {session.user.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live
          </div>
        </header>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
