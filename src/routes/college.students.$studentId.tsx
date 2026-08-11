import { createFileRoute } from "@tanstack/react-router";
import { StudentProfileView } from "@/components/StudentProfileView";

export const Route = createFileRoute("/college/students/$studentId")({
  head: () => ({
    meta: [
      { title: "Student Profile · StartSafe College" },
      { name: "description", content: "Complete readiness profile for a student on your campus." },
      { property: "og:title", content: "Student Profile · StartSafe College" },
      { property: "og:description", content: "Complete readiness profile for a student on your campus." },
    ],
  }),
  component: () => <StudentProfileView studentId={Route.useParams().studentId} basePath="/college" />,
});
