import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { usePlatformStats } from "@/lib/useStats";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Code2, Award, BookOpen, Lightbulb, Briefcase, Sparkles, Loader2, Rocket, Brain, Trophy } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Track = Database["public"]["Enums"]["career_track"];
type ProjectType = Database["public"]["Enums"]["project_type"];
type CertType = Database["public"]["Enums"]["cert_type"];

const TRACKS: { key: Track; label: string }[] = [
  { key: "software_engineering", label: "Software Engineering" },
  { key: "artificial_intelligence", label: "Artificial Intelligence" },
  { key: "cyber_security", label: "Cyber Security" },
  { key: "web_development", label: "Web Development" },
  { key: "data_science", label: "Data Science" },
  { key: "cloud_computing", label: "Cloud Computing" },
  { key: "startup", label: "Startup Track" },
  { key: "research", label: "Research Track" },
  { key: "higher_studies", label: "Higher Studies" },
  { key: "core_engineering", label: "Core Engineering" },
];

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Ecosystem · StartSafe" },
      { name: "description", content: "Learning paths, projects, mock tests, certifications, and AI mentor — all in one student ecosystem." },
      { property: "og:title", content: "Student Ecosystem · StartSafe" },
      { property: "og:description", content: "Learn, build, innovate." },
    ],
  }),
  component: StudentDashboard,
});

const NAV = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Learning Paths", href: "#learning" },
  { label: "Mock Tests", href: "#mock" },
  { label: "Projects Hub", href: "#projects" },
  { label: "Certifications", href: "#certs" },
  { label: "AI Mentor", href: "#mentor" },
  { label: "Career Track", href: "#track" },
];

function StudentDashboard() {
  const { user } = useAuth();
  const { stats } = usePlatformStats();
  const [myMockTests, setMyMockTests] = useState(0);
  const [myProjects, setMyProjects] = useState(0);
  const [myCerts, setMyCerts] = useState(0);
  const [myMinutes, setMyMinutes] = useState(0);
  const [myIdeas, setMyIdeas] = useState(0);
  const [track, setTrack] = useState<Track | null>(null);

  const refresh = async () => {
    if (!user) return;
    const uid = user.id;
    const [mt, pr, ce, ls, si, prof] = await Promise.all([
      supabase.from("mock_tests").select("*", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("certificates").select("*", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("learning_sessions").select("minutes").eq("user_id", uid),
      supabase.from("startup_ideas").select("*", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("profiles").select("career_track").eq("id", uid).maybeSingle(),
    ]);
    setMyMockTests(mt.count ?? 0);
    setMyProjects(pr.count ?? 0);
    setMyCerts(ce.count ?? 0);
    setMyMinutes((ls.data ?? []).reduce((a, r) => a + (r.minutes ?? 0), 0));
    setMyIdeas(si.count ?? 0);
    setTrack((prof.data?.career_track as Track) ?? null);
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user?.id]);

  const readiness = Math.min(100, myMockTests * 8 + myProjects * 15 + myCerts * 10 + Math.floor(myMinutes / 30) * 2);

  return (
    <DashboardShell role="student" nav={NAV}>
      <section id="dashboard" className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-muted-foreground mt-1">Everything you do updates the entire ecosystem in real time.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Mock Tests" value={myMockTests} icon={Activity} />
          <StatCard label="Projects" value={myProjects} icon={Code2} />
          <StatCard label="Certificates" value={myCerts} icon={Award} />
          <StatCard label="Learning Hours" value={Math.round(myMinutes / 60)} icon={BookOpen} />
        </div>

        {/* Readiness */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary font-semibold">Placement Readiness</div>
              <div className="text-2xl font-bold mt-1">{readiness}%</div>
            </div>
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full btn-hero transition-all duration-700" style={{ width: `${readiness}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-3">Complete mock tests, build projects and earn certificates to raise your score.</p>
        </div>
      </section>

      {/* Career Track */}
      <section id="track" className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Career Track</h2>
        <div className="glass-card rounded-2xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {TRACKS.map((t) => (
              <button key={t.key}
                onClick={async () => {
                  await supabase.from("profiles").update({ career_track: t.key }).eq("id", user!.id);
                  setTrack(t.key);
                }}
                className={`text-sm px-3 py-2.5 rounded-lg border transition text-left ${track === t.key ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Actions */}
      <section id="mock" className="mt-8 grid md:grid-cols-2 gap-5">
        <ActionCard
          icon={Activity} title="Take a Mock Test"
          desc="Simulate a real placement round. Score is stored & analytics update instantly."
          onSubmit={async (fd) => {
            await supabase.from("mock_tests").insert({
              user_id: user!.id,
              topic: String(fd.get("topic") || "General Aptitude"),
              score: Number(fd.get("score") || 0),
              total: 100,
            });
            refresh();
          }}
          fields={[
            { name: "topic", label: "Topic", placeholder: "e.g. DSA, SQL, Aptitude" },
            { name: "score", label: "Score", type: "number", placeholder: "0-100" },
          ]}
          submitLabel="Submit test"
        />

        <ActionCard
          icon={BookOpen} title="Log a Learning Session"
          desc="Track your study time — feeds ecosystem-wide learning hours."
          onSubmit={async (fd) => {
            await supabase.from("learning_sessions").insert({
              user_id: user!.id,
              topic: String(fd.get("topic") || "Self-study"),
              minutes: Number(fd.get("minutes") || 0),
            });
            refresh();
          }}
          fields={[
            { name: "topic", label: "What did you learn?", placeholder: "e.g. React, Kubernetes" },
            { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 45" },
          ]}
          submitLabel="Log session"
        />

        <ActionCard
          id="projects" icon={Code2} title="Submit a Project"
          desc="Certificates auto-unlock as you build."
          onSubmit={async (fd) => {
            await supabase.from("projects").insert({
              user_id: user!.id,
              title: String(fd.get("title") || "Untitled"),
              description: String(fd.get("desc") || ""),
              project_type: (String(fd.get("type") || "mini")) as ProjectType,
              github_url: String(fd.get("github") || "") || null,
            });
            // Auto-issue a project certificate
            await supabase.from("certificates").insert({
              user_id: user!.id,
              title: `Project: ${fd.get("title")}`,
              cert_type: "project" as CertType,
            });
            refresh();
          }}
          fields={[
            { name: "title", label: "Project title", placeholder: "e.g. AI Resume Analyzer" },
            { name: "desc", label: "Short description" },
            { name: "type", label: "Type", type: "select", options: ["mini","major","startup","industry","research","hackathon","open_source","prototype"] },
            { name: "github", label: "GitHub URL (optional)" },
          ]}
          submitLabel="Submit project"
        />

        <ActionCard
          icon={Lightbulb} title="Pitch a Startup Idea"
          desc="Innovation Hub — visible across the ecosystem."
          onSubmit={async (fd) => {
            await supabase.from("startup_ideas").insert({
              user_id: user!.id,
              title: String(fd.get("title") || ""),
              pitch: String(fd.get("pitch") || ""),
            });
            refresh();
          }}
          fields={[
            { name: "title", label: "Idea title" },
            { name: "pitch", label: "Elevator pitch" },
          ]}
          submitLabel="Submit idea"
        />

        <ActionCard
          icon={Briefcase} title="Report a Placement / Internship"
          desc="Congratulations! Update the ecosystem."
          onSubmit={async (fd) => {
            const kind = String(fd.get("kind"));
            if (kind === "placement") {
              await supabase.from("placements").insert({
                user_id: user!.id,
                company_name: String(fd.get("company")),
                role: String(fd.get("role")),
                package_lpa: Number(fd.get("package") || 0) || null,
              });
            } else {
              await supabase.from("internships").insert({
                user_id: user!.id,
                company_name: String(fd.get("company")),
                role: String(fd.get("role")),
                duration_months: Number(fd.get("package") || 0) || null,
              });
            }
            refresh();
          }}
          fields={[
            { name: "kind", label: "Type", type: "select", options: ["placement","internship"] },
            { name: "company", label: "Company" },
            { name: "role", label: "Role" },
            { name: "package", label: "Package (LPA) / Duration (months)", type: "number" },
          ]}
          submitLabel="Submit"
        />

        <MentorCard readiness={readiness} projects={myProjects} certs={myCerts} track={track} ideas={myIdeas} />
      </section>

      {/* Ecosystem live */}
      <section className="mt-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-xl font-semibold">Ecosystem Live</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={stats.students} icon={Rocket} />
          <StatCard label="Total Projects" value={stats.projects} icon={Code2} />
          <StatCard label="Certificates" value={stats.certificates} icon={Award} />
          <StatCard label="Placements" value={stats.placements} icon={Briefcase} />
        </div>
      </section>
    </DashboardShell>
  );
}

function ActionCard({ id, icon: Icon, title, desc, fields, onSubmit, submitLabel }: {
  id?: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string;
  fields: { name: string; label: string; placeholder?: string; type?: string; options?: string[] }[];
  onSubmit: (fd: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  return (
    <form id={id} className="glass-card rounded-2xl p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try { await onSubmit(new FormData(e.currentTarget)); (e.target as HTMLFormElement).reset(); setOk(true); setTimeout(() => setOk(false), 1500); }
        finally { setBusy(false); }
      }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary grid place-items-center"><Icon className="h-4 w-4" /></div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <div className="space-y-2.5">
        {fields.map((f) => f.type === "select" ? (
          <select key={f.name} name={f.name} className="w-full h-10 px-3 rounded-lg bg-input border border-border text-sm">
            {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input key={f.name} name={f.name} type={f.type ?? "text"} placeholder={f.placeholder ?? f.label} required
            className="w-full h-10 px-3 rounded-lg bg-input border border-border text-sm focus:border-primary focus:outline-none" />
        ))}
      </div>
      <button disabled={busy} className="mt-3 w-full h-10 rounded-lg btn-hero inline-flex items-center justify-center gap-2 text-sm disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {ok ? "✓ Recorded" : submitLabel}
      </button>
    </form>
  );
}

function MentorCard({ readiness, projects, certs, track, ideas }: { readiness: number; projects: number; certs: number; track: Track | null; ideas: number }) {
  const tips: string[] = [];
  if (!track) tips.push("Pick a career track — recommendations will personalize.");
  if (projects < 3) tips.push("Build 2–3 mini projects this month to accelerate placement readiness.");
  if (certs < 2) tips.push("Earn foundational certificates in your track.");
  if (readiness < 40) tips.push("Complete 5+ mock tests weekly to strengthen aptitude & DSA.");
  if (readiness >= 70) tips.push("You're placement-ready — start applying to hiring companies.");
  if (ideas === 0 && track === "startup") tips.push("Log at least one startup idea to unlock the Innovation Hub.");
  if (tips.length === 0) tips.push("You're on a great trajectory. Keep the streak going.");
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-lg bg-accent/15 text-accent grid place-items-center"><Brain className="h-4 w-4" /></div>
        <div>
          <div className="font-semibold">AI Mentor</div>
          <div className="text-xs text-muted-foreground">Personalized recommendations from your activity.</div>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {tips.map((t, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
