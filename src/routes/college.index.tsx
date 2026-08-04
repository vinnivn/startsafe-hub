import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/DashboardShell";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Users, Code2, Award, Briefcase, Activity, BookOpen, AlertTriangle, TrendingUp, Building2 } from "lucide-react";

export const Route = createFileRoute("/college/")({
  head: () => ({
    meta: [
      { title: "College Command Center · StartSafe" },
      { name: "description", content: "Real-time analytics on your students' learning, coding, placements, and innovation." },
      { property: "og:title", content: "College Command Center · StartSafe" },
      { property: "og:description", content: "Monitor and grow your student ecosystem." },
    ],
  }),
  component: CollegeDashboard,
});

interface Row { id: string; full_name: string; email: string; }

function CollegeDashboard() {
  const { user } = useAuth();
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string>("Your College");
  const [students, setStudents] = useState<Row[]>([]);
  const [counts, setCounts] = useState({ projects: 0, mocks: 0, certs: 0, placements: 0, hours: 0, ideas: 0 });

  const load = async () => {
    if (!user) return;
    const { data: role } = await supabase.from("user_roles").select("college_id").eq("user_id", user.id).maybeSingle();
    const cid = role?.college_id;
    if (!cid) return;
    setCollegeId(cid);
    const { data: c } = await supabase.from("colleges").select("name").eq("id", cid).maybeSingle();
    if (c) setCollegeName(c.name);
    const { data: profs } = await supabase.from("profiles").select("id, full_name, email").eq("college_id", cid);
    const rows = profs ?? [];
    setStudents(rows);
    const ids = rows.map(r => r.id);
    if (ids.length === 0) { setCounts({ projects: 0, mocks: 0, certs: 0, placements: 0, hours: 0, ideas: 0 }); return; }
    const [pr, mt, ce, pl, ls, si] = await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }).in("user_id", ids),
      supabase.from("mock_tests").select("*", { count: "exact", head: true }).in("user_id", ids),
      supabase.from("certificates").select("*", { count: "exact", head: true }).in("user_id", ids),
      supabase.from("placements").select("*", { count: "exact", head: true }).in("user_id", ids),
      supabase.from("learning_sessions").select("minutes").in("user_id", ids),
      supabase.from("startup_ideas").select("*", { count: "exact", head: true }).in("user_id", ids),
    ]);
    setCounts({
      projects: pr.count ?? 0,
      mocks: mt.count ?? 0,
      certs: ce.count ?? 0,
      placements: pl.count ?? 0,
      hours: Math.round(((ls.data ?? []).reduce((a, r) => a + (r.minutes ?? 0), 0)) / 60),
      ideas: si.count ?? 0,
    });
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user?.id]);

  useEffect(() => {
    if (!collegeId) return;
    const ch = supabase.channel(`college-${collegeId}`);
    ["projects","mock_tests","certificates","placements","learning_sessions","startup_ideas","profiles"].forEach(t =>
      ch.on("postgres_changes", { event: "*", schema: "public", table: t }, () => load()));
    ch.subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [collegeId]); // eslint-disable-line

  const needsIntervention = Math.max(0, students.length - Math.min(students.length, counts.mocks + counts.projects));
  const placementReady = Math.min(students.length, Math.floor((counts.projects + counts.certs) / 2));

  return (
    <>
      <section id="dash">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Building2 className="h-4 w-4" /> {collegeName}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Command Center</h1>
        <p className="text-muted-foreground mt-1">Real-time visibility across every student's journey.</p>
      </section>

      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Students" value={students.length} icon={Users} />
        <StatCard label="Projects Built" value={counts.projects} icon={Code2} />
        <StatCard label="Mock Tests" value={counts.mocks} icon={Activity} />
        <StatCard label="Certificates" value={counts.certs} icon={Award} />
        <StatCard label="Placements" value={counts.placements} icon={Briefcase} />
        <StatCard label="Learning Hours" value={counts.hours} icon={BookOpen} />
        <StatCard label="Startup Ideas" value={counts.ideas} icon={TrendingUp} />
        <StatCard label="Placement Ready" value={placementReady} icon={TrendingUp} hint="est." />
      </section>

      <section id="insights" className="mt-8">
        <h2 className="text-xl font-semibold mb-3">AI Insights</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Insight color="primary" text={`${placementReady} students are placement ready.`} />
          <Insight color="warning" text={`${needsIntervention} students may need intervention.`} icon={AlertTriangle} />
          <Insight color="accent" text={`${counts.ideas} startup ideas registered from your campus.`} />
          <Insight color="secondary" text={`${counts.projects} projects shipped — encourage GitHub linking.`} />
        </div>
      </section>

      <section id="students" className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Student Rankings</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr><th className="text-left px-4 py-3">Student</th><th className="text-left px-4 py-3">Email</th></tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">No students registered yet. Share the platform with your students.</td></tr>
              )}
              {students.map(s => (
                <tr key={s.id} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Insight({ color, text, icon: Icon }: { color: string; text: string; icon?: React.ComponentType<{ className?: string }> }) {
  const cls = color === "warning" ? "border-warning/40 bg-warning/5 text-warning" :
              color === "accent" ? "border-accent/40 bg-accent/5 text-accent" :
              color === "secondary" ? "border-secondary/40 bg-secondary/5 text-secondary" :
              "border-primary/40 bg-primary/5 text-primary";
  return (
    <div className={`glass-card rounded-xl p-4 border-l-4 ${cls} flex items-start gap-3`}>
      {Icon && <Icon className="h-4 w-4 mt-0.5" />}
      <div className="text-sm text-foreground">{text}</div>
    </div>
  );
}
