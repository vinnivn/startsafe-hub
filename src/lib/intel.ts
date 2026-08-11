import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StudentMetrics {
  id: string;
  full_name: string;
  email: string;
  college_id: string | null;
  course: string | null;
  department: string | null;
  semester: number | null;
  section: string | null;
  roll_number: string | null;
  career_track: string | null;
  github_username: string | null;
  minutes: number;
  learning: number;
  mockBest: number;
  mockAttempts: number;
  coding: number;
  projects: number;
  projectScoreAvg: number | null;
  certificates: number;
  placements: number;
  readiness: number;
  lastActivity: string | null;
}

export interface CollegeMetrics {
  id: string;
  name: string;
  location: string | null;
  college_code: string | null;
  courses: string[];
  status: string;
  placement_officer_name: string | null;
  placement_officer_email: string | null;
  placement_officer_phone: string | null;
  students: StudentMetrics[];
  total: number;
  active: number;
  readiness: number;
  learning: number;
  mock: number;
  coding: number;
  projectCompletion: number;
  certifications: number;
  atRisk: number;
}

export interface ProjectRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  objectives: string | null;
  project_type: string;
  github_url: string | null;
  demo_url: string | null;
  tech_stack: string[] | null;
  status: string;
  review_notes: string | null;
  score: number | null;
  deadline: string | null;
  created_at: string;
  is_archived: boolean;
}

function pct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Loads the whole activity graph once and derives per-student and per-college
 * intelligence. Kept live through Supabase Realtime.
 */
export function useIntel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<{
    profiles: any[];
    colleges: any[];
    learning: any[];
    legacyTests: any[];
    attempts: any[];
    projects: any[];
    certificates: any[];
    placements: any[];
    tests: any[];
  }>({ profiles: [], colleges: [], learning: [], legacyTests: [], attempts: [], projects: [], certificates: [], placements: [], tests: [] });

  const load = async () => {
    const [profiles, colleges, learning, legacyTests, attempts, projects, certificates, placements, tests] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("colleges").select("*").order("name"),
      supabase.from("learning_sessions").select("*"),
      supabase.from("mock_tests").select("*"),
      supabase.from("test_attempts").select("*"),
      supabase.from("projects").select("*"),
      supabase.from("certificates").select("*"),
      supabase.from("placements").select("*"),
      supabase.from("mock_test_definitions").select("*"),
    ]);
    const err = [profiles, colleges, learning, legacyTests, attempts, projects, certificates, placements, tests].find((r) => r.error);
    setError(err?.error?.message ?? null);
    setRaw({
      profiles: profiles.data ?? [],
      colleges: colleges.data ?? [],
      learning: learning.data ?? [],
      legacyTests: legacyTests.data ?? [],
      attempts: attempts.data ?? [],
      projects: projects.data ?? [],
      certificates: certificates.data ?? [],
      placements: placements.data ?? [],
      tests: tests.data ?? [],
    });
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("intel");
    ["profiles", "colleges", "learning_sessions", "mock_tests", "test_attempts", "projects", "certificates", "placements", "mock_test_definitions"].forEach((t) =>
      ch.on("postgres_changes", { event: "*", schema: "public", table: t }, () => load()),
    );
    ch.subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const students = useMemo<StudentMetrics[]>(() => {
    return raw.profiles.map((p) => {
      const minutes = raw.learning.filter((l) => l.user_id === p.id).reduce((a, l) => a + (l.minutes ?? 0), 0);
      const legacy = raw.legacyTests.filter((m) => m.user_id === p.id);
      const attempts = raw.attempts.filter((a) => a.user_id === p.id && a.status === "submitted");
      const scores = [
        ...legacy.map((m) => (m.total ? (m.score / m.total) * 100 : 0)),
        ...attempts.map((a) => (a.total ? (a.score / a.total) * 100 : 0)),
      ];
      const mockBest = scores.length ? Math.max(...scores) : 0;
      const projects = raw.projects.filter((pr) => pr.user_id === p.id && !pr.is_archived);
      const scored = projects.filter((pr) => pr.score !== null);
      const certificates = raw.certificates.filter((c) => c.user_id === p.id).length;
      const placements = raw.placements.filter((pl) => pl.user_id === p.id).length;

      const learning = pct((minutes / 900) * 100);
      const coding = pct(scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
      const projectScore = pct(projects.length * 25);
      const certScore = pct(certificates * 20);
      const readiness = pct(learning * 0.3 + mockBest * 0.25 + coding * 0.1 + projectScore * 0.25 + certScore * 0.1);

      const dates = [
        ...raw.learning.filter((l) => l.user_id === p.id).map((l) => l.created_at),
        ...projects.map((pr) => pr.created_at),
        ...attempts.map((a) => a.created_at),
      ].sort();

      return {
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        college_id: p.college_id,
        course: p.course,
        department: p.department,
        semester: p.semester,
        section: p.section,
        roll_number: p.roll_number,
        career_track: p.career_track,
        github_username: p.github_username,
        minutes,
        learning,
        mockBest: Math.round(mockBest),
        mockAttempts: legacy.length + attempts.length,
        coding,
        projects: projects.length,
        projectScoreAvg: scored.length ? Math.round(scored.reduce((a, pr) => a + (pr.score ?? 0), 0) / scored.length) : null,
        certificates,
        placements,
        readiness,
        lastActivity: dates.length ? dates[dates.length - 1] : null,
      };
    });
  }, [raw]);

  const colleges = useMemo<CollegeMetrics[]>(() => {
    return raw.colleges
      .filter((c) => !c.is_archived)
      .map((c) => {
        const list = students.filter((s) => s.college_id === c.id);
        const avg = (sel: (s: StudentMetrics) => number) => (list.length ? pct(list.reduce((a, s) => a + sel(s), 0) / list.length) : 0);
        return {
          id: c.id,
          name: c.name,
          location: c.location,
          college_code: c.college_code,
          courses: c.courses ?? [],
          status: c.status ?? "active",
          placement_officer_name: c.placement_officer_name,
          placement_officer_email: c.placement_officer_email,
          placement_officer_phone: c.placement_officer_phone,
          students: list,
          total: list.length,
          active: list.filter((s) => s.minutes > 0 || s.projects > 0 || s.mockAttempts > 0).length,
          readiness: avg((s) => s.readiness),
          learning: avg((s) => s.learning),
          mock: avg((s) => s.mockBest),
          coding: avg((s) => s.coding),
          projectCompletion: avg((s) => Math.min(100, s.projects * 25)),
          certifications: list.reduce((a, s) => a + s.certificates, 0),
          atRisk: list.filter((s) => s.readiness < 40).length,
        };
      });
  }, [raw, students]);

  return {
    loading,
    error,
    students,
    colleges,
    projects: raw.projects as ProjectRow[],
    certificates: raw.certificates,
    attempts: raw.attempts,
    tests: raw.tests,
    legacyTests: raw.legacyTests,
    learning: raw.learning,
    placements: raw.placements,
    reload: load,
  };
}

export const COURSE_FALLBACK = ["B.Tech", "B.E.", "BCA", "B.Com", "BBA", "BA", "B.Sc", "BVA", "MBA", "MCA", "M.Com"];
