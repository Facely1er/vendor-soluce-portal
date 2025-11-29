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
      vs_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          company: string | null
          role: string | null
          company_size: string | null
          industry: string | null
          tour_completed: boolean | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          onboarding_data: Json | null
          created_at: string
          updated_at: string
          is_first_login: boolean | null
          account_type: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          role?: string | null
          company_size?: string | null
          industry?: string | null
          tour_completed?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_data?: Json | null
          created_at?: string
          updated_at?: string
          is_first_login?: boolean | null
          account_type?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          company?: string | null
          role?: string | null
          company_size?: string | null
          industry?: string | null
          tour_completed?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_data?: Json | null
          created_at?: string
          updated_at?: string
          is_first_login?: boolean | null
        }
      }
      vs_vendors: {
        Row: {
          id: string
          user_id: string
          name: string
          industry: string | null
          website: string | null
          contact_email: string | null
          risk_score: number | null
          risk_level: string | null
          compliance_status: string | null
          last_assessment_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          industry?: string | null
          website?: string | null
          contact_email?: string | null
          risk_score?: number | null
          risk_level?: string | null
          compliance_status?: string | null
          last_assessment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          industry?: string | null
          website?: string | null
          contact_email?: string | null
          risk_score?: number | null
          risk_level?: string | null
          compliance_status?: string | null
          last_assessment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_sbom_analyses: {
        Row: {
          id: string
          user_id: string
          vendor_id: string | null
          filename: string
          file_type: string
          total_components: number | null
          total_vulnerabilities: number | null
          risk_score: number | null
          analysis_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor_id?: string | null
          filename: string
          file_type: string
          total_components?: number | null
          total_vulnerabilities?: number | null
          risk_score?: number | null
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vendor_id?: string | null
          filename?: string
          file_type?: string
          total_components?: number | null
          total_vulnerabilities?: number | null
          risk_score?: number | null
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_supply_chain_assessments: {
        Row: {
          id: string
          user_id: string
          vendor_id: string | null
          assessment_name: string | null
          overall_score: number | null
          section_scores: Json | null
          answers: Json | null
          status: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor_id?: string | null
          assessment_name?: string | null
          overall_score?: number | null
          section_scores?: Json | null
          answers?: Json | null
          status?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vendor_id?: string | null
          assessment_name?: string | null
          overall_score?: number | null
          section_scores?: Json | null
          answers?: Json | null
          status?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_contact_submissions: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          company: string | null
          topic: string | null
          message: string
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          company?: string | null
          topic?: string | null
          message: string
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          topic?: string | null
          message?: string
          status?: string | null
          created_at?: string
        }
      }
      vs_assessment_frameworks: {
        Row: {
          id: string
          name: string
          description: string | null
          framework_type: string
          question_count: number | null
          estimated_time: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          framework_type: string
          question_count?: number | null
          estimated_time?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          framework_type?: string
          question_count?: number | null
          estimated_time?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_assessment_questions: {
        Row: {
          id: string
          framework_id: string
          question_text: string
          question_type: string | null
          section: string | null
          order_index: number | null
          is_required: boolean | null
          options: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          framework_id: string
          question_text: string
          question_type?: string | null
          section?: string | null
          order_index?: number | null
          is_required?: boolean | null
          options?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          framework_id?: string
          question_text?: string
          question_type?: string | null
          section?: string | null
          order_index?: number | null
          is_required?: boolean | null
          options?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_vendor_assessments: {
        Row: {
          id: string
          user_id: string
          vendor_id: string
          framework_id: string
          assessment_name: string
          status: string | null
          due_date: string | null
          sent_at: string | null
          completed_at: string | null
          overall_score: number | null
          section_scores: Json | null
          contact_email: string | null
          custom_message: string | null
          send_reminders: boolean | null
          allow_save_progress: boolean | null
          comment_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor_id: string
          framework_id: string
          assessment_name: string
          status?: string | null
          due_date?: string | null
          sent_at?: string | null
          completed_at?: string | null
          overall_score?: number | null
          section_scores?: Json | null
          contact_email?: string | null
          custom_message?: string | null
          send_reminders?: boolean | null
          allow_save_progress?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vendor_id?: string
          framework_id?: string
          assessment_name?: string
          status?: string | null
          due_date?: string | null
          sent_at?: string | null
          completed_at?: string | null
          overall_score?: number | null
          section_scores?: Json | null
          contact_email?: string | null
          custom_message?: string | null
          send_reminders?: boolean | null
          allow_save_progress?: boolean | null
          comment_count?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_assessment_responses: {
        Row: {
          id: string
          assessment_id: string
          question_id: string
          answer: string | null
          answer_data: Json | null
          evidence_urls: string[] | null
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          question_id: string
          answer?: string | null
          answer_data?: Json | null
          evidence_urls?: string[] | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          question_id?: string
          answer?: string | null
          answer_data?: Json | null
          evidence_urls?: string[] | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_assessment_comments: {
        Row: {
          id: string
          assessment_id: string
          question_id: string | null
          user_id: string
          comment_text: string
          is_reviewer_comment: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          question_id?: string | null
          user_id: string
          comment_text: string
          is_reviewer_comment?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          question_id?: string | null
          user_id?: string
          comment_text?: string
          is_reviewer_comment?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_email_notifications: {
        Row: {
          id: string
          to_email: string
          subject: string
          template: string
          status: string | null
          sent_at: string | null
          metadata: Json | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          to_email: string
          subject: string
          template: string
          status?: string | null
          sent_at?: string | null
          metadata?: Json | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          to_email?: string
          subject?: string
          template?: string
          status?: string | null
          sent_at?: string | null
          metadata?: Json | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_vendor_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          legal_name: string | null
          website: string | null
          industry: string | null
          company_size: string | null
          headquarters: string | null
          description: string | null
          logo_url: string | null
          service_types: string[] | null
          data_types_accessed: string[] | null
          is_public: boolean | null
          directory_listing_enabled: boolean | null
          vendor_rating: number | null
          security_posture_score: number | null
          account_type: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          legal_name?: string | null
          website?: string | null
          industry?: string | null
          company_size?: string | null
          headquarters?: string | null
          description?: string | null
          logo_url?: string | null
          service_types?: string[] | null
          data_types_accessed?: string[] | null
          is_public?: boolean | null
          directory_listing_enabled?: boolean | null
          vendor_rating?: number | null
          security_posture_score?: number | null
          account_type?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          legal_name?: string | null
          website?: string | null
          industry?: string | null
          company_size?: string | null
          headquarters?: string | null
          description?: string | null
          logo_url?: string | null
          service_types?: string[] | null
          data_types_accessed?: string[] | null
          is_public?: boolean | null
          directory_listing_enabled?: boolean | null
          vendor_rating?: number | null
          security_posture_score?: number | null
          account_type?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_sector_guidance: {
        Row: {
          id: string
          sector: string
          service_type: string
          data_types: string[]
          required_frameworks: string[]
          recommended_assessments: string[]
          compliance_requirements: string[]
          security_controls: Json
          best_practices: string[]
          guidance_content: Json
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sector: string
          service_type: string
          data_types: string[]
          required_frameworks: string[]
          recommended_assessments: string[]
          compliance_requirements: string[]
          security_controls: Json
          best_practices: string[]
          guidance_content: Json
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sector?: string
          service_type?: string
          data_types?: string[]
          required_frameworks?: string[]
          recommended_assessments?: string[]
          compliance_requirements?: string[]
          security_controls?: Json
          best_practices?: string[]
          guidance_content?: Json
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_vendor_ratings: {
        Row: {
          id: string
          vendor_id: string
          overall_rating: number | null
          assessment_score: number | null
          compliance_score: number | null
          response_time_score: number | null
          completion_rate: number | null
          security_posture_score: number | null
          rating_breakdown: Json | null
          calculated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          overall_rating?: number | null
          assessment_score?: number | null
          compliance_score?: number | null
          response_time_score?: number | null
          completion_rate?: number | null
          security_posture_score?: number | null
          rating_breakdown?: Json | null
          calculated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          overall_rating?: number | null
          assessment_score?: number | null
          compliance_score?: number | null
          response_time_score?: number | null
          completion_rate?: number | null
          security_posture_score?: number | null
          rating_breakdown?: Json | null
          calculated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vs_proactive_assessments: {
        Row: {
          id: string
          vendor_profile_id: string
          framework_id: string
          assessment_name: string
          status: string | null
          overall_score: number | null
          section_scores: Json | null
          answers: Json | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_profile_id: string
          framework_id: string
          assessment_name: string
          status?: string | null
          overall_score?: number | null
          section_scores?: Json | null
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_profile_id?: string
          framework_id?: string
          assessment_name?: string
          status?: string | null
          overall_score?: number | null
          section_scores?: Json | null
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}