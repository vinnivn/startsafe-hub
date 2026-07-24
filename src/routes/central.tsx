import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { usePlatformStats } from "@/lib/useStats";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Code2, Award, Briefcase, Lightbulb, Rocket, Brain, TrendingUp, Loader2, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/central")({
  head: () => ({
    meta: [
      { title: "Central Intelligence · StartSafe" },
      { name: "description", content: "The brain of StartSafe — ecosystem-wide analytics, insights, and deployments." },
      { property: "og:title", content: "Central Intelligence · StartSafe" },
      { property: "og:description", content: "Analyze, connect, and scale the ecosystem." },
    ],
  }),
  component: Central,
});

const NAV = [
  { label: "Overview", href: "#o" },
  { label: "Students", href: "#o" },
  { label: "Colleges", href: "#colleges" },
  { label: "Companies", href: "#companies" },
  { label: "Deployments", href: "#deploy" },
  { label: "AI Insights", href: "#ai" },
  { label: "Recommendations", href: "#recs" },
];

function Central() {
  const { stats } = usePlatformStats();
  const [colleges, setColleges] = useState<{ id: string; name: string; location: string | null }[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string; industry: string | null }[]>([]);
  const [pilots, setPilots] = useState<{ id: string; name: string; status: string }[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const [c, co, pd] = await Promise.all([
      supabase.from("colleges").select("id, name, location").order("created_at", { ascending: false }),
      supabase.from("companies").select("id, name, industry").order("created_at", { ascending: false }),
      supabase.from("pilot_deployments").select("id, name, status").order("created_at", { ascending: false }),
    ]);
    setColleges(c.data ?? []);
    setCompanies(co.data ?? []);
    setPilots(pd.data ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("central");
    ["colleges","companies","pilot_deployments"].forEach(t =>
      ch.on("postgres_changes", { event: "*", schema: "public", table: t }, () => load()));
    ch.subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const insights = [
    stats.students > 0 && `${stats.students} students onboarded across ${stats.colleges} colleges.`,
    stats.projects >= 10 && `${stats.projects} projects submitted — strong innovation signal.`,
    stats.startupIdeas > 0 && `${stats.startupIdeas} startup ideas surfaced — schedule incubation review.`,
    stats.placements > 0 && `${stats.placements} placements completed — success stories ready.`,
    stats.colleges > 0 && stats.pilotDeployments === 0 && `Consider launching pilot deployments — ${stats.colleges} colleges are active.`,
  ].filter(Boolean) as string[];

  return (
    <DashboardShell role="central" nav={NAV}>
      <section id="o">
        <h1 className="text-2xl md:text-3xl font-bold">Central Intelligence</h1>
        <p className="text-muted-foreground mt-1">The brain of StartSafe — every activity, everywhere, in real time.</p>
      </section>

      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Students" value={stats.students} icon={Users} />
        <StatCard label="Colleges" value={stats.colleges} icon={Building2} />
        <StatCard label="Projects" value={stats.projects} icon={Code2} />
        <StatCard label="Certificates" value={stats.certificates} icon={Award} />
        <StatCard label="Placements" value={stats.placements} icon={Briefcase} />
        <StatCard label="Startup Ideas" value={stats.startupIdeas} icon={Lightbulb} />
        <StatCard label="Companies" value={stats.companies} icon={Building2} />
        <StatCard label="Pilot Deployments" value={stats.pilotDeployments} icon={Rocket} />
      </section>

      <section id="ai" className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">AI Insights</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {insights.length === 0 ? (
            <div className="glass-card rounded-xl p-4 text-sm text-muted-foreground">
              Insights will appear as the ecosystem gathers activity. Encourage first sign-ups.
            </div>
          ) : insights.map((t, i) => (
            <div key={i} className="glass-card rounded-xl p-4 border-l-4 border-primary/60 flex gap-3">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section id="companies" className="mt-8 grid md:grid-cols-2 gap-5">
        <ManagementList
          title="Companies Hiring"
          items={companies.map(c => ({ id: c.id, primary: c.name, secondary: c.industry ?? "—" }))}
          addLabel="Add company"
          fields={[{ name: "name", label: "Company name" }, { name: "industry", label: "Industry" }]}
          onAdd={async (fd) => {
            setBusy("company");
            await supabase.from("companies").insert({ name: String(fd.get("name")), industry: String(fd.get("industry") || "") || null });
            setBusy(null);
          }}
          busy={busy === "company"}
        />
        <ManagementList
          id="deploy"
          title="Pilot Deployments"
          items={pilots.map(p => ({ id: p.id, primary: p.name, secondary: p.status }))}
          addLabel="Launch pilot"
          fields={[{ name: "name", label: "Deployment name" }, { name: "status", label: "Status (active/paused)" }]}
          onAdd={async (fd) => {
            setBusy("pilot");
            await supabase.from("pilot_deployments").insert({ name: String(fd.get("name")), status: String(fd.get("status") || "active") });
            setBusy(null);
          }}
          busy={busy === "pilot"}
        />
      </section>

      <section id="colleges" className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Colleges in the Ecosystem</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr><th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Location</th></tr>
            </thead>
            <tbody>
              {colleges.length === 0 && <tr><td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">No colleges yet.</td></tr>}
              {colleges.map(c => (
                <tr key={c.id} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.location ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}

function ManagementList({ id, title, items, addLabel, fields, onAdd, busy }: {
  id?: string;
  title: string;
  items: { id: string; primary: string; secondary: string }[];
  addLabel: string;
  fields: { name: string; label: string }[];
  onAdd: (fd: FormData) => Promise<void>;
  busy: boolean;
}) {
  return (
    <div id={id} className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">{items.length}</span>
      </div>
      <form onSubmit={async (e) => { e.preventDefault(); await onAdd(new FormData(e.currentTarget)); (e.target as HTMLFormElement).reset(); }}
        className="flex flex-wrap gap-2 mb-3">
        {fields.map(f => (
          <input key={f.name} name={f.name} placeholder={f.label} required
            className="flex-1 min-w-[120px] h-9 px-3 rounded-lg bg-input border border-border text-sm focus:border-primary focus:outline-none" />
        ))}
        <button disabled={busy} className="h-9 px-3 rounded-lg btn-hero inline-flex items-center gap-1.5 text-sm disabled:opacity-60">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlusCircle className="h-3.5 w-3.5" />}
          {addLabel}
        </button>
      </form>
      <ul className="space-y-1.5 max-h-64 overflow-auto">
        {items.length === 0 && <li className="text-sm text-muted-foreground py-4 text-center">Nothing yet.</li>}
        {items.map(it => (
          <li key={it.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40">
            <span className="text-sm font-medium">{it.primary}</span>
            <span className="text-xs text-muted-foreground">{it.secondary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
