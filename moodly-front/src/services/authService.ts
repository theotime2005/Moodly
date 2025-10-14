import { supabase, Profile } from '../lib/supabase';

export const authService = {
  async loginWithEmail(email: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Login error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Login exception:', error);
      return null;
    }
  },

  async getCurrentUser(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Get user error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get user exception:', error);
      return null;
    }
  }
};
