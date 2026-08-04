import { createFileRoute } from "@tanstack/react-router";
import { ModulePage, resolveModule } from "@/components/ModulePage";
import { STUDENT_MODULES } from "@/lib/modules";

export const Route = createFileRoute("/student/$")({
  component: StudentModuleRoute,
});

function StudentModuleRoute() {
  const { _splat } = Route.useParams();
  return <ModulePage def={resolveModule(STUDENT_MODULES, _splat ?? "")} />;
}
