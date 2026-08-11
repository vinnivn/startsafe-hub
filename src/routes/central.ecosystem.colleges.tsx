import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIntel, COURSE_FALLBACK, type CollegeMetrics } from "@/lib/intel";
import { Loading, Empty, ErrorState, Bar } from "@/components/States";
import { Confirm } from "@/components/Confirm";
import { PlusCircle, Pencil, Archive, Loader2 } from "lucide-react";

export const Route = createFileRoute("/central/ecosystem/colleges")({
  head: () => ({
    meta: [
      { title: "Colleges · StartSafe Central" },
      { name: "description", content: "Create, edit and analyse every institution on the StartSafe ecosystem." },
      { property: "og:title", content: "Colleges · StartSafe Central" },
      { property: "og:description", content: "Institution management with permanent college IDs and course mapping." },
    ],
  }),
  component: CollegesPage,
});

function useCourses() {
  const [courses, setCourses] = useState<string[]>(COURSE_FALLBACK);
  useEffect(() => {
    supabase.from("courses").select("name").eq("is_active", true).order("name").then(({ data }) => {
      if (data?.length) setCourses(data.map((c) => c.name));
    });
  }, []);
  return courses;
}

function CollegesPage() {
  const { colleges, loading, error, reload } = useIntel();
  const courses = useCourses();
  const [editing, setEditing] = useState<CollegeMetrics | null>(null);
  const [creating, setCreating] = useState(false);
  const [q, setQ] = useState("");

  const list = useMemo(
    () => colleges.filter((c) => (c.name + (c.location ?? "") + (c.college_code ?? "")).toLowerCase().includes(q.toLowerCase())),
    [colleges, q],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Colleges</h1>
          <p className="text-muted-foreground mt-1 text-sm">Every institution on StartSafe, with live readiness from real student activity.</p>
        </div>
        <button onClick={() => setCreating(true)} className="h-9 px-4 rounded-lg btn-hero inline-flex items-center gap-2 text-sm">
          <PlusCircle className="h-4 w-4" /> Add College
        </button>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search colleges by name, code or location"
        className="w-full md:w-80 h-9 px-3 rounded-lg bg-input border border-border text-sm focus:border-primary focus:outline-none"
      />

      {error && <ErrorState message={error} />}
      {loading ? (
        <Loading label="Loading colleges" />
      ) : list.length === 0 ? (
        <Empty title="No colleges yet" hint="Use Add College to onboard your first institution." />
      ) : (
        <div className="grid gap-4">
          {list.map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to="/central/colleges/$collegeId" params={{ collegeId: c.id }} className="text-lg font-semibold hover:text-primary transition">
                    {c.name}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="font-mono text-primary">{c.college_code ?? "—"}</span>
                    <span>{c.location ?? "No location"}</span>
                    <span className="capitalize">{c.status}</span>
                    {c.placement_officer_name && <span>PO: {c.placement_officer_name}</span>}
                  </div>
                  {c.courses.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {c.courses.map((co) => (
                        <span key={co} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{co}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tabular-nums">{c.readiness}%</div>
                  <div className="text-[11px] text-muted-foreground">Avg readiness</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                <Mini label="Students" value={c.total} />
                <Mini label="Active" value={c.active} />
                <Mini label="At risk" value={c.atRisk} />
                <Mini label="Certificates" value={c.certifications} />
              </div>
              <div className="mt-3"><Bar value={c.readiness} /></div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Action to="/central/colleges/$collegeId" params={{ collegeId: c.id }}>View Details</Action>
                <Action to="/central/ecosystem/students" search={{ college: c.id }}>Students</Action>
                <Action to="/central/colleges/$collegeId" params={{ collegeId: c.id }} hash="analytics">Analytics</Action>
                <Action to="/central/colleges/$collegeId" params={{ collegeId: c.id }} hash="projects">Projects</Action>
                <Action to="/central/colleges/$collegeId" params={{ collegeId: c.id }} hash="tests">Mock Tests</Action>
                <button onClick={() => setEditing(c)} className="h-8 px-3 rounded-lg text-xs border border-border hover:bg-muted inline-flex items-center gap-1.5">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <Confirm
                  title="Archive this college?"
                  body={
                    <>
                      <p><strong>{c.name}</strong> ({c.college_code})</p>
                      <p>The college is removed from active views. Students, projects and history stay intact and it can be restored later.</p>
                    </>
                  }
                  confirmLabel="Archive college"
                  onConfirm={async () => {
                    await supabase.from("colleges").update({ is_archived: true, status: "archived" }).eq("id", c.id);
                    reload();
                  }}
                  trigger={(open) => (
                    <button onClick={open} className="h-8 px-3 rounded-lg text-xs border border-destructive/40 text-destructive hover:bg-destructive/10 inline-flex items-center gap-1.5">
                      <Archive className="h-3.5 w-3.5" /> Archive
                    </button>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <CollegeForm
          courses={courses}
          college={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); reload(); }}
        />
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Action(props: { to: string; params?: Record<string, string>; search?: Record<string, string>; hash?: string; children: React.ReactNode }) {
  const { to, params, search, hash, children } = props;
  return (
    <Link
      to={to as "/"}
      params={params as never}
      search={search as never}
      hash={hash}
      className="h-8 px-3 rounded-lg text-xs border border-border hover:bg-muted hover:text-foreground transition inline-flex items-center"
    >
      {children}
    </Link>
  );
}

function CollegeForm({ college, courses, onClose, onSaved }: {
  college: CollegeMetrics | null;
  courses: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState(college?.name ?? "");
  const [location, setLocation] = useState(college?.location ?? "");
  const [po, setPo] = useState(college?.placement_officer_name ?? "");
  const [poEmail, setPoEmail] = useState(college?.placement_officer_email ?? "");
  const [poPhone, setPoPhone] = useState(college?.placement_officer_phone ?? "");
  const [status, setStatus] = useState(college?.status ?? "active");
  const [selected, setSelected] = useState<string[]>(college?.courses ?? []);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const payload = {
      name,
      location: location || null,
      placement_officer_name: po || null,
      placement_officer_email: poEmail || null,
      placement_officer_phone: poPhone || null,
      courses: selected,
      status,
    };
    if (college) {
      const { error } = await supabase.from("colleges").update(payload).eq("id", college.id);
      if (error) { setErr(error.message); setBusy(false); return; }
    } else {
      const { data, error } = await supabase.from("colleges").insert(payload).select("id").single();
      if (error) { setErr(error.message); setBusy(false); return; }
      if (data) navigate({ to: "/central/colleges/$collegeId", params: { collegeId: data.id } });
    }
    setBusy(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-background/80 backdrop-blur-sm overflow-auto">
      <form onSubmit={submit} className="glass-card rounded-2xl p-6 w-full max-w-2xl my-8">
        <h3 className="text-lg font-semibold">{college ? "Edit college" : "Add college"}</h3>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Field label="College ID">
            <input
              value={college?.college_code ?? "Generated automatically on save"}
              readOnly
              disabled
              className="w-full h-9 px-3 rounded-lg bg-muted/60 border border-border text-sm font-mono text-muted-foreground cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Permanent and never editable.</p>
          </Field>
          <Field label="College name" required>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Location">
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              <option value="active">Active</option>
              <option value="pilot">Pilot</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
          <Field label="Placement officer name">
            <input value={po} onChange={(e) => setPo(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Placement officer email">
            <input type="email" value={poEmail} onChange={(e) => setPoEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Placement officer phone">
            <input value={poPhone} onChange={(e) => setPoPhone(e.target.value)} className={inputCls} />
          </Field>
        </div>

        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-2">Courses offered</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {courses.map((c) => {
              const on = selected.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSelected((s) => (on ? s.filter((x) => x !== c) : [...s, c]))}
                  className={`h-9 px-3 rounded-lg text-sm border text-left transition ${on ? "border-primary/50 bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
                >
                  {on ? "☑" : "☐"} {c}
                </button>
              );
            })}
          </div>
        </div>

        {err && <div className="mt-4"><ErrorState message={err} /></div>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-lg text-sm border border-border hover:bg-muted">Cancel</button>
          <button disabled={busy} className="h-9 px-4 rounded-lg btn-hero text-sm inline-flex items-center gap-2 disabled:opacity-60">
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {college ? "Save changes" : "Create college"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls = "w-full h-9 px-3 rounded-lg bg-input border border-border text-sm focus:border-primary focus:outline-none";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1.5">{label}{required && " *"}</div>
      {children}
    </label>
  );
}
