import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../types';
import { setUserContext, clearUserContext, addBreadcrumb } from '../utils/sentry';
import { logger } from '../utils/logger';
import type { Database } from '../lib/database.types';

type ProfileInsert = Database['public']['Tables']['vs_profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['vs_profiles']['Update'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  markOnboardingComplete: (profileData?: {
    role?: string;
    company_size?: string;
    industry?: string;
  }) => Promise<void>;
   markTourComplete: () => Promise<void>;
   startTour: () => void;
   isTourRunning: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
   const [isTourRunning, setIsTourRunning] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('vs_profiles')
        .select('*')
        .eq('id', userId);

      if (error) throw error;

      // If no profile exists, create one
      if (!profileData || profileData.length === 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newProfile, error: createError } = await (supabase
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type workaround
            .from('vs_profiles') as any
            )
            .insert([
              {
                id: userId,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || '',
                is_first_login: true,
              } as ProfileInsert,
            ])
            .select()
            .single();

          if (createError) throw createError;
          const profile = newProfile as Profile;
          setProfile(profile);

          // New user should go to onboarding
          if (profile?.is_first_login) {
            navigate('/onboarding');
          }
        }
      } else {
        const profile = profileData[0] as Profile;
        setProfile(profile);

        // Check if this is the first login
        if (profile?.is_first_login) {
          navigate('/onboarding');
        }
      }
    } catch (error) {
      logger.error('Error fetching profile:', error);
    }
  }, [navigate]);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        // Set user context in Sentry
        setUserContext({
          id: session.user.id,
          email: session.user.email,
        });
        addBreadcrumb({ message: 'User session restored', category: 'auth', level: 'info' });
      } else {
        clearUserContext();
      }
      setIsLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      // Handle email verification
      if (event === 'SIGNED_IN' && session?.user && !session.user.email_confirmed_at) {
        // User signed in but email not verified
        addBreadcrumb({ message: 'User signed in but email not verified', category: 'auth', level: 'warning' });
      }
      
      // Handle password recovery
      if (event === 'PASSWORD_RECOVERY') {
        addBreadcrumb({ message: 'Password recovery initiated', category: 'auth', level: 'info' });
        // User will be redirected to reset password page via URL params
      }
      
      if (session?.user) {
        fetchProfile(session.user.id);
        // Set user context in Sentry
        setUserContext({
          id: session.user.id,
          email: session.user.email,
        });
        addBreadcrumb({ message: `User ${event}`, category: 'auth', level: 'info' });
      } else {
        setProfile(null);
        clearUserContext();
        addBreadcrumb({ message: 'User signed out', category: 'auth', level: 'info' });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      const { error: profileError } = await (supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type workaround
        .from('vs_profiles') as any
        )
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            is_first_login: true,
          } as ProfileInsert,
        ]);

      if (profileError) throw profileError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate('/');
  };
  
  const signOut = logout; // Alias for backward compatibility

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) throw new Error('User must be authenticated to update password');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) throw new Error('User email not found');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });

    if (error) throw error;
  };

  const markOnboardingComplete = async (profileData?: {
    role?: string;
    company_size?: string;
    industry?: string;
  }) => {
    if (!user) return;

    try {
      const updateData: Partial<Profile> = { is_first_login: false };
      
      // Add profile data if provided
      if (profileData) {
        if (profileData.role) updateData.role = profileData.role;
        if (profileData.company_size) updateData.company_size = profileData.company_size;
        if (profileData.industry) updateData.industry = profileData.industry;
      }
      
      const { error } = await (supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type workaround
        .from('vs_profiles') as any
        )
        .update(updateData as ProfileUpdate)
        .eq('id', user.id);

      if (error) throw error;

      // Update local profile state
      setProfile((prev: Profile | null) => prev ? ({ ...prev, ...updateData }) : null);

      // Navigate to dashboard after onboarding
      navigate('/dashboard');
    } catch (error) {
      logger.error('Error marking onboarding complete:', error);
    }
  };

   const markTourComplete = async () => {
     if (!user) return;
 
     try {
       const { error } = await (supabase
         // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type workaround
         .from('vs_profiles') as any
         )
         .update({ tour_completed: true } as ProfileUpdate)
         .eq('id', user.id);
 
       if (error) throw error;
 
       // Update local profile state
       setProfile((prev: Profile | null) => prev ? ({ ...prev, tour_completed: true }) : null);
       setIsTourRunning(false);
     } catch (error) {
       logger.error('Error marking tour complete:', error);
     }
   };
 
   const startTour = () => {
     setIsTourRunning(true);
   };
  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    logout,
    resetPassword,
    updatePassword,
    resendVerificationEmail,
    markOnboardingComplete,
     markTourComplete,
     startTour,
     isTourRunning,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}