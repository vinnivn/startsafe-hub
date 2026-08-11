import { createFileRoute } from "@tanstack/react-router";
import { CollegeReportView } from "@/components/CollegeReportView";

export const Route = createFileRoute("/college/colleges/$collegeId")({
  head: () => ({
    meta: [
      { title: "Campus Report · StartSafe College" },
      { name: "description", content: "Campus readiness, module analytics and student rankings." },
      { property: "og:title", content: "Campus Report · StartSafe College" },
      { property: "og:description", content: "Campus readiness, module analytics and student rankings." },
    ],
  }),
  component: () => <CollegeReportView collegeId={Route.useParams().collegeId} basePath="/college" />,
});
