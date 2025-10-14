import { ApplicationSettings } from '@nativescript/core';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: 'employee' | 'manager';
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: 'happy' | 'neutral' | 'sad';
  context_tag?: string;
  comment?: string;
  created_at: string;
};

const USERS_KEY = 'moodly_users';
const MOODS_KEY = 'moodly_moods';

const defaultUsers: UserProfile[] = [
  {
    id: '1',
    email: 'employee@moodly.com',
    full_name: 'Jean Dupont',
    role: 'employee'
  },
  {
    id: '2',
    email: 'manager@moodly.com',
    full_name: 'Marie Martin',
    role: 'manager'
  }
];

function initUsers() {
  const stored = ApplicationSettings.getString(USERS_KEY);
  if (!stored) {
    ApplicationSettings.setString(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

function getUsers(): UserProfile[] {
  initUsers();
  const stored = ApplicationSettings.getString(USERS_KEY);
  return stored ? JSON.parse(stored) : defaultUsers;
}

function getMoods(): MoodEntry[] {
  const stored = ApplicationSettings.getString(MOODS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveMoods(moods: MoodEntry[]) {
  ApplicationSettings.setString(MOODS_KEY, JSON.stringify(moods));
}

export const localDataService = {
  loginWithEmail(email: string): UserProfile | null {
    const users = getUsers();
    return users.find(u => u.email === email) || null;
  },

  createMoodEntry(
    userId: string,
    mood: 'happy' | 'neutral' | 'sad',
    contextTag?: string,
    comment?: string
  ): boolean {
    try {
      const moods = getMoods();
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        user_id: userId,
        mood,
        context_tag: contextTag,
        comment,
        created_at: new Date().toISOString()
      };
      moods.push(newEntry);
      saveMoods(moods);
      return true;
    } catch (error) {
      console.error('Error creating mood entry:', error);
      return false;
    }
  },

  getAllMoodEntries(days: number = 30): MoodEntry[] {
    const moods = getMoods();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return moods.filter(m => new Date(m.created_at) >= cutoffDate);
  },

  getTodayMoodEntries(): MoodEntry[] {
    const moods = getMoods();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return moods.filter(m => {
      const entryDate = new Date(m.created_at);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  },

  calculateStats(entries: MoodEntry[]) {
    const happy = entries.filter(e => e.mood === 'happy').length;
    const neutral = entries.filter(e => e.mood === 'neutral').length;
    const sad = entries.filter(e => e.mood === 'sad').length;
    const total = entries.length;
    const avgScore = total > 0 ? (happy * 3 + neutral * 2 + sad * 1) / total : 0;

    return { happy, neutral, sad, total, avgScore };
  }
};
