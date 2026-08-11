import { createFileRoute } from "@tanstack/react-router";
import { StudentProfileView } from "@/components/StudentProfileView";

export const Route = createFileRoute("/central/students/$studentId")({
  head: () => ({
    meta: [
      { title: "Student Profile · StartSafe Central" },
      { name: "description", content: "Full student readiness profile across learning, tests, projects and certificates." },
      { property: "og:title", content: "Student Profile · StartSafe Central" },
      { property: "og:description", content: "Full student readiness profile across learning, tests, projects and certificates." },
    ],
  }),
  component: () => <StudentProfileView studentId={Route.useParams().studentId} basePath="/central" />,
});
