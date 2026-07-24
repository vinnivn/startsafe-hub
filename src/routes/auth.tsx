import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/useAuth";
import { GraduationCap, Shield, Brain, Sparkles, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · StartSafe" },
      { name: "description", content: "Sign in or create an account for the Student, College, or Central Intelligence ecosystem." },
      { property: "og:title", content: "Sign in · StartSafe" },
      { property: "og:description", content: "Choose your ecosystem and get started." },
    ],
  }),
  component: AuthPage,
});

const ROLES: { key: AppRole; icon: React.ComponentType<{ className?: string }>; title: string; desc: string }[] = [
  { key: "student", icon: GraduationCap, title: "Student", desc: "Learn, build projects, get placement-ready." },
  { key: "college", icon: Shield, title: "College", desc: "Monitor students, coding, placements, insights." },
  { key: "central", icon: Brain, title: "Central Intelligence", desc: "Ecosystem-wide analytics and deployments." },
];

function AuthPage() {
  const router = useRouter();
  const { session, role, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [selectedRole, setSelectedRole] = useState<AppRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session && role) {
      router.navigate({ to: role === "college" ? "/college" : role === "central" ? "/central" : "/student" });
    }
  }, [loading, session, role, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, role: selectedRole, college_name: collegeName || null },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden border-r border-border/60">
        <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
        <Link to="/" className="relative flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="h-9 w-9 rounded-lg btn-hero grid place-items-center"><Sparkles className="h-4 w-4" /></div>
            <div className="font-bold text-xl">StartSafe</div>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            <span className="text-gradient">Choose your ecosystem</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md">
            Three intelligent interfaces. One unified real-time database.
          </p>
          <div className="mt-8 space-y-3">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setSelectedRole(r.key)}
                className={`w-full text-left glass-card rounded-xl p-4 flex items-start gap-4 transition-all ${selectedRole === r.key ? "border-primary/60 ring-1 ring-primary/40" : "hover:border-border"}`}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm text-muted-foreground">{r.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div className="md:hidden">
            <Link to="/" className="text-sm text-muted-foreground">← Back home</Link>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signin" ? "Sign in to your ecosystem" : `Registering as ${ROLES.find(r => r.key === selectedRole)?.title}`}
            </p>
          </div>

          <div className="md:hidden grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.key} type="button" onClick={() => setSelectedRole(r.key)}
                className={`text-xs p-2 rounded-lg border ${selectedRole === r.key ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
              >{r.title}</button>
            ))}
          </div>

          {mode === "signup" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full name</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none transition" />
              </div>
              {(selectedRole === "student" || selectedRole === "college") && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {selectedRole === "college" ? "College name" : "College (optional)"}
                  </label>
                  <input value={collegeName} onChange={(e) => setCollegeName(e.target.value)}
                    required={selectedRole === "college"}
                    className="w-full h-11 px-3.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none transition" />
                </div>
              )}
            </>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none transition" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none transition" />
          </div>

          {err && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">{err}</div>}

          <button disabled={busy} className="w-full h-11 rounded-lg btn-hero inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <div className="text-sm text-center text-muted-foreground">
            {mode === "signin" ? (
              <>No account? <button type="button" onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">Sign up</button></>
            ) : (
              <>Already have one? <button type="button" onClick={() => setMode("signin")} className="text-primary font-medium hover:underline">Sign in</button></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
