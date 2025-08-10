export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      donation_receipts: {
        Row: {
          amount: number
          created_at: string | null
          donation_id: string | null
          donor_address: Json | null
          donor_name: string
          id: string
          receipt_date: string | null
          receipt_number: string
          receipt_sent: boolean | null
          receipt_sent_date: string | null
          tax_year: number
        }
        Insert: {
          amount: number
          created_at?: string | null
          donation_id?: string | null
          donor_address?: Json | null
          donor_name: string
          id?: string
          receipt_date?: string | null
          receipt_number: string
          receipt_sent?: boolean | null
          receipt_sent_date?: string | null
          tax_year: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          donation_id?: string | null
          donor_address?: Json | null
          donor_name?: string
          id?: string
          receipt_date?: string | null
          receipt_number?: string
          receipt_sent?: boolean | null
          receipt_sent_date?: string | null
          tax_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "donation_receipts_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean | null
          created_at: string | null
          currency: string | null
          donation_type: string | null
          donor_address: Json | null
          donor_email: string
          donor_name: string | null
          donor_phone: string | null
          id: string
          message: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          source: string | null
          tax_deductible: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          anonymous?: boolean | null
          created_at?: string | null
          currency?: string | null
          donation_type?: string | null
          donor_address?: Json | null
          donor_email: string
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          message?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          source?: string | null
          tax_deductible?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          anonymous?: boolean | null
          created_at?: string | null
          currency?: string | null
          donation_type?: string | null
          donor_address?: Json | null
          donor_email?: string
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          message?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          source?: string | null
          tax_deductible?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      donors: {
        Row: {
          address: Json | null
          created_at: string | null
          donation_count: number | null
          email: string
          first_donation_date: string | null
          first_name: string | null
          id: string
          last_donation_date: string | null
          last_name: string | null
          newsletter_subscribed: boolean | null
          phone: string | null
          preferred_contact_method: string | null
          tax_receipt_preference: string | null
          total_donated: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string | null
          donation_count?: number | null
          email: string
          first_donation_date?: string | null
          first_name?: string | null
          id?: string
          last_donation_date?: string | null
          last_name?: string | null
          newsletter_subscribed?: boolean | null
          phone?: string | null
          preferred_contact_method?: string | null
          tax_receipt_preference?: string | null
          total_donated?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string | null
          donation_count?: number | null
          email?: string
          first_donation_date?: string | null
          first_name?: string | null
          id?: string
          last_donation_date?: string | null
          last_name?: string | null
          newsletter_subscribed?: boolean | null
          phone?: string | null
          preferred_contact_method?: string | null
          tax_receipt_preference?: string | null
          total_donated?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          submitted_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          submitted_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      numerology_reports: {
        Row: {
          attitude_number: number
          birth_city: string
          birth_country: string
          birth_date: string
          birth_day_number: number
          birth_state: string
          birth_time: string
          created_at: string
          email_sent: boolean | null
          email_sent_at: string | null
          expression_number: number
          first_name: string
          id: string
          last_name: string
          life_path_number: number
          maturity_number: number
          middle_name: string | null
          payment_status: string | null
          personality_number: number
          report_generated_at: string
          soul_urge_number: number
          user_id: string
        }
        Insert: {
          attitude_number: number
          birth_city: string
          birth_country: string
          birth_date: string
          birth_day_number: number
          birth_state: string
          birth_time: string
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          expression_number: number
          first_name: string
          id?: string
          last_name: string
          life_path_number: number
          maturity_number: number
          middle_name?: string | null
          payment_status?: string | null
          personality_number: number
          report_generated_at?: string
          soul_urge_number: number
          user_id: string
        }
        Update: {
          attitude_number?: number
          birth_city?: string
          birth_country?: string
          birth_date?: string
          birth_day_number?: number
          birth_state?: string
          birth_time?: string
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          expression_number?: number
          first_name?: string
          id?: string
          last_name?: string
          life_path_number?: number
          maturity_number?: number
          middle_name?: string | null
          payment_status?: string | null
          personality_number?: number
          report_generated_at?: string
          soul_urge_number?: number
          user_id?: string
        }
        Relationships: []
      }
      pinterest_accounts: {
        Row: {
          access_token: string
          connected_at: string | null
          id: string
          pinterest_profile_image: string | null
          pinterest_user_id: string
          pinterest_username: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          connected_at?: string | null
          id?: string
          pinterest_profile_image?: string | null
          pinterest_user_id: string
          pinterest_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          connected_at?: string | null
          id?: string
          pinterest_profile_image?: string | null
          pinterest_user_id?: string
          pinterest_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pinterest_posts: {
        Row: {
          board_id: string | null
          created_at: string | null
          description: string | null
          error_message: string | null
          id: string
          image_url: string | null
          pinterest_account_id: string | null
          pinterest_pin_id: string | null
          posted_at: string | null
          scheduled_for: string
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          board_id?: string | null
          created_at?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          image_url?: string | null
          pinterest_account_id?: string | null
          pinterest_pin_id?: string | null
          posted_at?: string | null
          scheduled_for: string
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          board_id?: string | null
          created_at?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          image_url?: string | null
          pinterest_account_id?: string | null
          pinterest_pin_id?: string | null
          posted_at?: string | null
          scheduled_for?: string
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pinterest_posts_pinterest_account_id_fkey"
            columns: ["pinterest_account_id"]
            isOneToOne: false
            referencedRelation: "pinterest_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_alerts: {
        Row: {
          condition: string
          created_at: string
          email: string
          from_currency: string
          id: string
          is_active: boolean
          target_rate: number
          to_currency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          condition: string
          created_at?: string
          email: string
          from_currency: string
          id?: string
          is_active?: boolean
          target_rate: number
          to_currency: string
          updated_at?: string
          user_id: string
        }
        Update: {
          condition?: string
          created_at?: string
          email?: string
          from_currency?: string
          id?: string
          is_active?: boolean
          target_rate?: number
          to_currency?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
