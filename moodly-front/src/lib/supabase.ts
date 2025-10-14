import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'employee' | 'manager';
  created_at: string;
  updated_at: string;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: 'happy' | 'neutral' | 'sad';
  context_tag?: string;
  comment?: string;
  created_at: string;
};

export type MoodStats = {
  happy: number;
  neutral: number;
  sad: number;
  total: number;
  avgScore: number;
};
