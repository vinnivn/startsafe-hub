
-- ==== ENUMS ====
CREATE TYPE public.app_role AS ENUM ('student', 'college', 'central');
CREATE TYPE public.career_track AS ENUM (
  'software_engineering','artificial_intelligence','cyber_security','web_development',
  'data_science','cloud_computing','startup','research','higher_studies','core_engineering'
);
CREATE TYPE public.project_type AS ENUM ('mini','major','startup','industry','research','hackathon','open_source','prototype');
CREATE TYPE public.cert_type AS ENUM ('programming','project','innovation','interview','industry','startsafe');

-- ==== COLLEGES ====
CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  location text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.colleges TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.colleges TO authenticated;
GRANT ALL ON public.colleges TO service_role;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "colleges readable by all" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "authenticated can insert colleges" ON public.colleges FOR INSERT TO authenticated WITH CHECK (true);

-- ==== PROFILES ====
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  college_id uuid REFERENCES public.colleges(id) ON DELETE SET NULL,
  career_track public.career_track,
  github_username text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "users manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ==== USER ROLES ====
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  college_id uuid REFERENCES public.colleges(id) ON DELETE SET NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;

-- ==== ACTIVITY TABLES ====
CREATE TABLE public.mock_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mock_tests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_tests TO authenticated;
GRANT ALL ON public.mock_tests TO service_role;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mock_tests readable" ON public.mock_tests FOR SELECT USING (true);
CREATE POLICY "users insert own mock_tests" ON public.mock_tests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  project_type public.project_type NOT NULL DEFAULT 'mini',
  github_url text,
  demo_url text,
  tech_stack text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects readable" ON public.projects FOR SELECT USING (true);
CREATE POLICY "users manage own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  cert_type public.cert_type NOT NULL DEFAULT 'programming',
  verification_id text NOT NULL DEFAULT concat('SS-', substring(gen_random_uuid()::text, 1, 8)),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates readable" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "users insert own certs" ON public.certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  minutes int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.learning_sessions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_sessions TO authenticated;
GRANT ALL ON public.learning_sessions TO service_role;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "learning_sessions readable" ON public.learning_sessions FOR SELECT USING (true);
CREATE POLICY "users insert own learning" ON public.learning_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  industry text,
  is_hiring boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies readable" ON public.companies FOR SELECT USING (true);
CREATE POLICY "authenticated insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE public.placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  role text NOT NULL,
  package_lpa numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.placements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.placements TO authenticated;
GRANT ALL ON public.placements TO service_role;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "placements readable" ON public.placements FOR SELECT USING (true);
CREATE POLICY "users insert own placement" ON public.placements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  role text NOT NULL,
  duration_months int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.internships TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.internships TO authenticated;
GRANT ALL ON public.internships TO service_role;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "internships readable" ON public.internships FOR SELECT USING (true);
CREATE POLICY "users insert own internship" ON public.internships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.startup_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  pitch text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.startup_ideas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.startup_ideas TO authenticated;
GRANT ALL ON public.startup_ideas TO service_role;
ALTER TABLE public.startup_ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "startup_ideas readable" ON public.startup_ideas FOR SELECT USING (true);
CREATE POLICY "users insert own idea" ON public.startup_ideas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.pilot_deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid REFERENCES public.colleges(id) ON DELETE SET NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pilot_deployments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pilot_deployments TO authenticated;
GRANT ALL ON public.pilot_deployments TO service_role;
ALTER TABLE public.pilot_deployments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pilots readable" ON public.pilot_deployments FOR SELECT USING (true);
CREATE POLICY "authenticated insert pilots" ON public.pilot_deployments FOR INSERT TO authenticated WITH CHECK (true);

-- ==== TRIGGER: auto-create profile & role on signup ====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role public.app_role;
  _college_id uuid;
  _college_name text;
BEGIN
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.app_role;
  _college_name := NEW.raw_user_meta_data->>'college_name';

  IF _college_name IS NOT NULL AND length(_college_name) > 0 THEN
    INSERT INTO public.colleges(name) VALUES (_college_name)
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id INTO _college_id;
  END IF;

  INSERT INTO public.profiles(id, full_name, email, college_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    _college_id
  );

  INSERT INTO public.user_roles(user_id, role, college_id) VALUES (NEW.id, _role, _college_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==== REALTIME ====
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.colleges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mock_tests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.placements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.internships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.startup_ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pilot_deployments;
