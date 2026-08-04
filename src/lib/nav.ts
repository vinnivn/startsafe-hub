export interface NavItem {
  label: string;
  /** Full route path, e.g. /student/learning/overview */
  to: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const STUDENT_NAV: NavGroup[] = [
  { group: "Overview", items: [{ label: "Dashboard", to: "/student" }] },
  {
    group: "Learning",
    items: [
      { label: "Learning Paths", to: "/student/learning/overview" },
      { label: "Semester 3", to: "/student/learning/semester-3" },
      { label: "Semester 4", to: "/student/learning/semester-4" },
      { label: "Semester 5", to: "/student/learning/semester-5" },
      { label: "Semester 6", to: "/student/learning/semester-6" },
      { label: "Semester 7", to: "/student/learning/semester-7" },
      { label: "Semester 8", to: "/student/learning/semester-8" },
    ],
  },
  {
    group: "Assessments",
    items: [
      { label: "Mock Tests", to: "/student/assessments/mock-tests" },
      { label: "Coding Practice", to: "/student/assessments/coding-practice" },
      { label: "Interview Preparation", to: "/student/assessments/interview-prep" },
    ],
  },
  {
    group: "Innovation",
    items: [
      { label: "Projects", to: "/student/innovation/projects" },
      { label: "Certifications", to: "/student/innovation/certifications" },
    ],
  },
  {
    group: "Growth",
    items: [
      { label: "Analytics", to: "/student/growth/analytics" },
      { label: "Leaderboard", to: "/student/growth/leaderboard" },
    ],
  },
  { group: "AI", items: [{ label: "AI Mentor", to: "/student/ai/mentor" }] },
  { group: "Account", items: [{ label: "Profile", to: "/student/account/profile" }] },
];

export const COLLEGE_NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", to: "/college" },
      { label: "Command Center", to: "/college/command-center" },
    ],
  },
  {
    group: "Analytics",
    items: [
      { label: "Visual Analytics", to: "/college/analytics/visual" },
      { label: "AI Insights", to: "/college/analytics/ai-insights" },
    ],
  },
  {
    group: "Institution",
    items: [
      { label: "College Profile", to: "/college/institution/profile" },
      { label: "Departments", to: "/college/institution/departments" },
      { label: "Sections", to: "/college/institution/sections" },
      { label: "Semesters", to: "/college/institution/semesters" },
    ],
  },
  {
    group: "Students",
    items: [
      { label: "Student Database", to: "/college/students/database" },
      { label: "Placement Readiness", to: "/college/students/placement-readiness" },
      { label: "Student Progress", to: "/college/students/progress" },
      { label: "Topper Dashboard", to: "/college/students/toppers" },
      { label: "Student Rankings", to: "/college/students/rankings" },
    ],
  },
  {
    group: "Learning",
    items: [
      { label: "Learning Analytics", to: "/college/learning/analytics" },
      { label: "Learning Paths", to: "/college/learning/paths" },
      { label: "Modules & Lessons", to: "/college/learning/modules" },
      { label: "Cheat Sheets", to: "/college/learning/cheat-sheets" },
    ],
  },
  {
    group: "Assessments",
    items: [
      { label: "MCQ Performance", to: "/college/assessments/mcq" },
      { label: "Coding Performance", to: "/college/assessments/coding" },
      { label: "Assignments", to: "/college/assessments/assignments" },
      { label: "Mini Projects", to: "/college/assessments/mini-projects" },
      { label: "Mock Tests", to: "/college/assessments/mock-tests" },
      { label: "Interview Analytics", to: "/college/assessments/interview" },
    ],
  },
  {
    group: "Innovation",
    items: [
      { label: "Certifications", to: "/college/innovation/certifications" },
      { label: "Innovation", to: "/college/innovation/ideas" },
    ],
  },
  {
    group: "Placements",
    items: [
      { label: "Company Readiness", to: "/college/placements/company-readiness" },
      { label: "Placement Drives", to: "/college/placements/drives" },
    ],
  },
  {
    group: "Reports",
    items: [
      { label: "Weekly Reports", to: "/college/reports/weekly" },
      { label: "Reports Studio", to: "/college/reports/studio" },
      { label: "Download Center", to: "/college/reports/downloads" },
    ],
  },
  {
    group: "Workspace",
    items: [
      { label: "Alerts", to: "/college/workspace/alerts" },
      { label: "Notifications", to: "/college/workspace/notifications" },
      { label: "Mentor Dashboard", to: "/college/workspace/mentor" },
      { label: "Settings", to: "/college/workspace/settings" },
    ],
  },
];

export const ADMIN_NAV: NavGroup[] = [
  {
    group: "Dashboard",
    items: [
      { label: "Central Intelligence", to: "/central" },
      { label: "Command Center", to: "/central/command-center" },
    ],
  },
  {
    group: "Ecosystem",
    items: [
      { label: "Colleges", to: "/central/ecosystem/colleges" },
      { label: "Students", to: "/central/ecosystem/students" },
      { label: "Companies", to: "/central/ecosystem/companies" },
      { label: "Faculty", to: "/central/ecosystem/faculty" },
    ],
  },
  {
    group: "Learning Platform",
    items: [
      { label: "Courses", to: "/central/learning/courses" },
      { label: "Learning Paths", to: "/central/learning/paths" },
      { label: "Content CMS", to: "/central/learning/cms" },
      { label: "Question Bank", to: "/central/learning/question-bank" },
      { label: "Mock Tests", to: "/central/learning/mock-tests" },
      { label: "Certificates", to: "/central/learning/certificates" },
    ],
  },
  {
    group: "Analytics",
    items: [
      { label: "Analytics", to: "/central/analytics/overview" },
      { label: "Placements", to: "/central/analytics/placements" },
      { label: "Leaderboard", to: "/central/analytics/leaderboard" },
      { label: "AI Insights", to: "/central/analytics/ai-insights" },
      { label: "Reports", to: "/central/analytics/reports" },
    ],
  },
  { group: "AI Studio", items: [{ label: "AI Generator", to: "/central/ai/generator" }] },
  {
    group: "Business",
    items: [
      { label: "Subscriptions", to: "/central/business/subscriptions" },
      { label: "Roles & Access", to: "/central/business/roles" },
    ],
  },
  { group: "Innovation", items: [{ label: "Innovation", to: "/central/innovation/ideas" }] },
  {
    group: "System",
    items: [
      { label: "Notifications", to: "/central/system/notifications" },
      { label: "Support", to: "/central/system/support" },
      { label: "System Health", to: "/central/system/health" },
      { label: "Audit Logs", to: "/central/system/audit-logs" },
      { label: "Settings", to: "/central/system/settings" },
    ],
  },
];
