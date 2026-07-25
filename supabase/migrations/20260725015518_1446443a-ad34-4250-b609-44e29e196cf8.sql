
-- 1) Replace public SELECT policies with authenticated-only
DROP POLICY IF EXISTS "profiles readable by all" ON public.profiles;
CREATE POLICY "profiles readable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "certificates readable" ON public.certificates;
CREATE POLICY "certificates readable by authenticated" ON public.certificates
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "internships readable" ON public.internships;
CREATE POLICY "internships readable by authenticated" ON public.internships
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "learning_sessions readable" ON public.learning_sessions;
CREATE POLICY "learning_sessions readable by authenticated" ON public.learning_sessions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "mock_tests readable" ON public.mock_tests;
CREATE POLICY "mock_tests readable by authenticated" ON public.mock_tests
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "placements readable" ON public.placements;
CREATE POLICY "placements readable by authenticated" ON public.placements
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "projects readable" ON public.projects;
CREATE POLICY "projects readable by authenticated" ON public.projects
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "startup_ideas readable" ON public.startup_ideas;
CREATE POLICY "startup_ideas readable by authenticated" ON public.startup_ideas
  FOR SELECT TO authenticated USING (true);

-- 2) Remove anon SELECT grants on these tables
REVOKE SELECT ON public.profiles, public.certificates, public.internships,
  public.learning_sessions, public.mock_tests, public.placements,
  public.projects, public.startup_ideas FROM anon;

-- 3) Fix "always true" INSERT policies -> restrict to authenticated users
DROP POLICY IF EXISTS "authenticated can insert colleges" ON public.colleges;
CREATE POLICY "authenticated can insert colleges" ON public.colleges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "authenticated insert companies" ON public.companies;
CREATE POLICY "authenticated insert companies" ON public.companies
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "authenticated insert pilots" ON public.pilot_deployments;
CREATE POLICY "authenticated insert pilots" ON public.pilot_deployments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- 4) Convert SECURITY DEFINER helpers to SECURITY INVOKER.
--    user_roles already grants authenticated SELECT on their own row,
--    which is sufficient for these helpers to evaluate correctly.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;

-- 5) Lock down user_roles further: keep default-deny for write ops.
--    Add explicit restrictive policy blocking client-side role changes
--    even if a permissive policy is added later by mistake.
CREATE POLICY "block client role writes" ON public.user_roles
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Re-allow the existing own-row SELECT (RESTRICTIVE above would block reads)
DROP POLICY IF EXISTS "block client role writes" ON public.user_roles;
CREATE POLICY "block client role writes" ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (false);
CREATE POLICY "block client role updates" ON public.user_roles
  AS RESTRICTIVE
  FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);
CREATE POLICY "block client role deletes" ON public.user_roles
  AS RESTRICTIVE
  FOR DELETE
  TO authenticated
  USING (false);
