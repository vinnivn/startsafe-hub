import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, resolveModule } from "@/components/ModulePage";
import { COLLEGE_MODULES } from "@/lib/modules";

export const Route = createFileRoute("/college/$")({
  component: CollegeModuleRoute,
});

function CollegeModuleRoute() {
  const { _splat } = Route.useParams();
  return <ModulePage def={resolveModule(COLLEGE_MODULES, _splat ?? "")} />;
}
