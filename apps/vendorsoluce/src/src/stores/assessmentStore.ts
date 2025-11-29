import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database, Json } from '../lib/database.types';
import { UsageService } from '../services/usageService';
import { logger } from '../utils/logger';

type Assessment = Database['public']['Tables']['vs_supply_chain_assessments']['Row'];
type AssessmentInsert = Database['public']['Tables']['vs_supply_chain_assessments']['Insert'];
type AssessmentUpdate = Database['public']['Tables']['vs_supply_chain_assessments']['Update'];

export interface SectionScore {
  title: string;
  percentage: number;
  completed: boolean;
}

interface AssessmentState {
  // Data
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  savingAnswers: boolean;
  
  // Assessment progress
  currentSection: number;
  answers: Record<string, string>;
  sectionScores: SectionScore[] | null;
  
  // Actions
  fetchAssessments: (userId: string) => Promise<void>;
  createAssessment: (assessmentData: Omit<AssessmentInsert, 'user_id'>, userId: string) => Promise<Assessment>;
  updateAssessment: (id: string, updates: AssessmentUpdate, userId: string) => Promise<void>;
  deleteAssessment: (id: string, userId: string) => Promise<void>;
  
  // Assessment flow actions
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setCurrentSection: (section: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setAnswers: (answers: Record<string, string>) => void;
  saveProgress: (userId: string) => Promise<void>;
  completeAssessment: (overallScore: number, sectionScores: SectionScore[], userId: string) => Promise<Assessment>;
  
  // Computed selectors
  getAssessmentProgress: () => number;
  getSectionProgress: (sectionIndex: number, totalQuestions: number) => number;
  getCompletedAssessments: () => Assessment[];
  getInProgressAssessments: () => Assessment[];
}

export const useAssessmentStore = create<AssessmentState>()(
  devtools(
    (set, get) => ({
      // Initial state
      assessments: [],
      currentAssessment: null,
      loading: false,
      error: null,
      savingAnswers: false,
      currentSection: 0,
      answers: {},
      sectionScores: null,
      
      // Data actions
      fetchAssessments: async (userId: string) => {
        set({ loading: true, error: null }, false, 'fetchAssessments/start');
        
        try {
          const { data, error } = await supabase
            .from('vs_supply_chain_assessments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const assessments = (data || []) as Assessment[];
          const inProgress = assessments.find(a => a.status === 'in_progress');

          set(
            {
              assessments,
              currentAssessment: inProgress || null,
              loading: false,
              answers: inProgress?.answers as Record<string, string> || {}
            },
            false,
            'fetchAssessments/success'
          );
        } catch (error) {
          set(
            {
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch assessments'
            },
            false,
            'fetchAssessments/error'
          );
          throw error;
        }
      },
      
      createAssessment: async (assessmentData: Omit<AssessmentInsert, 'user_id'>, userId: string) => {
        set({ loading: true, error: null }, false, 'createAssessment/start');
        
        try {
          // Check usage limit before creating assessment
          const usageService = new UsageService();
          const limitCheck = await usageService.canPerformAction(userId, 'vendor_assessments');
          if (!limitCheck.canPerform) {
            const errorMessage = limitCheck.message || 'You have reached your assessment limit. Please upgrade your plan.';
            set(
              {
                loading: false,
                error: errorMessage
              },
              false,
              'createAssessment/limitReached'
            );
            throw new Error(errorMessage);
          }

          const newAssessmentData: AssessmentInsert = {
            ...assessmentData,
            user_id: userId,
          };
          
          const { data, error } = await (supabase
            .from('vs_supply_chain_assessments') as any)
            .insert(newAssessmentData)
            .select()
            .single();
          
          if (error) throw error;
          
          const assessment = data as Assessment;

          // Track usage after successful creation
          try {
            const usageResult = await usageService.incrementUsage(userId, 'vendor_assessments', 1);
            if (usageResult.overLimit && usageResult.overageAmount) {
              logger.warn(`Overage charge: $${usageResult.overageAmount} will be added to your next invoice.`);
            }
          } catch (usageError) {
            // Log but don't fail the assessment creation if usage tracking fails
            logger.error('Error tracking assessment usage:', usageError);
          }

          set(
            (state) => ({
              assessments: [assessment, ...state.assessments],
              currentAssessment: assessment,
              loading: false
            }),
            false,
            'createAssessment/success'
          );
          
          return assessment;
        } catch (error) {
          set(
            {
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to create assessment'
            },
            false,
            'createAssessment/error'
          );
          throw error;
        }
      },
      
      updateAssessment: async (id: string, updates: AssessmentUpdate, userId: string) => {
        set({ savingAnswers: true, error: null }, false, 'updateAssessment/start');
        
        try {
          const { data, error } = await (supabase
            .from('vs_supply_chain_assessments') as any)
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

          if (error) throw error;
          
          const updatedAssessment = data as Assessment;
          
          set(
            (state) => ({
              assessments: state.assessments.map(assessment => 
                assessment.id === id ? updatedAssessment : assessment
              ),
              currentAssessment: state.currentAssessment?.id === id ? updatedAssessment : state.currentAssessment,
              savingAnswers: false
            }),
            false,
            'updateAssessment/success'
          );
        } catch (error) {
          set(
            {
              savingAnswers: false,
              error: error instanceof Error ? error.message : 'Failed to update assessment'
            },
            false,
            'updateAssessment/error'
          );
          throw error;
        }
      },
      
      deleteAssessment: async (id: string, userId: string) => {
        set({ loading: true, error: null }, false, 'deleteAssessment/start');
        
        try {
          const { error } = await supabase
            .from('vs_supply_chain_assessments')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

          if (error) throw error;

          set(
            (state) => ({
              assessments: state.assessments.filter(assessment => assessment.id !== id),
              currentAssessment: state.currentAssessment?.id === id ? null : state.currentAssessment,
              loading: false
            }),
            false,
            'deleteAssessment/success'
          );
        } catch (error) {
          set(
            {
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to delete assessment'
            },
            false,
            'deleteAssessment/error'
          );
          throw error;
        }
      },
      
      // Assessment flow actions
      setCurrentAssessment: (assessment) => {
        set(
          {
            currentAssessment: assessment,
            answers: assessment?.answers as Record<string, string> || {},
            currentSection: 0
          },
          false,
          'setCurrentAssessment'
        );
      },
      
      setCurrentSection: (section) => set({ currentSection: section }, false, 'setCurrentSection'),
      
      setAnswer: (questionId, answer) => {
        set(
          (state) => ({
            answers: { ...state.answers, [questionId]: answer }
          }),
          false,
          'setAnswer'
        );
      },
      
      setAnswers: (answers) => set({ answers }, false, 'setAnswers'),
      
      saveProgress: async (userId: string) => {
        const state = get();
        if (!state.currentAssessment) return;
        
        await state.updateAssessment(
          state.currentAssessment.id,
          { answers: state.answers },
          userId
        );
      },
      
      completeAssessment: async (overallScore: number, sectionScores: SectionScore[], userId: string) => {
        const state = get();
        if (!state.currentAssessment) {
          throw new Error('No current assessment to complete');
        }
        
        set({ loading: true }, false, 'completeAssessment/start');
        
        try {
          const updateData: AssessmentUpdate = {
            overall_score: overallScore,
            section_scores: sectionScores as unknown as Json,
            status: 'completed',
            completed_at: new Date().toISOString(),
          };
          
          const { data, error } = await (supabase
            .from('vs_supply_chain_assessments') as any)
            .update(updateData)
            .eq('id', state.currentAssessment.id)
            .eq('user_id', userId)
            .select()
            .single();

          if (error) throw error;

          const completedAssessment = data as Assessment;

          set(
            (state) => ({
              assessments: state.assessments.map(a => a.id === completedAssessment.id ? completedAssessment : a),
              currentAssessment: null,
              answers: {},
              currentSection: 0,
              loading: false
            }),
            false,
            'completeAssessment/success'
          );
          
          return completedAssessment;
        } catch (error) {
          set(
            {
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to complete assessment'
            },
            false,
            'completeAssessment/error'
          );
          throw error;
        }
      },
      
      // Computed selectors
      getAssessmentProgress: () => {
        const state = get();
        const totalQuestions = 24; // This would be dynamic based on sections
        const answeredQuestions = Object.keys(state.answers).length;
        return Math.round((answeredQuestions / totalQuestions) * 100);
      },
      
      getSectionProgress: (_sectionIndex: number, _totalQuestions: number) => {
        // This would calculate progress for a specific section
        // Implementation would depend on how sections are structured
        return 0;
      },
      
      getCompletedAssessments: () => {
        return get().assessments.filter(a => a.status === 'completed');
      },
      
      getInProgressAssessments: () => {
        return get().assessments.filter(a => a.status === 'in_progress');
      },
    }),
    {
      name: 'vendorsoluce-assessment-store',
    }
  )
);