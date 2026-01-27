-- Add cold outreach classification fields to conversations
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS is_cold_outreach BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS cold_outreach_reasoning TEXT DEFAULT NULL;

-- Index for filtering cold outreach conversations
CREATE INDEX IF NOT EXISTS idx_conversations_is_cold_outreach 
ON conversations(user_id, is_cold_outreach) 
WHERE is_cold_outreach = true;
