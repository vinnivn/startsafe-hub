import { Link } from "@tanstack/react-router";
import { useIntel } from "@/lib/intel";
import { Loading, Empty, Stat, Section, Bar } from "@/components/States";
import { Back } from "@/components/Back";

/** Full institution report: readiness, module analytics, students, projects, tests. */
export function CollegeReportView({ collegeId, basePath }: { collegeId: string; basePath: "/central" | "/college" }) {
  const { colleges, projects, attempts, tests, loading } = useIntel();
  const college = colleges.find((c) => c.id === collegeId);

  if (loading) return <Loading label="Building college report" />;
  if (!college) return <Empty title="College not found" hint="It may have been archived." />;

  const ids = new Set(college.students.map((s) => s.id));
  const collegeProjects = projects.filter((p) => ids.has(p.user_id) && !p.is_archived);
  const collegeAttempts = attempts.filter((a) => ids.has(a.user_id));
  const ranked = [...college.students].sort((a, b) => b.readiness - a.readiness);

  return (
    <div className="space-y-6">
      <Back fallbackTo={`${basePath}/ecosystem/colleges`} label="Back to colleges" />

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{college.name}</h1>
            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span className="font-mono text-primary">{college.college_code ?? "—"}</span>
              <span>{college.location ?? "No location"}</span>
              <span className="capitalize">{college.status}</span>
            </div>
            {college.placement_officer_name && (
              <p className="text-xs text-muted-foreground mt-2">
                Placement officer: {college.placement_officer_name}
                {college.placement_officer_email && ` · ${college.placement_officer_email}`}
                {college.placement_officer_phone && ` · ${college.placement_officer_phone}`}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold tabular-nums">{college.readiness}%</div>
            <div className="text-xs text-muted-foreground">Placement readiness</div>
          </div>
        </div>
        <div className="mt-4"><Bar value={college.readiness} /></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Students" value={college.total} sub={`${college.active} active`} />
        <Stat label="Projects" value={collegeProjects.length} sub={`${collegeProjects.filter((p) => p.status === "approved").length} approved`} />
        <Stat label="Test attempts" value={collegeAttempts.length} sub={`${tests.length} tests published`} />
        <Stat label="At risk" value={college.atRisk} sub="Readiness below 40%" />
      </div>

      <Section title="Module analytics">
        <div id="analytics" className="glass-card rounded-2xl p-5 space-y-4">
          {[
            ["Learning", college.learning],
            ["Mock tests", college.mock],
            ["Coding", college.coding],
            ["Projects", college.projectCompletion],
            ["Overall readiness", college.readiness],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-center gap-4">
              <div className="w-36 text-sm text-muted-foreground shrink-0">{label}</div>
              <div className="flex-1"><Bar value={value as number} /></div>
              <div className="w-12 text-right text-sm font-semibold tabular-nums">{value as number}%</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={`Students (${ranked.length})`}>
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Course</th>
                <th className="text-right px-4 py-3">Projects</th>
                <th className="text-right px-4 py-3">Best test</th>
                <th className="text-right px-4 py-3">Readiness</th>
              </tr>
            </thead>
            <tbody>
              {ranked.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No students registered yet.</td></tr>}
              {ranked.map((s, i) => (
                <tr key={s.id} className="border-t border-border/60 hover:bg-muted/30 transition">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link to={`${basePath}/students/$studentId` as "/"} params={{ studentId: s.id } as never} className="font-medium hover:text-primary transition">
                      {s.full_name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{s.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.course ?? "—"}{s.semester ? ` · Sem ${s.semester}` : ""}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{s.projects}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{s.mockBest}%</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{s.readiness}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`Projects (${collegeProjects.length})`}>
        <div id="projects" className="grid md:grid-cols-2 gap-3">
          {collegeProjects.length === 0 && <Empty title="No projects submitted yet" />}
          {collegeProjects.map((p) => (
            <Link
              key={p.id}
              to={`${basePath}/projects/$projectId` as "/"}
              params={{ projectId: p.id } as never}
              className="glass-card rounded-xl p-4 hover:border-primary/40 transition block"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium truncate">{p.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize shrink-0">{p.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description ?? "No description"}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Mock test performance">
        <div id="tests" className="glass-card rounded-2xl p-5">
          {tests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tests published yet.</p>
          ) : (
            <ul className="space-y-2">
              {tests.map((t: any) => {
                const rows = collegeAttempts.filter((a) => a.test_id === t.id && a.status === "submitted");
                const avg = rows.length ? Math.round(rows.reduce((a, r) => a + (r.total ? (r.score / r.total) * 100 : 0), 0) / rows.length) : 0;
                return (
                  <li key={t.id} className="flex items-center gap-4 text-sm">
                    <span className="flex-1 truncate">{t.title}</span>
                    <span className="text-xs text-muted-foreground">{rows.length} attempts</span>
                    <div className="w-32"><Bar value={avg} /></div>
                    <span className="w-12 text-right tabular-nums">{avg}%</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Section>
    </div>
  );
}
