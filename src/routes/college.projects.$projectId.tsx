import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailView } from "@/components/ProjectDetailView";

export const Route = createFileRoute("/college/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Review · StartSafe College" },
      { name: "description", content: "Review and score student project submissions from your campus." },
      { property: "og:title", content: "Project Review · StartSafe College" },
      { property: "og:description", content: "Review and score student project submissions from your campus." },
    ],
  }),
  component: () => <ProjectDetailView projectId={Route.useParams().projectId} basePath="/college" canReview />,
});
