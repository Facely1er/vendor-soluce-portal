import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { logger } from '../utils/logger';

type AssessmentResponse = Database['public']['Tables']['vs_assessment_responses']['Row'];
type AssessmentResponseInsert = Database['public']['Tables']['vs_assessment_responses']['Insert'];
type AssessmentResponseUpdate = Database['public']['Tables']['vs_assessment_responses']['Update'];

export interface AssessmentResponseWithDetails extends AssessmentResponse {
  question?: {
    id: string;
    question_text: string;
    question_type: string;
    section: string | null;
    is_required: boolean | null;
  };
  assessment?: {
    id: string;
    assessment_name: string;
    status: string | null;
    vendor_id: string;
  };
}

class AssessmentResponseService {
  /**
   * Get all responses for an assessment
   */
  async getResponsesByAssessment(assessmentId: string): Promise<AssessmentResponseWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('vs_assessment_responses')
        .select(`
          *,
          question:vs_assessment_questions(id, question_text, question_type, section, is_required),
          assessment:vs_vendor_assessments(id, assessment_name, status, vendor_id)
        `)
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data as AssessmentResponseWithDetails[]) || [];
    } catch (error) {
      logger.error('Error fetching assessment responses:', error);
      throw error;
    }
  }

  /**
   * Get response for a specific question
   */
  async getResponseByQuestion(assessmentId: string, questionId: string): Promise<AssessmentResponseWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('vs_assessment_responses')
        .select(`
          *,
          question:vs_assessment_questions(id, question_text, question_type, section, is_required),
          assessment:vs_vendor_assessments(id, assessment_name, status, vendor_id)
        `)
        .eq('assessment_id', assessmentId)
        .eq('question_id', questionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No response found
        }
        throw error;
      }

      return data as AssessmentResponseWithDetails;
    } catch (error) {
      logger.error('Error fetching response by question:', error);
      throw error;
    }
  }

  /**
   * Save or update a response
   */
  async saveResponse(responseData: AssessmentResponseInsert): Promise<AssessmentResponse> {
    try {
      const { data, error } = await supabase
        .from('vs_assessment_responses')
        .upsert(responseData, {
          onConflict: 'assessment_id,question_id'
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Error saving response:', error);
      throw error;
    }
  }

  /**
   * Update a response
   */
  async updateResponse(
    responseId: string,
    updates: AssessmentResponseUpdate
  ): Promise<AssessmentResponse> {
    try {
      const { data, error } = await supabase
        .from('vs_assessment_responses')
        .update(updates)
        .eq('id', responseId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Error updating response:', error);
      throw error;
    }
  }

  /**
   * Delete a response
   */
  async deleteResponse(responseId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vs_assessment_responses')
        .delete()
        .eq('id', responseId);

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting response:', error);
      throw error;
    }
  }

  /**
   * Get all responses grouped by section
   */
  async getResponsesBySection(assessmentId: string): Promise<Record<string, AssessmentResponseWithDetails[]>> {
    try {
      const responses = await this.getResponsesByAssessment(assessmentId);
      
      const grouped: Record<string, AssessmentResponseWithDetails[]> = {};
      
      responses.forEach(response => {
        const section = response.question?.section || 'General';
        if (!grouped[section]) {
          grouped[section] = [];
        }
        grouped[section].push(response);
      });

      return grouped;
    } catch (error) {
      logger.error('Error grouping responses by section:', error);
      throw error;
    }
  }
}

export const assessmentResponseService = new AssessmentResponseService();

