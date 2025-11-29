import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { logger } from '../utils/logger';

type AssessmentResponse = Database['public']['Tables']['vs_assessment_responses']['Row'];
type AssessmentResponseInsert = Database['public']['Tables']['vs_assessment_responses']['Insert'];
type AssessmentResponseUpdate = Database['public']['Tables']['vs_assessment_responses']['Update'];

export interface AssessmentResponseWithQuestion extends AssessmentResponse {
  question?: {
    id: string;
    question_text: string;
    question_type: string;
    section: string | null;
    is_required: boolean | null;
  };
}

export const useAssessmentResponses = (assessmentId: string | null) => {
  const [responses, setResponses] = useState<AssessmentResponseWithQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = useCallback(async () => {
    if (!assessmentId) {
      setResponses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vs_assessment_responses')
        .select(`
          *,
          question:vs_assessment_questions(id, question_text, question_type, section, is_required)
        `)
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setResponses((data as AssessmentResponseWithQuestion[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch responses';
      logger.error('[useAssessmentResponses] Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  const saveResponse = async (
    questionId: string,
    answer: string,
    evidenceUrls: string[] = [],
    answerData?: any
  ) => {
    if (!assessmentId) {
      throw new Error('Assessment ID is required');
    }

    try {
      const responseData: AssessmentResponseInsert = {
        assessment_id: assessmentId,
        question_id: questionId,
        answer,
        answer_data: answerData || null,
        evidence_urls: evidenceUrls,
        submitted_at: new Date().toISOString()
      };

      const { data, error: saveError } = await supabase
        .from('vs_assessment_responses')
        .upsert(responseData, {
          onConflict: 'assessment_id,question_id'
        })
        .select(`
          *,
          question:vs_assessment_questions(id, question_text, question_type, section, is_required)
        `)
        .single();

      if (saveError) {
        throw saveError;
      }

      // Update local state
      setResponses(prev => {
        const existing = prev.findIndex(r => r.question_id === questionId);
        if (existing >= 0) {
          return prev.map((r, idx) => idx === existing ? (data as AssessmentResponseWithQuestion) : r);
        }
        return [...prev, data as AssessmentResponseWithQuestion];
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save response';
      logger.error('[useAssessmentResponses] Save error:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateResponse = async (
    responseId: string,
    updates: AssessmentResponseUpdate
  ) => {
    try {
      const { data, error: updateError } = await supabase
        .from('vs_assessment_responses')
        .update(updates)
        .eq('id', responseId)
        .select(`
          *,
          question:vs_assessment_questions(id, question_text, question_type, section, is_required)
        `)
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setResponses(prev =>
        prev.map(r => r.id === responseId ? (data as AssessmentResponseWithQuestion) : r)
      );

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update response';
      logger.error('[useAssessmentResponses] Update error:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteResponse = async (responseId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('vs_assessment_responses')
        .delete()
        .eq('id', responseId);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setResponses(prev => prev.filter(r => r.id !== responseId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete response';
      logger.error('[useAssessmentResponses] Delete error:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  return {
    responses,
    loading,
    error,
    saveResponse,
    updateResponse,
    deleteResponse,
    refetch: fetchResponses
  };
};

