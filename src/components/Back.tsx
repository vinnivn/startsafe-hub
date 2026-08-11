import { useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

/**
 * Global back control. Uses real browser history so filters and scroll on the
 * previous page are preserved. Falls back to `fallbackTo` on a cold entry.
 */
export function Back({ label = "Back", fallbackTo }: { label?: string; fallbackTo?: string }) {
  const router = useRouter();
  const canGoBack = typeof window !== "undefined" && window.history.length > 1;

  if (!canGoBack && fallbackTo) {
    return (
      <Link
        to={fallbackTo as "/"}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (canGoBack) router.history.back();
        else if (fallbackTo) router.navigate({ to: fallbackTo as "/" });
      }}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-4"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
}
