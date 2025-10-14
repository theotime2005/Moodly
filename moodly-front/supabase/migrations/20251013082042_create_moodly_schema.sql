/*
  # Create Moodly Schema

  ## Overview
  This migration creates the core database schema for the Moodly employee mood tracking application.

  ## New Tables

  ### 1. `profiles`
  Stores user profile information and role assignment.
  - `id` (uuid, primary key) - References auth.users
  - `email` (text, unique) - User email address
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'employee' or 'manager'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `mood_entries`
  Records each mood submission from employees.
  - `id` (uuid, primary key) - Unique entry identifier
  - `user_id` (uuid) - References profiles.id
  - `mood` (text) - Mood value: 'happy', 'neutral', or 'sad'
  - `context_tag` (text, nullable) - Optional context: 'Charge de travail', 'Ambiance', 'Management', 'Autre'
  - `comment` (text, nullable) - Optional additional comment
  - `created_at` (timestamptz) - Entry timestamp

  ## Security

  1. Row Level Security (RLS) enabled on all tables
  2. Profiles policies:
     - Users can read their own profile
     - Managers can read all profiles
     - Users can update their own profile
  3. Mood entries policies:
     - Employees can insert their own mood entries
     - Employees can read their own mood entries
     - Managers can read all mood entries

  ## Important Notes
  - All policies enforce authentication via `auth.uid()`
  - Timestamps use `now()` for automatic tracking
  - Foreign key constraints ensure data integrity
  - Indexes added for performance on frequent queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'manager')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood text NOT NULL CHECK (mood IN ('happy', 'neutral', 'sad')),
  context_tag text CHECK (context_tag IN ('Charge de travail', 'Ambiance', 'Management', 'Autre')),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood ON mood_entries(mood);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Managers can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Mood entries policies
CREATE POLICY "Employees can insert own mood entries"
  ON mood_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own mood entries"
  ON mood_entries FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Managers can read all mood entries"
  ON mood_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'manager'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
