import { Link } from "@tanstack/react-router";
import { useIntel } from "@/lib/intel";
import { Loading, Empty, Stat, Section, Bar } from "@/components/States";
import { Back } from "@/components/Back";
import { Github, Award, Building2 } from "lucide-react";

/** 360° student view used by both the college and central portals. */
export function StudentProfileView({ studentId, basePath }: { studentId: string; basePath: "/central" | "/college" }) {
  const { students, colleges, projects, certificates, attempts, tests, learning, placements, loading } = useIntel();
  const s = students.find((x) => x.id === studentId);

  if (loading) return <Loading label="Loading student profile" />;
  if (!s) return <Empty title="Student not found" />;

  const college = colleges.find((c) => c.id === s.college_id);
  const myProjects = projects.filter((p) => p.user_id === s.id && !p.is_archived);
  const myCerts = certificates.filter((c: any) => c.user_id === s.id);
  const myAttempts = attempts.filter((a: any) => a.user_id === s.id);
  const mySessions = learning.filter((l: any) => l.user_id === s.id);
  const myPlacements = placements.filter((p: any) => p.user_id === s.id);

  return (
    <div className="space-y-6">
      <Back fallbackTo={`${basePath}/ecosystem/students`} label="Back" />

      <div className="glass-card rounded-2xl p-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{s.full_name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{s.email}</p>
          <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {college && (
              <Link to={`${basePath}/colleges/$collegeId` as "/"} params={{ collegeId: college.id } as never} className="hover:text-primary inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> {college.name}
              </Link>
            )}
            {s.course && <span>{s.course}</span>}
            {s.department && <span>{s.department}</span>}
            {s.semester && <span>Sem {s.semester}</span>}
            {s.section && <span>Sec {s.section}</span>}
            {s.roll_number && <span className="font-mono">{s.roll_number}</span>}
            {s.career_track && <span className="capitalize">{s.career_track.replace(/_/g, " ")}</span>}
            {s.github_username && (
              <a href={`https://github.com/${s.github_username}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                <Github className="h-3.5 w-3.5" /> {s.github_username}
              </a>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold tabular-nums">{s.readiness}%</div>
          <div className="text-xs text-muted-foreground">Placement readiness</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Learning" value={`${Math.round(s.minutes / 60)}h`} sub={`${mySessions.length} sessions`} />
        <Stat label="Best mock test" value={`${s.mockBest}%`} sub={`${s.mockAttempts} attempts`} />
        <Stat label="Projects" value={s.projects} sub={s.projectScoreAvg !== null ? `Avg score ${s.projectScoreAvg}` : "Not reviewed yet"} />
        <Stat label="Certificates" value={s.certificates} sub={myPlacements.length ? `${myPlacements.length} placement(s)` : "No placement yet"} />
      </div>

      <Section title="Readiness breakdown">
        <div className="glass-card rounded-2xl p-5 space-y-4">
          {[["Learning", s.learning], ["Mock tests", s.mockBest], ["Coding accuracy", s.coding], ["Projects", Math.min(100, s.projects * 25)], ["Certifications", Math.min(100, s.certificates * 20)]].map(([l, v]) => (
            <div key={l as string} className="flex items-center gap-4">
              <div className="w-36 text-sm text-muted-foreground shrink-0">{l}</div>
              <div className="flex-1"><Bar value={v as number} /></div>
              <div className="w-12 text-right text-sm tabular-nums">{v as number}%</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={`Projects (${myProjects.length})`}>
        <div className="grid md:grid-cols-2 gap-3">
          {myProjects.length === 0 && <Empty title="No projects yet" />}
          {myProjects.map((p) => (
            <Link key={p.id} to={`${basePath}/projects/$projectId` as "/"} params={{ projectId: p.id } as never} className="glass-card rounded-xl p-4 hover:border-primary/40 transition block">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{p.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{p.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description ?? "No description"}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Mock test history">
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Test</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Score</th>
                <th className="text-right px-4 py-3">Violations</th>
                <th className="text-right px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {myAttempts.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No attempts yet.</td></tr>}
              {myAttempts.map((a: any) => (
                <tr key={a.id} className="border-t border-border/60">
                  <td className="px-4 py-3">{tests.find((t: any) => t.id === a.test_id)?.title ?? "Test"}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{a.status}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{a.score}/{a.total}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{(a.tab_switches ?? 0) + (a.fullscreen_exits ?? 0)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`Certificates (${myCerts.length})`}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myCerts.length === 0 && <Empty title="No certificates issued" />}
          {myCerts.map((c: any) => (
            <div key={c.id} className="glass-card rounded-xl p-4">
              <Award className="h-4 w-4 text-primary" />
              <div className="font-medium text-sm mt-2">{c.title}</div>
              <div className="text-[11px] text-muted-foreground font-mono mt-1">{c.verification_id}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
