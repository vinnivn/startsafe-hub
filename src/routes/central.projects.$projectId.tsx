import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailView } from "@/components/ProjectDetailView";

export const Route = createFileRoute("/central/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Review · StartSafe Central" },
      { name: "description", content: "Review student projects, score them and publish feedback." },
      { property: "og:title", content: "Project Review · StartSafe Central" },
      { property: "og:description", content: "Review student projects, score them and publish feedback." },
    ],
  }),
  component: () => <ProjectDetailView projectId={Route.useParams().projectId} basePath="/central" canReview />,
});
