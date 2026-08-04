import type { Scope } from "@/lib/useLiveRows";

export interface Column {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
}

export interface ModuleDef {
  title: string;
  description: string;
  /** Table the module reads from. Null means the module ships in a later phase. */
  table: string | null;
  scope?: Scope;
  ownerColumn?: string;
  columns?: Column[];
  /** Numeric columns that get summed into headline metrics. */
  sum?: { key: string; label: string; divideBy?: number }[];
  /** Explains what will power the module once its schema lands. */
  pendingNote?: string;
}

const DATE: Column = { key: "created_at", label: "Date", type: "date" };

const MOCK_COLUMNS: Column[] = [
  { key: "topic", label: "Topic" },
  { key: "score", label: "Score", type: "number" },
  { key: "total", label: "Total", type: "number" },
  DATE,
];
const PROJECT_COLUMNS: Column[] = [
  { key: "title", label: "Project" },
  { key: "project_type", label: "Type" },
  { key: "github_url", label: "GitHub" },
  DATE,
];
const CERT_COLUMNS: Column[] = [
  { key: "title", label: "Certificate" },
  { key: "cert_type", label: "Type" },
  { key: "verification_id", label: "Verification ID" },
  DATE,
];
const LEARNING_COLUMNS: Column[] = [
  { key: "topic", label: "Topic" },
  { key: "minutes", label: "Minutes", type: "number" },
  DATE,
];
const PLACEMENT_COLUMNS: Column[] = [
  { key: "company_name", label: "Company" },
  { key: "role", label: "Role" },
  { key: "package_lpa", label: "Package (LPA)", type: "number" },
  DATE,
];
const IDEA_COLUMNS: Column[] = [
  { key: "title", label: "Idea" },
  { key: "pitch", label: "Pitch" },
  DATE,
];
const STUDENT_COLUMNS: Column[] = [
  { key: "full_name", label: "Student" },
  { key: "email", label: "Email" },
  { key: "career_track", label: "Career track" },
  DATE,
];

function pending(title: string, description: string, pendingNote: string): ModuleDef {
  return { title, description, table: null, pendingNote };
}

export const STUDENT_MODULES: Record<string, ModuleDef> = {
  "learning/overview": {
    title: "Learning Paths",
    description: "Every learning session you have logged, live from the database.",
    table: "learning_sessions",
    scope: "own",
    columns: LEARNING_COLUMNS,
    sum: [{ key: "minutes", label: "Learning hours", divideBy: 60 }],
  },
  ...Object.fromEntries(
    [3, 4, 5, 6, 7, 8].map((s) => [
      `learning/semester-${s}`,
      pending(
        `Semester ${s}`,
        `Subjects, modules, lessons, notes and assignments for semester ${s}.`,
        "Curriculum content is authored in the Admin Content CMS. Once you publish subjects and lessons there, this page renders them with real progress tracking.",
      ),
    ]),
  ),
  "assessments/mock-tests": {
    title: "Mock Tests",
    description: "Your attempt history and accuracy, updated in real time.",
    table: "mock_tests",
    scope: "own",
    columns: MOCK_COLUMNS,
    sum: [{ key: "score", label: "Total score" }],
  },
  "assessments/coding-practice": pending(
    "Coding Practice",
    "Problem set, editor and real compilation via Judge0.",
    "Needs the coding problem tables plus a Judge0 API key for real compile and run.",
  ),
  "assessments/interview-prep": pending(
    "Interview Preparation",
    "HR, technical, aptitude and behavioural question sets with AI mock interviews.",
    "Needs the interview question bank tables; AI interviews run on the built-in AI gateway.",
  ),
  "innovation/projects": {
    title: "Projects",
    description: "Everything you have submitted, with approval status flowing to your college.",
    table: "projects",
    scope: "own",
    columns: PROJECT_COLUMNS,
  },
  "innovation/certifications": {
    title: "Certifications",
    description: "Certificates unlocked by your activity, each with a verification ID.",
    table: "certificates",
    scope: "own",
    columns: CERT_COLUMNS,
  },
  "growth/analytics": {
    title: "Analytics",
    description: "Your learning trend built from real sessions.",
    table: "learning_sessions",
    scope: "own",
    columns: LEARNING_COLUMNS,
    sum: [{ key: "minutes", label: "Total minutes" }],
  },
  "growth/leaderboard": {
    title: "Leaderboard",
    description: "Ranking across the ecosystem, computed from live activity.",
    table: "profiles",
    scope: "all",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
  "ai/mentor": pending(
    "AI Mentor",
    "A real chat mentor that reads your activity and recommends next steps.",
    "Runs on the built-in AI gateway once the chat route and message history table are added.",
  ),
  "account/profile": {
    title: "Profile",
    description: "Your personal details, career goal and linked accounts.",
    table: "profiles",
    scope: "own",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
};

export const COLLEGE_MODULES: Record<string, ModuleDef> = {
  "command-center": {
    title: "Command Center",
    description: "Live roster of every student registered under your college.",
    table: "profiles",
    scope: "college",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
  "analytics/visual": {
    title: "Visual Analytics",
    description: "Learning volume across your campus.",
    table: "learning_sessions",
    scope: "college",
    columns: LEARNING_COLUMNS,
    sum: [{ key: "minutes", label: "Campus learning hours", divideBy: 60 }],
  },
  "analytics/ai-insights": pending(
    "AI Insights",
    "Students at risk, weak subjects and department comparisons.",
    "Generated from your campus activity by the AI gateway in the analytics phase.",
  ),
  "institution/profile": {
    title: "College Profile",
    description: "Your institution record.",
    table: "colleges",
    scope: "all",
    columns: [
      { key: "name", label: "College" },
      { key: "location", label: "Location" },
      DATE,
    ],
  },
  "institution/departments": pending("Departments", "Department structure for your campus.", "Needs the departments table."),
  "institution/sections": pending("Sections", "Sections inside each department.", "Needs the sections table."),
  "institution/semesters": pending("Semesters", "Active semesters and their cohorts.", "Needs the semesters table."),
  "students/database": {
    title: "Student Database",
    description: "Search, filter and export every student in your college.",
    table: "profiles",
    scope: "college",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
  "students/placement-readiness": {
    title: "Placement Readiness",
    description: "Readiness signals from real mock test performance.",
    table: "mock_tests",
    scope: "college",
    columns: MOCK_COLUMNS,
    sum: [{ key: "score", label: "Total score" }],
  },
  "students/progress": {
    title: "Student Progress",
    description: "Session-level progress across your campus.",
    table: "learning_sessions",
    scope: "college",
    columns: LEARNING_COLUMNS,
    sum: [{ key: "minutes", label: "Minutes learned" }],
  },
  "students/toppers": {
    title: "Topper Dashboard",
    description: "Highest scoring attempts on your campus.",
    table: "mock_tests",
    scope: "college",
    columns: MOCK_COLUMNS,
    sum: [{ key: "score", label: "Combined score" }],
  },
  "students/rankings": {
    title: "Student Rankings",
    description: "Campus ranking built from live activity.",
    table: "profiles",
    scope: "college",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
  "learning/analytics": {
    title: "Learning Analytics",
    description: "All learning sessions recorded by your students.",
    table: "learning_sessions",
    scope: "college",
    columns: LEARNING_COLUMNS,
    sum: [{ key: "minutes", label: "Total minutes" }],
  },
  "learning/paths": pending("Learning Paths", "Curriculum assigned to your cohorts.", "Populated from the Admin Content CMS."),
  "learning/modules": pending("Modules & Lessons", "Module and lesson completion per cohort.", "Populated from the Admin Content CMS."),
  "learning/cheat-sheets": pending("Cheat Sheets", "Revision material shared with students.", "Needs the resources table."),
  "assessments/mcq": {
    title: "MCQ Performance",
    description: "Every MCQ attempt on your campus.",
    table: "mock_tests",
    scope: "college",
    columns: MOCK_COLUMNS,
    sum: [{ key: "score", label: "Total score" }],
  },
  "assessments/coding": pending("Coding Performance", "Submissions, accuracy and language mix.", "Activates with the coding practice engine."),
  "assessments/assignments": pending("Assignments", "Assignment submissions per subject.", "Needs the assignments table from the CMS."),
  "assessments/mini-projects": {
    title: "Mini Projects",
    description: "Mini projects submitted by your students.",
    table: "projects",
    scope: "college",
    columns: PROJECT_COLUMNS,
  },
  "assessments/mock-tests": {
    title: "Mock Tests",
    description: "Campus-wide mock test activity.",
    table: "mock_tests",
    scope: "college",
    columns: MOCK_COLUMNS,
    sum: [{ key: "score", label: "Total score" }],
  },
  "assessments/interview": pending("Interview Analytics", "Interview readiness across your cohorts.", "Activates with the interview preparation engine."),
  "innovation/certifications": {
    title: "Certifications",
    description: "Certificates earned by your students.",
    table: "certificates",
    scope: "college",
    columns: CERT_COLUMNS,
  },
  "innovation/ideas": {
    title: "Innovation",
    description: "Startup ideas pitched on your campus.",
    table: "startup_ideas",
    scope: "college",
    columns: IDEA_COLUMNS,
  },
  "placements/company-readiness": {
    title: "Company Readiness",
    description: "Hiring companies visible to your campus.",
    table: "companies",
    scope: "all",
    columns: [
      { key: "name", label: "Company" },
      { key: "industry", label: "Industry" },
      { key: "is_hiring", label: "Hiring" },
      DATE,
    ],
  },
  "placements/drives": {
    title: "Placement Drives",
    description: "Placements reported by your students.",
    table: "placements",
    scope: "college",
    columns: PLACEMENT_COLUMNS,
    sum: [{ key: "package_lpa", label: "Total LPA offered" }],
  },
  "reports/weekly": {
    title: "Weekly Reports",
    description: "Latest activity used to build weekly reports.",
    table: "learning_sessions",
    scope: "college",
    columns: LEARNING_COLUMNS,
    sum: [{ key: "minutes", label: "Minutes this period" }],
  },
  "reports/studio": pending("Reports Studio", "Compose PDF and Excel reports from live data.", "Activates with the reporting engine."),
  "reports/downloads": pending("Download Center", "Generated report archive.", "Activates with the reporting engine."),
  "workspace/alerts": pending("Alerts", "Automatic alerts for at-risk students.", "Needs the alerts table."),
  "workspace/notifications": pending("Notifications", "Campus notification feed.", "Needs the notifications table."),
  "workspace/mentor": pending("Mentor Dashboard", "Mentor assignment and follow-ups.", "Needs the mentors table."),
  "workspace/settings": pending("Settings", "Institution preferences.", "Needs the college settings table."),
};

export const ADMIN_MODULES: Record<string, ModuleDef> = {
  "command-center": {
    title: "Command Center",
    description: "Every profile in the ecosystem.",
    table: "profiles",
    scope: "all",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
  "ecosystem/colleges": {
    title: "Colleges",
    description: "All institutions on StartSafe.",
    table: "colleges",
    scope: "all",
    columns: [
      { key: "name", label: "College" },
      { key: "location", label: "Location" },
      DATE,
    ],
  },
  "ecosystem/students": {
    title: "Students",
    description: "Every student across every campus.",
    table: "profiles",
    scope: "all",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
  "ecosystem/companies": {
    title: "Companies",
    description: "Hiring partners in the ecosystem.",
    table: "companies",
    scope: "all",
    columns: [
      { key: "name", label: "Company" },
      { key: "industry", label: "Industry" },
      { key: "is_hiring", label: "Hiring" },
      DATE,
    ],
  },
  "ecosystem/faculty": pending("Faculty", "Faculty accounts per college.", "Needs the faculty table."),
  "learning/courses": pending("Courses", "Course catalogue.", "Created in the Content CMS."),
  "learning/paths": pending("Learning Paths", "Semester-wise curriculum builder.", "Created in the Content CMS."),
  "learning/cms": pending("Content CMS", "Author subjects, modules, lessons, videos and notes.", "The CMS schema and editor ship in the content phase."),
  "learning/question-bank": pending("Question Bank", "MCQ and coding question authoring.", "Ships with the assessment engine."),
  "learning/mock-tests": {
    title: "Mock Tests",
    description: "Every mock test attempt in the ecosystem.",
    table: "mock_tests",
    scope: "all",
    columns: MOCK_COLUMNS,
    sum: [{ key: "score", label: "Total score" }],
  },
  "learning/certificates": {
    title: "Certificates",
    description: "All certificates issued platform-wide.",
    table: "certificates",
    scope: "all",
    columns: CERT_COLUMNS,
  },
  "analytics/overview": {
    title: "Analytics",
    description: "Ecosystem-wide learning volume.",
    table: "learning_sessions",
    scope: "all",
    columns: LEARNING_COLUMNS,
    sum: [{ key: "minutes", label: "Ecosystem learning hours", divideBy: 60 }],
  },
  "analytics/placements": {
    title: "Placements",
    description: "All placements reported on the platform.",
    table: "placements",
    scope: "all",
    columns: PLACEMENT_COLUMNS,
    sum: [{ key: "package_lpa", label: "Total LPA" }],
  },
  "analytics/leaderboard": {
    title: "Leaderboard",
    description: "Top performers across all colleges.",
    table: "profiles",
    scope: "all",
    ownerColumn: "id",
    columns: STUDENT_COLUMNS,
  },
  "analytics/ai-insights": pending("AI Insights", "Ecosystem trends and risk detection.", "Generated by the AI gateway in the analytics phase."),
  "analytics/reports": pending("Reports", "Platform-wide PDF and Excel reports.", "Activates with the reporting engine."),
  "ai/generator": pending("AI Generator", "Generate curriculum, questions and insights with AI.", "Runs on the built-in AI gateway in the AI phase."),
  "business/subscriptions": pending("Subscriptions", "College subscription plans and billing.", "Needs the subscriptions table."),
  "business/roles": {
    title: "Roles & Access",
    description: "Role assignments across the ecosystem.",
    table: "user_roles",
    scope: "all",
    orderBy: "role",
    columns: [
      { key: "role", label: "Role" },
      { key: "user_id", label: "User" },
      { key: "college_id", label: "College" },
    ],
  } as ModuleDef,
  "innovation/ideas": {
    title: "Innovation",
    description: "Every startup idea pitched on StartSafe.",
    table: "startup_ideas",
    scope: "all",
    columns: IDEA_COLUMNS,
  },
  "system/notifications": pending("Notifications", "Platform announcements.", "Needs the notifications table."),
  "system/support": pending("Support", "Support tickets from colleges and students.", "Needs the support tickets table."),
  "system/health": {
    title: "System Health",
    description: "Live deployment status across the ecosystem.",
    table: "pilot_deployments",
    scope: "all",
    columns: [
      { key: "name", label: "Deployment" },
      { key: "status", label: "Status" },
      DATE,
    ],
  },
  "system/audit-logs": pending("Audit Logs", "Who changed what, when.", "Needs the audit log table and triggers."),
  "system/settings": pending("Settings", "Platform configuration.", "Needs the platform settings table."),
};
