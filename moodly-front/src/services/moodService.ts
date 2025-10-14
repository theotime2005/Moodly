import { supabase, MoodEntry, MoodStats } from '../lib/supabase';

export const moodService = {
  async createMoodEntry(
    userId: string,
    mood: 'happy' | 'neutral' | 'sad',
    contextTag?: string,
    comment?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: userId,
          mood,
          context_tag: contextTag || null,
          comment: comment || null
        });

      if (error) {
        console.error('Create mood entry error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Create mood entry exception:', error);
      return false;
    }
  },

  async getUserMoodEntries(userId: string, limit: number = 30): Promise<MoodEntry[]> {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get user mood entries error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user mood entries exception:', error);
      return [];
    }
  },

  async getAllMoodEntries(days: number = 30): Promise<MoodEntry[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Get all mood entries error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get all mood entries exception:', error);
      return [];
    }
  },

  async getTodayStats(): Promise<MoodStats> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood')
        .gte('created_at', today.toISOString());

      if (error) {
        console.error('Get today stats error:', error);
        return { happy: 0, neutral: 0, sad: 0, total: 0, avgScore: 0 };
      }

      const entries = data || [];
      const happy = entries.filter(e => e.mood === 'happy').length;
      const neutral = entries.filter(e => e.mood === 'neutral').length;
      const sad = entries.filter(e => e.mood === 'sad').length;
      const total = entries.length;
      const avgScore = total > 0 ? (happy * 3 + neutral * 2 + sad * 1) / total : 0;

      return { happy, neutral, sad, total, avgScore };
    } catch (error) {
      console.error('Get today stats exception:', error);
      return { happy: 0, neutral: 0, sad: 0, total: 0, avgScore: 0 };
    }
  },

  calculateStats(entries: MoodEntry[]): MoodStats {
    const happy = entries.filter(e => e.mood === 'happy').length;
    const neutral = entries.filter(e => e.mood === 'neutral').length;
    const sad = entries.filter(e => e.mood === 'sad').length;
    const total = entries.length;
    const avgScore = total > 0 ? (happy * 3 + neutral * 2 + sad * 1) / total : 0;

    return { happy, neutral, sad, total, avgScore };
  },

  groupEntriesByDay(entries: MoodEntry[]): Map<string, MoodEntry[]> {
    const grouped = new Map<string, MoodEntry[]>();

    entries.forEach(entry => {
      const date = new Date(entry.created_at).toISOString().split('T')[0];
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)?.push(entry);
    });

    return grouped;
  }
};
