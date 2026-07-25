import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/seed-demo")({
  server: {
    handlers: {
      GET: async () => runSeed(),
      POST: async () => runSeed(),
    },
  },
});

async function runSeed() {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const log: string[] = [];
    const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // ---------- Helper: create or find auth user ----------
    async function upsertUser(email: string, password: string, meta: Record<string, unknown>) {
      // Look up existing
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (existing) return { id: existing.id, created: false };
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: meta,
      });
      if (error) throw new Error(`createUser ${email}: ${error.message}`);
      return { id: data.user!.id, created: true };
    }

    // ---------- COLLEGES ----------
    const COLLEGES = [
      { name: "P.E.S. College of Engineering, Mandya", email: "pesce@startsafe.in", password: "PESCE@123", students: 12 },
      { name: "RV College of Engineering", email: "rvce@startsafe.in", password: "RVCE@123", students: 14 },
      { name: "BMS College of Engineering", email: "bmsce@startsafe.in", password: "BMSCE@123", students: 12 },
      { name: "MS Ramaiah Institute of Technology", email: "msrit@startsafe.in", password: "MSRIT@123", students: 12 },
    ];

    // Super Admin
    const admin = await upsertUser("admin@startsafe.in", "Admin@123", {
      full_name: "StartSafe Super Admin",
      role: "central",
    });
    log.push(`admin ${admin.created ? "created" : "exists"}: ${admin.id}`);

    // College accounts
    const collegeUsers: { name: string; userId: string; collegeId: string; students: number }[] = [];
    for (const c of COLLEGES) {
      const u = await upsertUser(c.email, c.password, {
        full_name: c.name,
        role: "college",
        college_name: c.name,
      });
      // fetch college_id from user_roles
      const { data: ur } = await supabaseAdmin.from("user_roles").select("college_id").eq("user_id", u.id).maybeSingle();
      let collegeId = ur?.college_id as string | null | undefined;
      if (!collegeId) {
        const { data: col } = await supabaseAdmin.from("colleges").select("id").eq("name", c.name).maybeSingle();
        collegeId = col?.id;
      }
      if (!collegeId) throw new Error(`No college id for ${c.name}`);
      collegeUsers.push({ name: c.name, userId: u.id, collegeId, students: c.students });
      log.push(`college ${c.name} → ${collegeId}`);
    }

    // ---------- STUDENTS ----------
    const FIRST = ["Vinaya","Aditi","Rohan","Ananya","Karthik","Priya","Arjun","Meera","Rahul","Sneha","Vikram","Divya","Aman","Kavya","Nikhil","Isha","Yash","Pooja","Siddharth","Riya","Aryan","Neha","Manoj","Shruti","Harish"];
    const LAST = ["Zingade","Sharma","Patel","Reddy","Rao","Kumar","Iyer","Nair","Gowda","Hegde","Shetty","Jain","Bhat","Kulkarni","Desai","Singh","Menon","Pillai","Naidu","Prasad"];
    const DEPTS_CODES: Record<string, string> = { CS: "CS", IS: "IS", AI: "AI", EC: "EC", EE: "EE", ME: "ME", CV: "CV" };

    const TOPICS = ["Programming Foundations","Problem Solving","DSA","HTML","CSS","JavaScript","React","Node.js","SQL","DBMS","OS","Networks","OOP","Git","Cloud","Communication","Aptitude","Reasoning","Interview Prep","Projects"];
    const PROJECT_TITLES = ["Smart Attendance","Student Portal","Hospital Management","AI Resume Analyzer","Smart Agriculture","Expense Tracker","Portfolio Website","IoT Monitoring","Chatbot","Weather App","E-Commerce Cart","Fitness Tracker","Note Taking App","Movie Recommender","Blood Bank System"];
    const TECH: string[][] = [["React","Node","MongoDB"],["Python","Flask","SQL"],["Next.js","Prisma","Postgres"],["Java","Spring","MySQL"],["FastAPI","React","Postgres"]];
    const CERT_TITLES = ["Programming Foundations","Python","Java","C++","SQL","Git & GitHub","Cloud Basics","AI Basics","Communication","Web Development"];
    const MOCK_COMPANIES = ["TCS","Infosys","Accenture","Wipro","Cognizant","Capgemini","IBM","Deloitte","Tech Mahindra","HCL"];
    const CAREER_TRACKS = ["software_engineering","artificial_intelligence","cyber_security","web_development","data_science","cloud_computing","startup","research","higher_studies","core_engineering"] as const;
    const PROJECT_TYPES = ["mini","major","startup","industry","research","hackathon","open_source","prototype"] as const;
    const CERT_TYPES = ["programming","project","innovation","interview","industry","startsafe"] as const;

    let studentIdx = 1;
    let totalCreated = 0;

    for (const col of collegeUsers) {
      for (let i = 0; i < col.students; i++) {
        const first = rand(FIRST);
        const last = rand(LAST);
        const name = `${first} ${last}`;
        const email = `student${studentIdx}@startsafe.in`;
        const track = rand([...CAREER_TRACKS]);

        const u = await upsertUser(email, "Student@123", {
          full_name: name,
          role: "student",
          college_name: col.name,
        });

        if (u.created) totalCreated++;

        // Ensure profile has college + track + github
        await supabaseAdmin.from("profiles").update({
          college_id: col.collegeId,
          career_track: track,
          github_username: `${first.toLowerCase()}${last.toLowerCase()}${studentIdx}`,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name + studentIdx)}`,
        }).eq("id", u.id);

        // Seed activity data — skip if already has entries (idempotent)
        const { count: existingSessions } = await supabaseAdmin
          .from("learning_sessions").select("*", { count: "exact", head: true }).eq("user_id", u.id);
        if ((existingSessions ?? 0) > 0) { studentIdx++; continue; }

        // Learning sessions (5-15 topics)
        const chosenTopics = [...TOPICS].sort(() => Math.random() - 0.5).slice(0, randInt(6, 14));
        const sessionRows = chosenTopics.map((t) => ({
          user_id: u.id, topic: t, minutes: randInt(30, 480),
        }));
        await supabaseAdmin.from("learning_sessions").insert(sessionRows);

        // Mock tests (3-7 companies)
        const chosenMocks = [...MOCK_COMPANIES].sort(() => Math.random() - 0.5).slice(0, randInt(3, 7));
        const mockRows = chosenMocks.map((c) => ({
          user_id: u.id, topic: c, score: randInt(40, 95), total: 100,
        }));
        await supabaseAdmin.from("mock_tests").insert(mockRows);

        // Projects (1-4)
        const projCount = randInt(1, 4);
        const chosenProjects = [...PROJECT_TITLES].sort(() => Math.random() - 0.5).slice(0, projCount);
        const projRows = chosenProjects.map((p) => ({
          user_id: u.id,
          title: p,
          description: `${p} built by ${name}`,
          project_type: rand([...PROJECT_TYPES]),
          tech_stack: rand(TECH),
          github_url: `https://github.com/demo/${p.toLowerCase().replace(/\s+/g, "-")}`,
          demo_url: null,
        }));
        await supabaseAdmin.from("projects").insert(projRows);

        // Certificates (1-5)
        const certCount = randInt(1, 5);
        const chosenCerts = [...CERT_TITLES].sort(() => Math.random() - 0.5).slice(0, certCount);
        const certRows = chosenCerts.map((t) => ({
          user_id: u.id, title: t, cert_type: rand([...CERT_TYPES]),
        }));
        await supabaseAdmin.from("certificates").insert(certRows);

        // Internships (0-2)
        if (Math.random() > 0.5) {
          await supabaseAdmin.from("internships").insert({
            user_id: u.id, company_name: rand(MOCK_COMPANIES),
            role: rand(["SDE Intern","Data Intern","ML Intern","Web Intern","Cloud Intern"]),
            duration_months: randInt(2, 6),
          });
        }

        // Placement (~30%)
        if (Math.random() < 0.3) {
          await supabaseAdmin.from("placements").insert({
            user_id: u.id, company_name: rand(MOCK_COMPANIES),
            role: rand(["SDE","Analyst","Consultant","Cloud Engineer"]),
            package_lpa: randInt(4, 22),
          });
        }

        // Startup ideas (~20%)
        if (Math.random() < 0.2) {
          await supabaseAdmin.from("startup_ideas").insert({
            user_id: u.id,
            title: `${first}'s Venture`,
            pitch: `A ${track.replace(/_/g, " ")} startup focused on solving campus-level problems.`,
          });
        }

        studentIdx++;
      }
    }

    // ---------- COMPANIES ----------
    const { count: companyCount } = await supabaseAdmin.from("companies").select("*", { count: "exact", head: true });
    if ((companyCount ?? 0) === 0) {
      await supabaseAdmin.from("companies").insert(
        MOCK_COMPANIES.map((n) => ({
          name: n,
          industry: rand(["IT Services","Product","Consulting","Cloud","Finance"]),
          is_hiring: Math.random() > 0.3,
        })),
      );
    }

    // ---------- PILOT DEPLOYMENTS ----------
    const { count: pilotCount } = await supabaseAdmin.from("pilot_deployments").select("*", { count: "exact", head: true });
    if ((pilotCount ?? 0) === 0) {
      await supabaseAdmin.from("pilot_deployments").insert(
        collegeUsers.map((c) => ({
          name: `${c.name} Pilot`,
          college_id: c.collegeId,
          status: rand(["active","onboarding","review"]),
        })),
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        summary: {
          admin: "admin@startsafe.in / Admin@123",
          colleges: COLLEGES.map((c) => `${c.email} / ${c.password}`),
          studentsCreatedNow: totalCreated,
          studentsTotal: studentIdx - 1,
          studentLoginPattern: "student{N}@startsafe.in / Student@123",
        },
        log,
      }, null, 2),
      { headers: { "content-type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[seed-demo]", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }, null, 2), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
