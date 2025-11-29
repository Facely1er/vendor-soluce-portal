import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Assessment = Database['public']['Tables']['vs_supply_chain_assessments']['Row'];
type AssessmentInsert = Database['public']['Tables']['vs_supply_chain_assessments']['Insert'];
type AssessmentUpdate = Database['public']['Tables']['vs_supply_chain_assessments']['Update'];

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
  sectionScores: any[] | null;
  
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
  completeAssessment: (overallScore: number, sectionScores: any[], userId: string) => Promise<Assessment>;
  
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

          const assessments = data || [];
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
          const newAssessmentData: AssessmentInsert = {
            ...assessmentData,
            user_id: userId,
          };
          
          const { data, error } = await supabase
            .from('vs_supply_chain_assessments')
            .insert(newAssessmentData)
            .select()
            .single();

          if (error) throw error;

          set(
            (state) => ({
              assessments: [data, ...state.assessments],
              currentAssessment: data,
              loading: false
            }),
            false,
            'createAssessment/success'
          );
          
          return data;
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
          const { data, error } = await supabase
            .from('vs_supply_chain_assessments')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

          if (error) throw error;
          
          set(
            (state) => ({
              assessments: state.assessments.map(assessment => 
                assessment.id === id ? data : assessment
              ),
              currentAssessment: state.currentAssessment?.id === id ? data : state.currentAssessment,
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
      
      completeAssessment: async (overallScore: number, sectionScores: any[], userId: string) => {
        const state = get();
        if (!state.currentAssessment) {
          throw new Error('No current assessment to complete');
        }
        
        set({ loading: true }, false, 'completeAssessment/start');
        
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
            .eq('id', state.currentAssessment.id)
            .eq('user_id', userId)
            .select()
            .single();

          if (error) throw error;

          set(
            (state) => ({
              assessments: state.assessments.map(a => a.id === data.id ? data : a),
              currentAssessment: null,
              answers: {},
              currentSection: 0,
              loading: false
            }),
            false,
            'completeAssessment/success'
          );
          
          return data;
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
      
      getSectionProgress: (sectionIndex: number, totalQuestions: number) => {
        const state = get();
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
      name: 'vendortal-risk-review-assessment-store',
    }
  )
);