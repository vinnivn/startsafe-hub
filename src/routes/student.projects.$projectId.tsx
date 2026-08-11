import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailView } from "@/components/ProjectDetailView";

export const Route = createFileRoute("/student/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "My Project · StartSafe" },
      { name: "description", content: "Track your project status, reviewer feedback and score." },
      { property: "og:title", content: "My Project · StartSafe" },
      { property: "og:description", content: "Track your project status, reviewer feedback and score." },
    ],
  }),
  component: () => <ProjectDetailView projectId={Route.useParams().projectId} basePath="/student" canReview={false} />,
});
