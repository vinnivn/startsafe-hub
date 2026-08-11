import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useIntel } from "@/lib/intel";
import { Loading, Empty, Section, ErrorState } from "@/components/States";
import { Back } from "@/components/Back";
import { Github, ExternalLink, Loader2 } from "lucide-react";

const STATUSES = ["submitted", "under_review", "approved", "rejected"];

/** Project detail with review workflow for college / central reviewers. */
export function ProjectDetailView({ projectId, basePath, canReview }: {
  projectId: string;
  basePath: "/central" | "/college" | "/student";
  canReview: boolean;
}) {
  const { projects, students, colleges, loading, reload } = useIntel();
  const p = projects.find((x) => x.id === projectId);
  const [notes, setNotes] = useState<string | null>(null);
  const [score, setScore] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (loading) return <Loading label="Loading project" />;
  if (!p) return <Empty title="Project not found" />;

  const owner = students.find((s) => s.id === p.user_id);
  const college = colleges.find((c) => c.id === owner?.college_id);

  const save = async (status: string) => {
    setBusy(true);
    setErr(null);
    const { error } = await supabase
      .from("projects")
      .update({
        status,
        review_notes: notes ?? p.review_notes,
        score: score !== null && score !== "" ? Number(score) : p.score,
      })
      .eq("id", p.id);
    if (error) setErr(error.message);
    setBusy(false);
    reload();
  };

  return (
    <div className="space-y-6">
      <Back fallbackTo={`${basePath}`} label="Back" />

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold">{p.title}</h1>
            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {owner && basePath !== "/student" && (
                <Link to={`${basePath}/students/$studentId` as "/"} params={{ studentId: owner.id } as never} className="hover:text-primary">
                  {owner.full_name}
                </Link>
              )}
              {college && <span>{college.name}</span>}
              <span className="capitalize">{p.project_type.replace(/_/g, " ")}</span>
              <span>{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary capitalize">{p.status.replace(/_/g, " ")}</span>
            {p.score !== null && <div className="text-2xl font-bold tabular-nums mt-2">{p.score}/100</div>}
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-5 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Description</div>
            <p className="whitespace-pre-wrap">{p.description || "—"}</p>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Objectives</div>
            <p className="whitespace-pre-wrap">{p.objectives || "—"}</p>
          </div>
        </div>

        {p.tech_stack?.length ? (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {p.tech_stack.map((t) => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-muted">{t}</span>)}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          {p.github_url && (
            <a href={p.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
              <Github className="h-4 w-4" /> Repository
            </a>
          )}
          {p.demo_url && (
            <a href={p.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
              <ExternalLink className="h-4 w-4" /> Live demo
            </a>
          )}
        </div>
      </div>

      {p.review_notes && (
        <Section title="Review notes">
          <div className="glass-card rounded-xl p-4 text-sm whitespace-pre-wrap">{p.review_notes}</div>
        </Section>
      )}

      {canReview && (
        <Section title="Review this project">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <textarea
              defaultValue={p.review_notes ?? ""}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Feedback for the student"
              className="w-full p-3 rounded-lg bg-input border border-border text-sm focus:border-primary focus:outline-none"
            />
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={p.score ?? ""}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Score /100"
                className="h-9 w-32 px-3 rounded-lg bg-input border border-border text-sm focus:border-primary focus:outline-none"
              />
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => save(s)}
                  className={`h-9 px-4 rounded-lg text-sm capitalize transition disabled:opacity-60 ${s === "approved" ? "btn-hero" : "border border-border hover:bg-muted"}`}
                >
                  {busy && <Loader2 className="h-3.5 w-3.5 animate-spin inline mr-1.5" />}
                  Mark {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
            {err && <ErrorState message={err} />}
          </div>
        </Section>
      )}
    </div>
  );
}
