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
          subscription_tier: string | null
          created_at: string
          updated_at: string
          is_first_login: boolean | null
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
          subscription_tier?: string | null
          created_at?: string
          updated_at?: string
          is_first_login?: boolean | null
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
          subscription_tier?: string | null
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
      vs_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          stripe_customer_id: string
          price_id: string | null
          status: string
          tier: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          trial_start: string | null
          trial_end: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          stripe_customer_id: string
          price_id?: string | null
          status: string
          tier: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string
          price_id?: string | null
          status?: string
          tier?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_usage_limit: {
        Args: {
          p_user_id: string;
          p_feature: 'sbom_scans' | 'vendor_assessments' | 'api_calls' | 'additional_users' | 'vendors' | 'assessments' | 'users' | 'data_export' | 'custom_branding' | 'sso' | 'priority_support';
        };
        Returns: {
          used: number;
          limit_value: number;
          can_use: boolean;
        }[];
      };
      increment_usage: {
        Args: {
          p_user_id: string;
          p_feature: 'sbom_scans' | 'vendor_assessments' | 'api_calls' | 'additional_users' | 'vendors' | 'assessments' | 'users' | 'data_export' | 'custom_branding' | 'sso' | 'priority_support';
          p_quantity?: number;
        };
        Returns: void;
      };
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}