import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Assessment = Database['public']['Tables']['vs_supply_chain_assessments']['Row'];
type AssessmentInsert = Database['public']['Tables']['vs_supply_chain_assessments']['Insert'];
type AssessmentUpdate = Database['public']['Tables']['vs_supply_chain_assessments']['Update'];

export const useSupplyChainAssessments = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    if (!user) {
      setAssessments([]);
      setCurrentAssessment(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('vs_supply_chain_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAssessments(data || []);
      
      // Set current assessment to the most recent in_progress one
      const inProgress = data?.find(a => a.status === 'in_progress');
      if (inProgress) {
        setCurrentAssessment(inProgress);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createOrUpdateAssessment = async (
    assessmentData: Partial<AssessmentUpdate>, 
    answers: Record<string, string>
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      if (currentAssessment) {
        // Update existing assessment
        const updateData: AssessmentUpdate = {
          ...assessmentData,
          answers,
        };
        
        const { data, error } = await supabase
          .from('vs_supply_chain_assessments')
          .update(updateData)
          .eq('id', currentAssessment.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Update state
        setCurrentAssessment(data);
        setAssessments(prev => prev.map(a => a.id === data.id ? data : a));
        
        return data;
      } else {
        // Create new assessment
        const newAssessmentData: AssessmentInsert = {
          user_id: user.id,
          assessment_name: assessmentData.assessment_name || 'Supply Chain Assessment',
          answers,
          status: 'in_progress',
          ...assessmentData
        };
        
        const { data, error } = await supabase
          .from('vs_supply_chain_assessments')
          .insert(newAssessmentData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Update state
        setCurrentAssessment(data);
        setAssessments(prev => [data, ...prev]);
        
        return data;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
      throw err;
    }
  };

  const completeAssessment = async (
    overallScore: number,
    sectionScores: Array<{ section: string; score: number }>
  ) => {
    if (!currentAssessment || !user) {
      throw new Error('No current assessment to complete');
    }

    try {
      const updateData: AssessmentUpdate = {
        overall_score: overallScore,
        section_scores: sectionScores,
        status: 'completed',
        completed_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('vs_supply_chain_assessments')
        .update(updateData)
        .eq('id', currentAssessment.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update state
      setCurrentAssessment(null); // Clear current assessment since it's completed
      setAssessments(prev => prev.map(a => a.id === data.id ? data : a));
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete assessment');
      throw err;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vs_supply_chain_assessments')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      // Update state
      setAssessments(prev => prev.filter(a => a.id !== id));
      if (currentAssessment?.id === id) {
        setCurrentAssessment(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assessment');
      throw err;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAssessmentsSafely = async () => {
      if (!isMounted) return;
      await fetchAssessments();
    };

    fetchAssessmentsSafely();

    return () => {
      isMounted = false;
    };
  }, [user, fetchAssessments]);

  return {
    assessments,
    currentAssessment,
    loading,
    error,
    createOrUpdateAssessment,
    completeAssessment,
    deleteAssessment,
    refetch: fetchAssessments,
  };
};