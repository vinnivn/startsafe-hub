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
          created_at: string
          id: string
          location: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
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
          created_at: string
          email: string
          full_name: string
          github_username: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          career_track?: Database["public"]["Enums"]["career_track"] | null
          college_id?: string | null
          created_at?: string
          email: string
          full_name: string
          github_username?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          career_track?: Database["public"]["Enums"]["career_track"] | null
          college_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          github_username?: string | null
          id?: string
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
          demo_url: string | null
          description: string | null
          github_url: string | null
          id: string
          project_type: Database["public"]["Enums"]["project_type"]
          tech_stack: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"]
          tech_stack?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          id?: string
          project_type?: Database["public"]["Enums"]["project_type"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
