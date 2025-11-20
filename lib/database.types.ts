export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'consultant' | 'client'
          avatar_url: string | null
          phone: string | null
          organization: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'consultant' | 'client'
          avatar_url?: string | null
          phone?: string | null
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'consultant' | 'client'
          avatar_url?: string | null
          phone?: string | null
          organization?: string | null
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          client_id: string
          consultant_id: string | null
          title: string
          status: 'draft' | 'in_progress' | 'completed' | 'archived'
          current_step: number
          data: Json
          ai_analysis: Json | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          consultant_id?: string | null
          title: string
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          current_step?: number
          data?: Json
          ai_analysis?: Json | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          consultant_id?: string | null
          title?: string
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          current_step?: number
          data?: Json
          ai_analysis?: Json | null
          updated_at?: string
          completed_at?: string | null
        }
      }
      assessment_responses: {
        Row: {
          id: string
          assessment_id: string
          section: string
          question_id: string
          response: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          section: string
          question_id: string
          response: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          section?: string
          question_id?: string
          response?: Json
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          assessment_id: string
          generated_by: string
          content: Json
          pdf_url: string | null
          version: number
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          generated_by: string
          content: Json
          pdf_url?: string | null
          version?: number
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          generated_by?: string
          content?: Json
          pdf_url?: string | null
          version?: number
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'consultant' | 'client'
      assessment_status: 'draft' | 'in_progress' | 'completed' | 'archived'
    }
  }
}
