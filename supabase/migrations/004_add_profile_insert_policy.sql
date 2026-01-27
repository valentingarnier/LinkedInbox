-- Migration: Add INSERT policy for profiles table
-- This allows users to create their own profile row

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
