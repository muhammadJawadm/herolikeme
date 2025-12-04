import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return { user: null, session: null, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    // Clear local session first
    const { error } = await supabase.auth.signOut();
    
    // Even if there's an error (like missing session), we should clear local state
    // and return success to allow the user to navigate to login
    if (error && error.message !== 'Auth session missing!') {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { error: error.message };
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error: any) {
    console.error('Error getting session:', error);
    return { session: null, error: error.message };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    console.error('Error getting user:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { session } = await getCurrentSession();
  return !!session;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
