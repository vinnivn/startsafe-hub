import { createFileRoute } from "@tanstack/react-router";
import { CollegeReportView } from "@/components/CollegeReportView";

export const Route = createFileRoute("/central/colleges/$collegeId")({
  head: () => ({
    meta: [
      { title: "College Report · StartSafe Central" },
      { name: "description", content: "Institution-level readiness, student rankings and project analytics." },
      { property: "og:title", content: "College Report · StartSafe Central" },
      { property: "og:description", content: "Institution-level readiness, student rankings and project analytics." },
    ],
  }),
  component: () => <CollegeReportView collegeId={Route.useParams().collegeId} basePath="/central" />,
});
