import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PlatformStats {
  students: number;
  colleges: number;
  learningHours: number;
  projects: number;
  placements: number;
  internships: number;
  certificates: number;
  startupIdeas: number;
  companies: number;
  pilotDeployments: number;
  mockTests: number;
}

const EMPTY: PlatformStats = {
  students: 0, colleges: 0, learningHours: 0, projects: 0, placements: 0,
  internships: 0, certificates: 0, startupIdeas: 0, companies: 0,
  pilotDeployments: 0, mockTests: 0,
};

async function fetchStats(): Promise<PlatformStats> {
  const count = (t: string) => supabase.from(t as never).select("*", { count: "exact", head: true });
  const [students, colleges, projects, placements, internships, certs, ideas, companies, pilots, mocks, mins] = await Promise.all([
    count("profiles"),
    count("colleges"),
    count("projects"),
    count("placements"),
    count("internships"),
    count("certificates"),
    count("startup_ideas"),
    count("companies"),
    count("pilot_deployments"),
    count("mock_tests"),
    supabase.from("learning_sessions").select("minutes"),
  ]);
  const totalMinutes = (mins.data ?? []).reduce((a: number, r: { minutes: number }) => a + (r.minutes ?? 0), 0);
  return {
    students: students.count ?? 0,
    colleges: colleges.count ?? 0,
    learningHours: Math.round(totalMinutes / 60),
    projects: projects.count ?? 0,
    placements: placements.count ?? 0,
    internships: internships.count ?? 0,
    certificates: certs.count ?? 0,
    startupIdeas: ideas.count ?? 0,
    companies: companies.count ?? 0,
    pilotDeployments: pilots.count ?? 0,
    mockTests: mocks.count ?? 0,
  };
}

const TABLES = [
  "profiles", "colleges", "projects", "placements", "internships",
  "certificates", "startup_ideas", "companies", "pilot_deployments",
  "mock_tests", "learning_sessions",
];

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const s = await fetchStats();
      if (alive) { setStats(s); setLoading(false); }
    };
    load();

    const channel = supabase.channel("platform-stats");
    TABLES.forEach((t) => {
      channel.on("postgres_changes", { event: "*", schema: "public", table: t }, () => load());
    });
    channel.subscribe();

    return () => { alive = false; supabase.removeChannel(channel); };
  }, []);

  return { stats, loading };
}
