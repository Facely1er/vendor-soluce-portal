import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { logger } from '../utils/logger';

type VendorAssessment = Database['public']['Tables']['vs_vendor_assessments']['Row'];
type VendorAssessmentInsert = Database['public']['Tables']['vs_vendor_assessments']['Insert'];
type VendorAssessmentUpdate = Database['public']['Tables']['vs_vendor_assessments']['Update'];
type AssessmentFramework = Database['public']['Tables']['vs_assessment_frameworks']['Row'];

export interface VendorAssessmentWithDetails extends VendorAssessment {
  vendor: {
    id: string;
    name: string;
    contact_email: string | null;
  };
  framework: {
    id: string;
    name: string;
    description: string | null;
    framework_type: string;
    question_count: number | null;
    estimated_time: string | null;
  };
}

export const useVendorAssessments = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [assessments, setAssessments] = useState<VendorAssessmentWithDetails[]>([]);
  const [frameworks, setFrameworks] = useState<AssessmentFramework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frameworksError, setFrameworksError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!user) {
      logger.debug('[useVendorAssessments] No user, clearing assessments');
      setAssessments([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      logger.info('[useVendorAssessments] Fetching assessments for user:', user.id);
      setLoading(true);
      setError(null);
      
      const { data, error } = await (supabase
        .from('vs_vendor_assessments') as any)
        .select(`
          *,
          vendor:vs_vendors(id, name, contact_email),
          framework:vs_assessment_frameworks(id, name, description, framework_type, question_count, estimated_time)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('[useVendorAssessments] Assessment fetch error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      logger.info('[useVendorAssessments] Loaded assessments:', data?.length || 0);
      setAssessments(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assessments';
      logger.error('[useVendorAssessments] Assessment fetch failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchFrameworks = useCallback(async () => {
    try {
      logger.info('[useVendorAssessments] Fetching frameworks...');
      const { data, error } = await supabase
        .from('vs_assessment_frameworks')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        logger.error('[useVendorAssessments] Framework fetch error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      logger.info('[useVendorAssessments] Loaded frameworks:', data?.length || 0);
      setFrameworks(data || []);
      setFrameworksError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch frameworks';
      logger.error('[useVendorAssessments] Framework fetch failed:', errorMessage);
      setFrameworksError(errorMessage);
      // Don't set main error - frameworks are optional for basic functionality
    }
  }, []);

  const createAssessment = async (assessmentData: Omit<VendorAssessmentInsert, 'user_id' | 'status'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Ensure all required fields are present and properly typed
      const insertPayload: VendorAssessmentInsert = {
        ...assessmentData,
        user_id: user.id,
        status: 'pending'
      };

      const { data, error } = await (supabase
        .from('vs_vendor_assessments') as any)
        .insert([insertPayload])
        .select(`
          *,
          vendor:vs_vendors(id, name, contact_email),
          framework:vs_assessment_frameworks(id, name, description, framework_type, question_count, estimated_time)
        `)
        .single();

      if (error) {
        throw error;
      }

      setAssessments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assessment');
      throw err;
    }
  };

  const updateAssessment = async (id: string, updates: VendorAssessmentUpdate) => {
    try {
      const { data, error } = await (supabase
        .from('vs_vendor_assessments') as any)
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select(`
          *,
          vendor:vs_vendors(id, name, contact_email),
          framework:vs_assessment_frameworks(id, name, description, framework_type, question_count, estimated_time)
        `)
        .single();

      if (error) {
        throw error;
      }

      setAssessments(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assessment');
      throw err;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      const { error } = await (supabase
        .from('vs_vendor_assessments') as any)
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setAssessments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assessment');
      throw err;
    }
  };

  const sendAssessment = async (id: string) => {
    try {
      const { data, error } = await (supabase
        .from('vs_vendor_assessments') as any)
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select(`
          *,
          vendor:vs_vendors(id, name, contact_email),
          framework:vs_assessment_frameworks(id, name, description, framework_type, question_count, estimated_time)
        `)
        .single();

      if (error) {
        throw error;
      }

      setAssessments(prev => prev.map(a => a.id === id ? data : a));
      
      // Send notification email to vendor when assessment is sent
      if (data && (data as any).vendor?.contact_email) {
        try {
          const { EmailNotificationService } = await import('../services/emailNotificationService');
          const vendor = (data as any).vendor;
          const framework = (data as any).framework;
          
          // Get organization name from user profile
          const { data: userProfile } = await supabase
            .from('vs_profiles')
            .select('company, full_name')
            .eq('id', user?.id)
            .single();
          
          const organizationName = userProfile?.company || userProfile?.full_name || 'VendorTal™ Risk Review Customer';
          
          await EmailNotificationService.notifyAssessmentSent(
            vendor.contact_email,
            vendor.name || 'Vendor',
            organizationName,
            framework?.name || data.assessment_name || 'Security Assessment',
            id,
            data.due_date ? new Date(data.due_date).toLocaleDateString() : undefined
          );
          
          logger.info('Assessment notification email sent successfully', { assessmentId: id, vendorEmail: vendor.contact_email });
        } catch (emailError) {
          logger.warn('Failed to send assessment notification email:', emailError);
          // Don't fail the request if email fails - assessment is still sent
        }
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send assessment');
      throw err;
    }
  };

  const completeAssessment = async (id: string, overallScore: number, sectionScores: Record<string, number>) => {
    try {
      const { data, error } = await (supabase
        .from('vs_vendor_assessments') as any)
        .update({
          status: 'completed',
          overall_score: overallScore,
          section_scores: sectionScores,
          completed_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select(`
          *,
          vendor:vs_vendors(id, name, contact_email),
          framework:vs_assessment_frameworks(id, name, description, framework_type, question_count, estimated_time)
        `)
        .single();

      if (error) {
        throw error;
      }

      setAssessments(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete assessment');
      throw err;
    }
  };

  const getAssessmentProgress = (assessment: VendorAssessmentWithDetails) => {
    // This would need to be calculated based on responses
    // For now, return a mock progress based on status
    switch (assessment.status) {
      case 'pending': return 0;
      case 'sent': return 0;
      case 'in_progress': return 50;
      case 'completed': return 100;
      case 'reviewed': return 100;
      default: return 0;
    }
  };

  const getAssessmentStats = () => {
    const total = assessments.length;
    const completed = assessments.filter(a => a.status === 'completed').length;
    const inProgress = assessments.filter(a => a.status === 'in_progress').length;
    const overdue = assessments.filter(a => {
      if (!a.due_date) return false;
      return new Date(a.due_date) < new Date() && a.status !== 'completed';
    }).length;

    const averageScore = assessments
      .filter(a => a.overall_score !== null)
      .reduce((sum, a) => sum + (a.overall_score || 0), 0) / 
    Math.max(1, assessments.filter(a => a.overall_score !== null).length);

    return {
      total,
      completed,
      inProgress,
      overdue,
      averageScore: Math.round(averageScore),
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const reviewAssessment = async (id: string, approved: boolean, comments?: string) => {
    try {
      const { data, error } = await (supabase
        .from('vs_vendor_assessments') as any)
        .update({
          status: approved ? 'reviewed' : 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select(`
          *,
          vendor:vs_vendors(id, name, contact_email),
          framework:vs_assessment_frameworks(id, name, description, framework_type, question_count, estimated_time)
        `)
        .single();

      if (error) {
        throw error;
      }

      setAssessments(prev => prev.map(a => a.id === id ? data : a));
      
      // Send notification email to vendor if assessment is sent
      if (data.status === 'sent' && (data as any).vendor?.contact_email) {
        try {
          const { EmailNotificationService } = await import('../services/emailNotificationService');
          const vendor = (data as any).vendor;
          const framework = (data as any).framework;
          
          // Get organization name from user profile
          const { data: userProfile } = await supabase
            .from('vs_profiles')
            .select('company, full_name')
            .eq('id', user?.id)
            .single();
          
          const organizationName = userProfile?.company || userProfile?.full_name || 'VendorTal™ Risk Review Customer';
          
          await EmailNotificationService.notifyAssessmentSent(
            vendor.contact_email,
            vendor.name || 'Vendor',
            organizationName,
            framework?.name || 'Security Assessment',
            id,
            data.due_date ? new Date(data.due_date).toLocaleDateString() : undefined
          );
        } catch (emailError) {
          logger.warn('Failed to send assessment notification email:', emailError);
          // Don't fail the request if email fails
        }
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review assessment');
      throw err;
    }
  };

  const getAssessmentResponses = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('vs_assessment_responses')
        .select(`
          *,
          question:vs_assessment_questions(id, question_text, question_type, section, is_required)
        `)
        .eq('assessment_id', id);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch responses');
      throw err;
    }
  };

  useEffect(() => {
    // Don't fetch until auth is ready
    if (authLoading) {
      logger.debug('[useVendorAssessments] Waiting for auth...');
      return;
    }

    logger.debug('[useVendorAssessments] Effect triggered, fetching data...');
    fetchAssessments();
    fetchFrameworks();
  }, [fetchAssessments, fetchFrameworks, authLoading]);

  // Proactive Assessment Functions
  const createProactiveAssessment = async (
    vendorProfileId: string,
    frameworkId: string,
    assessmentName: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('vs_proactive_assessments')
        .insert({
          vendor_profile_id: vendorProfileId,
          framework_id: frameworkId,
          assessment_name: assessmentName,
          status: 'in_progress',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('Error creating proactive assessment:', err);
      throw err;
    }
  };

  const getProactiveAssessments = async (vendorProfileId: string) => {
    try {
      const { data, error } = await supabase
        .from('vs_proactive_assessments')
        .select('*, framework:vs_assessment_frameworks(*)')
        .eq('vendor_profile_id', vendorProfileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      logger.error('Error fetching proactive assessments:', err);
      throw err;
    }
  };

  const submitProactiveAssessment = async (
    assessmentId: string,
    overallScore: number,
    sectionScores: Record<string, number>,
    answers: Record<string, any>
  ) => {
    try {
      const { data, error } = await supabase
        .from('vs_proactive_assessments')
        .update({
          status: 'completed',
          overall_score: overallScore,
          section_scores: sectionScores,
          answers: answers,
          completed_at: new Date().toISOString(),
        })
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) throw error;

      // Update vendor rating
      const { vendorRatingService } = await import('../services/vendorRatingService');
      const { data: assessment } = await supabase
        .from('vs_proactive_assessments')
        .select('vendor_profile_id')
        .eq('id', assessmentId)
        .single();

      if (assessment) {
        await vendorRatingService.updateRating(assessment.vendor_profile_id);
      }

      return data;
    } catch (err) {
      logger.error('Error submitting proactive assessment:', err);
      throw err;
    }
  };

  return {
    assessments,
    frameworks,
    loading: loading || authLoading,
    error,
    frameworksError, // Separate error for frameworks
    createAssessment,
    updateAssessment,
    deleteAssessment,
    sendAssessment,
    completeAssessment,
    reviewAssessment,
    getAssessmentResponses,
    getAssessmentProgress,
    getAssessmentStats,
    refetch: fetchAssessments,
    createProactiveAssessment,
    getProactiveAssessments,
    submitProactiveAssessment,
  };
};
