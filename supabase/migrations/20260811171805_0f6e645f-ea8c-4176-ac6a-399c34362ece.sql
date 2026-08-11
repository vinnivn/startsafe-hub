-- ============ COURSES ============
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses readable" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;

INSERT INTO public.courses (code, name) VALUES
  ('BTECH','B.Tech'), ('BE','B.E.'), ('BCA','BCA'), ('BCOM','B.Com'), ('BBA','BBA'),
  ('BA','BA'), ('BSC','B.Sc'), ('BVA','BVA'), ('MBA','MBA'), ('MCA','MCA'), ('MCOM','M.Com')
ON CONFLICT (code) DO NOTHING;

-- ============ COLLEGES ============
ALTER TABLE public.colleges
  ADD COLUMN IF NOT EXISTS college_code text,
  ADD COLUMN IF NOT EXISTS placement_officer_name text,
  ADD COLUMN IF NOT EXISTS placement_officer_email text,
  ADD COLUMN IF NOT EXISTS placement_officer_phone text,
  ADD COLUMN IF NOT EXISTS courses text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.gen_college_code(_name text, _location text)
RETURNS text LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE base text; loc text; n int; candidate text;
BEGIN
  base := upper(regexp_replace(coalesce(_name,'COL'), '[^a-zA-Z]', '', 'g'));
  base := substr(base, 1, 5);
  IF base = '' THEN base := 'COL'; END IF;
  loc := upper(regexp_replace(coalesce(_location,'GEN'), '[^a-zA-Z]', '', 'g'));
  loc := substr(loc, 1, 3);
  IF loc = '' THEN loc := 'GEN'; END IF;
  n := 1;
  LOOP
    candidate := base || '-' || loc || '-' || lpad(n::text, 3, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.colleges WHERE college_code = candidate);
    n := n + 1;
  END LOOP;
  RETURN candidate;
END; $$;

CREATE OR REPLACE FUNCTION public.colleges_before_write()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.college_code IS NULL OR NEW.college_code = '' THEN
      NEW.college_code := public.gen_college_code(NEW.name, NEW.location);
    END IF;
  ELSE
    NEW.college_code := OLD.college_code; -- immutable
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS colleges_before_write ON public.colleges;
CREATE TRIGGER colleges_before_write BEFORE INSERT OR UPDATE ON public.colleges
  FOR EACH ROW EXECUTE FUNCTION public.colleges_before_write();

UPDATE public.colleges SET college_code = public.gen_college_code(name, location) WHERE college_code IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS colleges_college_code_key ON public.colleges(college_code);

CREATE POLICY "central updates colleges" ON public.colleges FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));
GRANT UPDATE ON public.colleges TO authenticated;

-- ============ PROFILES EXTRA ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS course text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS semester integer,
  ADD COLUMN IF NOT EXISTS section text,
  ADD COLUMN IF NOT EXISTS roll_number text,
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

-- ============ LEARNING PATHS ============
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  course_code text,
  duration_weeks integer NOT NULL DEFAULT 4,
  is_published boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_paths TO authenticated;
GRANT ALL ON public.learning_paths TO service_role;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "paths readable" ON public.learning_paths FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages paths" ON public.learning_paths FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));

CREATE TABLE IF NOT EXISTS public.path_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id uuid NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  title text NOT NULL,
  objectives text,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.path_weeks TO authenticated;
GRANT ALL ON public.path_weeks TO service_role;
ALTER TABLE public.path_weeks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weeks readable" ON public.path_weeks FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages weeks" ON public.path_weeks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));

CREATE TABLE IF NOT EXISTS public.week_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id uuid NOT NULL REFERENCES public.path_weeks(id) ON DELETE CASCADE,
  content_type text NOT NULL,
  title text NOT NULL,
  body text,
  url text,
  options jsonb,
  correct_answer text,
  position integer NOT NULL DEFAULT 0,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.week_content TO authenticated;
GRANT ALL ON public.week_content TO service_role;
ALTER TABLE public.week_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content readable" ON public.week_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages content" ON public.week_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));

CREATE TABLE IF NOT EXISTS public.path_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id uuid NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE,
  student_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.path_assignments TO authenticated;
GRANT ALL ON public.path_assignments TO service_role;
ALTER TABLE public.path_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments readable" ON public.path_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages assignments" ON public.path_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));

CREATE TABLE IF NOT EXISTS public.student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  path_id uuid REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  week_id uuid REFERENCES public.path_weeks(id) ON DELETE CASCADE,
  content_id uuid REFERENCES public.week_content(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_progress TO authenticated;
GRANT ALL ON public.student_progress TO service_role;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress readable by authenticated" ON public.student_progress FOR SELECT TO authenticated USING (true);
CREATE POLICY "students write own progress" ON public.student_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "students update own progress" ON public.student_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ MOCK TEST DEFINITIONS ============
CREATE TABLE IF NOT EXISTS public.mock_test_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructions text,
  duration_minutes integer NOT NULL DEFAULT 30,
  total_marks integer NOT NULL DEFAULT 10,
  passing_marks integer NOT NULL DEFAULT 4,
  difficulty text NOT NULL DEFAULT 'medium',
  max_attempts integer NOT NULL DEFAULT 3,
  max_violations integer NOT NULL DEFAULT 3,
  target_course text,
  target_semester integer,
  start_date timestamptz,
  end_date timestamptz,
  is_published boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_test_definitions TO authenticated;
GRANT ALL ON public.mock_test_definitions TO service_role;
ALTER TABLE public.mock_test_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tests readable" ON public.mock_test_definitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages tests" ON public.mock_test_definitions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));

CREATE TABLE IF NOT EXISTS public.mock_test_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.mock_test_definitions(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_index integer NOT NULL DEFAULT 0,
  marks integer NOT NULL DEFAULT 1,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_test_questions TO authenticated;
GRANT ALL ON public.mock_test_questions TO service_role;
ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions readable" ON public.mock_test_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages questions" ON public.mock_test_questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));

CREATE TABLE IF NOT EXISTS public.test_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.mock_test_definitions(id) ON DELETE CASCADE,
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_assignments TO authenticated;
GRANT ALL ON public.test_assignments TO service_role;
ALTER TABLE public.test_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "test assignments readable" ON public.test_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "central manages test assignments" ON public.test_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'central')) WITH CHECK (public.has_role(auth.uid(),'central'));

CREATE TABLE IF NOT EXISTS public.test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.mock_test_definitions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  attempt_number integer NOT NULL DEFAULT 1,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  incorrect_count integer NOT NULL DEFAULT 0,
  skipped_count integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  duration_seconds integer,
  tab_switch_count integer NOT NULL DEFAULT 0,
  fullscreen_exit_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.test_attempts TO authenticated;
GRANT ALL ON public.test_attempts TO service_role;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts readable by authenticated" ON public.test_attempts FOR SELECT TO authenticated USING (true);
CREATE POLICY "students insert own attempts" ON public.test_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "students update own attempts" ON public.test_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- enforce max attempts server side
CREATE OR REPLACE FUNCTION public.enforce_max_attempts()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE allowed int; used int;
BEGIN
  SELECT max_attempts INTO allowed FROM public.mock_test_definitions WHERE id = NEW.test_id;
  SELECT count(*) INTO used FROM public.test_attempts WHERE test_id = NEW.test_id AND user_id = NEW.user_id;
  IF allowed IS NOT NULL AND allowed > 0 AND used >= allowed THEN
    RAISE EXCEPTION 'Maximum attempts reached for this test';
  END IF;
  NEW.attempt_number := used + 1;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS enforce_max_attempts ON public.test_attempts;
CREATE TRIGGER enforce_max_attempts BEFORE INSERT ON public.test_attempts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_max_attempts();

-- ============ PROJECTS EXTRA ============
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS objectives text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS score integer,
  ADD COLUMN IF NOT EXISTS deadline date,
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

-- realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_paths;
ALTER PUBLICATION supabase_realtime ADD TABLE public.path_weeks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.week_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.path_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mock_test_definitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_attempts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;