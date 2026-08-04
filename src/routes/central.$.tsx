import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, resolveModule } from "@/components/ModulePage";
import { ADMIN_MODULES } from "@/lib/modules";

export const Route = createFileRoute("/central/$")({
  component: CentralModuleRoute,
});

function CentralModuleRoute() {
  const { _splat } = Route.useParams();
  return <ModulePage def={resolveModule(ADMIN_MODULES, _splat ?? "")} />;
}
