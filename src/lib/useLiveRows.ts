import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";

export type Scope = "own" | "college" | "all";

export interface ScopeInfo {
  userId: string | null;
  collegeId: string | null;
  collegeName: string | null;
  studentIds: string[];
  ready: boolean;
}

/** Resolves the current user's college and the student ids inside it. */
export function useScope(): ScopeInfo {
  const { user, loading } = useAuth();
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [collegeName, setCollegeName] = useState<string | null>(null);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    if (loading) return;
    if (!user) {
      setReady(true);
      return;
    }
    (async () => {
      const { data: role } = await supabase
        .from("user_roles")
        .select("college_id")
        .eq("user_id", user.id)
        .maybeSingle();
      const cid = role?.college_id ?? null;
      if (!alive) return;
      setCollegeId(cid);
      if (cid) {
        const [{ data: college }, { data: profs }] = await Promise.all([
          supabase.from("colleges").select("name").eq("id", cid).maybeSingle(),
          supabase.from("profiles").select("id").eq("college_id", cid),
        ]);
        if (!alive) return;
        setCollegeName(college?.name ?? null);
        setStudentIds((profs ?? []).map((p) => p.id));
      }
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [user?.id, loading]);

  return { userId: user?.id ?? null, collegeId, collegeName, studentIds, ready };
}

export interface LiveRowsOptions {
  table: string;
  select?: string;
  scope?: Scope;
  /** column holding the owning user id, defaults to user_id */
  ownerColumn?: string;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
}

export interface LiveRows<T> {
  rows: T[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Fetches rows from a table and keeps them in sync via Supabase Realtime.
 * Scope decides whether rows are limited to the signed-in user, their college,
 * or the whole ecosystem.
 */
export function useLiveRows<T = Record<string, unknown>>(opts: LiveRowsOptions): LiveRows<T> {
  const {
    table,
    select = "*",
    scope = "all",
    ownerColumn = "user_id",
    orderBy = "created_at",
    ascending = false,
    limit = 500,
  } = opts;
  const { userId, studentIds, ready } = useScope();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const idKey = useMemo(() => studentIds.join(","), [studentIds]);

  useEffect(() => {
    if (!ready) return;
    let alive = true;

    const load = async () => {
      let query = supabase.from(table as never).select(select).limit(limit);
      if (scope === "own") {
        if (!userId) {
          setRows([]);
          setLoading(false);
          return;
        }
        query = query.eq(ownerColumn, userId);
      } else if (scope === "college") {
        const ids = studentIds.length ? studentIds : ["00000000-0000-0000-0000-000000000000"];
        query = query.in(ownerColumn, ids);
      }
      const { data, error: err } = await query.order(orderBy, { ascending });
      if (!alive) return;
      setError(err ? err.message : null);
      setRows((data as T[]) ?? []);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel(`live-${table}-${scope}-${tick}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => load())
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [table, select, scope, ownerColumn, orderBy, ascending, limit, userId, idKey, ready, tick]);

  return { rows, loading, error, reload: () => setTick((t) => t + 1) };
}
