import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { COLLEGE_NAV } from "@/lib/nav";

export const Route = createFileRoute("/college")({
  component: () => <PortalLayout role="college" nav={COLLEGE_NAV} />,
});
