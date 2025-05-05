export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          background: string
          goals: string
          referral_source: string
          status: string
          followup_sent: boolean
          followup_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          background: string
          goals: string
          referral_source: string
          status?: string
          followup_sent?: boolean
          followup_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          background?: string
          goals?: string
          referral_source?: string
          status?: string
          followup_sent?: boolean
          followup_date?: string | null
        }
      }
      registrations: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          payment_status: string
          payment_id: string | null
          amount: number | null
          program: string
          start_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          payment_status?: string
          payment_id?: string | null
          amount?: number | null
          program: string
          start_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          payment_status?: string
          payment_id?: string | null
          amount?: number | null
          program?: string
          start_date?: string | null
        }
      }
      submissions: {
        Row: {
          id: string
          created_at: string
          email: string
          answers: Json
          score: number
          results: Json
          email_sent: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          answers: Json
          score: number
          results: Json
          email_sent?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          answers?: Json
          score?: number
          results?: Json
          email_sent?: boolean
        }
      }
      admin_users: {
        Row: {
          id: number
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          role?: string
          created_at?: string
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
  }
}
