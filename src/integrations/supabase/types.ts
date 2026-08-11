export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          cert_type: Database["public"]["Enums"]["cert_type"]
          created_at: string
          id: string
          title: string
          user_id: string
          verification_id: string
        }
        Insert: {
          cert_type?: Database["public"]["Enums"]["cert_type"]
          created_at?: string
          id?: string
          title: string
          user_id: string
          verification_id?: string
        }
        Update: {
          cert_type?: Database["public"]["Enums"]["cert_type"]
          created_at?: string
          id?: string
          title?: string
          user_id?: string
          verification_id?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          college_code: string | null
          courses: string[]
          created_at: string
          id: string
          is_archived: boolean
          location: string | null
          name: string
          placement_officer_email: string | null
          placement_officer_name: string | null
          placement_officer_phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          college_code?: string | null
          courses?: string[]
          created_at?: string
          id?: string
          is_archived?: boolean
          location?: string | null
          name: string
          placement_officer_email?: string | null
          placement_officer_name?: string | null
          placement_officer_phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          college_code?: string | null
          courses?: string[]
          created_at?: string
          id?: string
          is_archived?: boolean
          location?: string | null
          name?: string
          placement_officer_email?: string | null
          placement_officer_name?: string | null
          placement_officer_phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          industry: string | null
          is_hiring: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry?: string | null
          is_hiring?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string | null
          is_hiring?: boolean
          name?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          company_name: string
          created_at: string
          duration_months: number | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          duration_months?: number | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          duration_months?: number | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          course_code: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_weeks: number
          id: string
          is_archived: boolean
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          course_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_weeks?: number
          id?: string
          is_archived?: boolean
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          course_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_weeks?: number
          id?: string
          is_archived?: boolean
          is_published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          created_at: string
          id: string
          minutes: number
          topic: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          minutes?: number
          topic: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          minutes?: number
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      mock_test_definitions: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string
          duration_minutes: number
          end_date: string | null
          id: string
          instructions: string | null
          is_archived: boolean
          is_published: boolean
          max_attempts: number
          max_violations: number
          passing_marks: number
          start_date: string | null
          target_course: string | null
          target_semester: number | null
          title: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string
          duration_minutes?: number
          end_date?: string | null
          id?: string
          instructions?: string | null
          is_archived?: boolean
          is_published?: boolean
          max_attempts?: number
          max_violations?: number
          passing_marks?: number
          start_date?: string | null
          target_course?: string | null
          target_semester?: number | null
          title: string
          total_marks?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string
          duration_minutes?: number
          end_date?: string | null
          id?: string
          instructions?: string | null
          is_archived?: boolean
          is_published?: boolean
          max_attempts?: number
          max_violations?: number
          passing_marks?: number
          start_date?: string | null
          target_course?: string | null
          target_semester?: number | null
          title?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: []
      }
      mock_test_questions: {
        Row: {
          correct_index: number
          created_at: string
          id: string
          marks: number
          options: Json
          position: number
          question: string
          test_id: string
        }
        Insert: {
          correct_index?: number
          created_at?: string
          id?: string
          marks?: number
          options?: Json
          position?: number
          question: string
          test_id: string
        }
        Update: {
          correct_index?: number
          created_at?: string
          id?: string
          marks?: number
          options?: Json
          position?: number
          question?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "mock_test_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_tests: {
        Row: {
          created_at: string
          id: string
          score: number
          topic: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          score?: number
          topic: string
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          score?: number
          topic?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      path_assignments: {
        Row: {
          college_id: string | null
          created_at: string
          id: string
          is_active: boolean
          path_id: string
          student_id: string | null
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          path_id: string
          student_id?: string | null
        }
        Update: {
          college_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          path_id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "path_assignments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "path_assignments_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      path_weeks: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean
          objectives: string | null
          path_id: string
          title: string
          week_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean
          objectives?: string | null
          path_id: string
          title: string
          week_number: number
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean
          objectives?: string | null
          path_id?: string
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "path_weeks_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_deployments: {
        Row: {
          college_id: string | null
          created_at: string
          id: string
          name: string
          status: string
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          id?: string
          name: string
          status?: string
        }
        Update: {
          college_id?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_deployments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      placements: {
        Row: {
          company_id: string | null
          company_name: string
          created_at: string
          id: string
          package_lpa: number | null
          role: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          company_name: string
          created_at?: string
          id?: string
          package_lpa?: number | null
          role: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          company_name?: string
          created_at?: string
          id?: string
          package_lpa?: number | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "placements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          career_track: Database["public"]["Enums"]["career_track"] | null
          college_id: string | null
          course: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          github_username: string | null
          id: string
          is_archived: boolean
          roll_number: string | null
          section: string | null
          semester: number | null
        }
        Insert: {
          avatar_url?: string | null
          career_track?: Database["public"]["Enums"]["career_track"] | null
          college_id?: string | null
          course?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          github_username?: string | null
          id: string
          is_archived?: boolean
          roll_number?: string | null
          section?: string | null
          semester?: number | null
        }
        Update: {
          avatar_url?: string | null
          career_track?: Database["public"]["Enums"]["career_track"] | null
          college_id?: string | null
          course?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          github_username?: string | null
          id?: string
          is_archived?: boolean
          roll_number?: string | null
          section?: string | null
          semester?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          deadline: string | null
          demo_url: string | null
          description: string | null
          github_url: string | null
          id: string
          is_archived: boolean
          objectives: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          review_notes: string | null
          score: number | null
          status: string
          tech_stack: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          is_archived?: boolean
          objectives?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          review_notes?: string | null
          score?: number | null
          status?: string
          tech_stack?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          is_archived?: boolean
          objectives?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          review_notes?: string | null
          score?: number | null
          status?: string
          tech_stack?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      startup_ideas: {
        Row: {
          created_at: string
          id: string
          pitch: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pitch?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pitch?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          content_id: string | null
          created_at: string
          id: string
          path_id: string | null
          status: string
          user_id: string
          week_id: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          id?: string
          path_id?: string | null
          status?: string
          user_id: string
          week_id?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string
          id?: string
          path_id?: string | null
          status?: string
          user_id?: string
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "week_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "path_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      test_assignments: {
        Row: {
          college_id: string | null
          created_at: string
          id: string
          is_active: boolean
          test_id: string
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          test_id: string
        }
        Update: {
          college_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_assignments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_assignments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "mock_test_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          correct_count: number
          created_at: string
          duration_seconds: number | null
          fullscreen_exit_count: number
          id: string
          incorrect_count: number
          score: number
          skipped_count: number
          started_at: string
          status: string
          submitted_at: string | null
          tab_switch_count: number
          test_id: string
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          attempt_number?: number
          correct_count?: number
          created_at?: string
          duration_seconds?: number | null
          fullscreen_exit_count?: number
          id?: string
          incorrect_count?: number
          score?: number
          skipped_count?: number
          started_at?: string
          status?: string
          submitted_at?: string | null
          tab_switch_count?: number
          test_id: string
          total?: number
          user_id: string
        }
        Update: {
          answers?: Json
          attempt_number?: number
          correct_count?: number
          created_at?: string
          duration_seconds?: number | null
          fullscreen_exit_count?: number
          id?: string
          incorrect_count?: number
          score?: number
          skipped_count?: number
          started_at?: string
          status?: string
          submitted_at?: string | null
          tab_switch_count?: number
          test_id?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "mock_test_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          college_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          college_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          college_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      week_content: {
        Row: {
          body: string | null
          content_type: string
          correct_answer: string | null
          created_at: string
          id: string
          is_archived: boolean
          options: Json | null
          position: number
          title: string
          url: string | null
          week_id: string
        }
        Insert: {
          body?: string | null
          content_type: string
          correct_answer?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          options?: Json | null
          position?: number
          title: string
          url?: string | null
          week_id: string
        }
        Update: {
          body?: string | null
          content_type?: string
          correct_answer?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          options?: Json | null
          position?: number
          title?: string
          url?: string | null
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "week_content_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "path_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gen_college_code: {
        Args: { _location: string; _name: string }
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "college" | "central"
      career_track:
        | "software_engineering"
        | "artificial_intelligence"
        | "cyber_security"
        | "web_development"
        | "data_science"
        | "cloud_computing"
        | "startup"
        | "research"
        | "higher_studies"
        | "core_engineering"
      cert_type:
        | "programming"
        | "project"
        | "innovation"
        | "interview"
        | "industry"
        | "startsafe"
      project_type:
        | "mini"
        | "major"
        | "startup"
        | "industry"
        | "research"
        | "hackathon"
        | "open_source"
        | "prototype"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "college", "central"],
      career_track: [
        "software_engineering",
        "artificial_intelligence",
        "cyber_security",
        "web_development",
        "data_science",
        "cloud_computing",
        "startup",
        "research",
        "higher_studies",
        "core_engineering",
      ],
      cert_type: [
        "programming",
        "project",
        "innovation",
        "interview",
        "industry",
        "startsafe",
      ],
      project_type: [
        "mini",
        "major",
        "startup",
        "industry",
        "research",
        "hackathon",
        "open_source",
        "prototype",
      ],
    },
  },
} as const
