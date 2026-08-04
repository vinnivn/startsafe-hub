import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { ADMIN_NAV } from "@/lib/nav";

export const Route = createFileRoute("/central")({
  component: () => <PortalLayout role="central" nav={ADMIN_NAV} />,
});
