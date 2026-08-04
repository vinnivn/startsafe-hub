import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { STUDENT_NAV } from "@/lib/nav";

export const Route = createFileRoute("/student")({
  component: () => <PortalLayout role="student" nav={STUDENT_NAV} />,
});
