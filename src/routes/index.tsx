import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { usePlatformStats } from "@/lib/useStats";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Building2, GraduationCap, Rocket, Award, Briefcase,
  Sparkles, Lightbulb, Building, Activity, BookOpen, ArrowRight,
  Brain, Shield, Code2, LogOut, LayoutDashboard,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StartSafe — Learn • Build • Innovate" },
      { name: "description", content: "STARTSAFE is a unified career transformation ecosystem for students, colleges, and industries — one real-time platform for learning, projects, placements, and innovation." },
      { property: "og:title", content: "StartSafe — Learn • Build • Innovate" },
      { property: "og:description", content: "One real-time ecosystem for students, colleges, and industries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Stat({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent?: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl grid place-items-center ${accent ?? "bg-primary/15 text-primary"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-3xl font-bold tabular-nums text-gradient">{value.toLocaleString()}</div>
      </div>
      <div className="mt-4 text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function Landing() {
  const { stats } = usePlatformStats();
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const goDashboard = () => {
    if (role === "college") router.navigate({ to: "/college" });
    else if (role === "central") router.navigate({ to: "/central" });
    else router.navigate({ to: "/student" });
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-lg bg-background/70 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg btn-hero grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="font-bold text-lg tracking-tight">StartSafe</div>
          </Link>
          <div className="flex items-center gap-2">
            {loading ? null : user ? (
              <>
                <button onClick={goDashboard} className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-card border border-border hover:bg-muted transition">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
                <button
                  onClick={async () => { await supabase.auth.signOut(); }}
                  className="inline-flex items-center gap-2 px-3 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link to="/auth" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg btn-hero">
                Login <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> One unified real-time ecosystem
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient">Learn. Build.</span><br />
            <span className="text-foreground">Innovate.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            A career transformation ecosystem connecting students, colleges, and industries through one intelligent real-time platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/auth" className="inline-flex items-center gap-2 h-12 px-7 rounded-xl btn-hero">
              Choose your ecosystem <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#stats" className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border hover:bg-card transition">
              Live analytics
            </a>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section id="stats" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Real-time ecosystem</div>
            <h2 className="text-3xl md:text-4xl font-bold">Everything starts from zero.</h2>
            <p className="text-muted-foreground mt-2">Every number updates live as the ecosystem grows.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Stat icon={Users} label="Total Students" value={stats.students} />
          <Stat icon={Building2} label="Total Colleges" value={stats.colleges} accent="bg-secondary/15 text-secondary" />
          <Stat icon={BookOpen} label="Learning Hours" value={stats.learningHours} accent="bg-accent/15 text-accent" />
          <Stat icon={Code2} label="Projects Completed" value={stats.projects} />
          <Stat icon={Briefcase} label="Placements" value={stats.placements} accent="bg-secondary/15 text-secondary" />
          <Stat icon={GraduationCap} label="Internships" value={stats.internships} accent="bg-accent/15 text-accent" />
          <Stat icon={Award} label="Certificates Generated" value={stats.certificates} />
          <Stat icon={Lightbulb} label="Startup Ideas" value={stats.startupIdeas} accent="bg-secondary/15 text-secondary" />
          <Stat icon={Building} label="Companies Hiring" value={stats.companies} accent="bg-accent/15 text-accent" />
          <Stat icon={Rocket} label="Pilot Deployments" value={stats.pilotDeployments} />
          <Stat icon={Activity} label="Mock Tests" value={stats.mockTests} accent="bg-secondary/15 text-secondary" />
          <Stat icon={Sparkles} label="Innovation Index" value={stats.projects + stats.startupIdeas} accent="bg-accent/15 text-accent" />
        </div>
      </section>

      {/* Choose ecosystem */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Three intelligent interfaces</div>
          <h2 className="text-3xl md:text-4xl font-bold">Choose your ecosystem</h2>
          <p className="text-muted-foreground mt-2">One database. Three views. Infinite intelligence.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: GraduationCap, title: "Student Ecosystem", desc: "Learning paths, projects, mock tests, AI mentor, placement readiness.", accent: "text-primary bg-primary/10 border-primary/30" },
            { icon: Shield, title: "College Command Center", desc: "Student analytics, coding & placement dashboards, AI insights, alerts.", accent: "text-secondary bg-secondary/10 border-secondary/30" },
            { icon: Brain, title: "Central Intelligence", desc: "Ecosystem-wide analytics, deployments, recommendations engine, insights.", accent: "text-accent bg-accent/10 border-accent/30" },
          ].map((c, i) => (
            <Link key={i} to="/auth" className="glass-card rounded-2xl p-7 group hover:border-primary/50 transition-all">
              <div className={`h-12 w-12 rounded-xl grid place-items-center border ${c.accent} mb-5`}>
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition">
                Enter <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} StartSafe · Learn • Build • Innovate
      </footer>
    </div>
  );
}
