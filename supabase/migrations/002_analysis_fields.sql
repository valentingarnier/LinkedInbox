-- Migration: Add analysis fields to conversations
-- Run this in Supabase SQL Editor

-- Create analysis status enum
CREATE TYPE analysis_status AS ENUM ('pending', 'analyzing', 'completed', 'failed');

-- Create prospect status enum
CREATE TYPE prospect_status AS ENUM (
  'no_response',
  'engaged',
  'interested',
  'meeting_scheduled',
  'not_interested',
  'wrong_person',
  'ghosted',
  'closed'
);

-- Add analysis fields to conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS analysis_status analysis_status DEFAULT 'pending';
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS analysis_error TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMP WITH TIME ZONE;

-- Basic computed metrics
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS engagement_rate FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS avg_response_time_minutes INT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS follow_up_pressure_score INT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS total_messages_sent INT DEFAULT 0;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS total_messages_received INT DEFAULT 0;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS consecutive_follow_ups INT DEFAULT 0;

-- LLM: Prospect Status
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS prospect_status prospect_status DEFAULT 'no_response';
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS prospect_status_confidence INT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS prospect_status_reasoning TEXT;

-- LLM: Cold Outreach Score (overall + dimensions)
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_score_overall FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_score_personalization FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_score_value_proposition FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_score_call_to_action FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_score_tone FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_score_brevity FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_score_originality FLOAT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_feedback TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS outreach_suggestions TEXT[];

-- Create analytics summary table
CREATE TABLE IF NOT EXISTS analytics_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avg_engagement_rate FLOAT,
  response_rate FLOAT,
  avg_response_time_minutes INT,
  total_follow_ups INT,
  avg_outreach_score FLOAT,
  total_conversations INT,
  market_pull_score FLOAT,
  hot_prospects UUID[], -- Array of conversation IDs
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS for analytics_summary
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON analytics_summary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics_summary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON analytics_summary FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_conversations_analysis_status ON conversations(analysis_status);
CREATE INDEX IF NOT EXISTS idx_conversations_prospect_status ON conversations(prospect_status);
CREATE INDEX IF NOT EXISTS idx_conversations_engagement_rate ON conversations(engagement_rate DESC);
